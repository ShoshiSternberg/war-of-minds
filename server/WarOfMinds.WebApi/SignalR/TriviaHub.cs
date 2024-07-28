﻿using WarOfMinds.Common.DTO;
using WarOfMinds.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Data;
using Microsoft.AspNetCore.SignalR;
using RestSharp;
using Microsoft.AspNetCore.Authorization;
using RestSharp.Authenticators;
using System.Linq;
using WarOfMinds.Repositories.Entities;
using WarOfMinds.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

namespace WarOfMinds.WebApi.SignalR
{

    public class TriviaHub : Hub
    {
        private readonly IGameService _gameService;
        private readonly IPlayerService _playerService;

        private readonly IEloCalculator _eloCalculator;
        private readonly IDictionary<string, UserConnection> _connections;
        private readonly IDictionary<string, GroupData> _groupData;
        private readonly IHubContext<TriviaHub> _hubContext;
        private readonly IConfiguration _configuration;



        public TriviaHub(IGameService gameService, IPlayerService playerService,
            IEloCalculator eloCalculator, IDictionary<string, UserConnection> connections, IDictionary<string, GroupData> groupData,
            IHubContext<TriviaHub> hubContext, IConfiguration configuration)
        {
            _gameService = gameService;
            _playerService = playerService;
            _eloCalculator = eloCalculator;
            _connections = connections;
            _groupData = groupData;
            _hubContext = hubContext;
            _hubContext = hubContext;
            _configuration = configuration.GetSection("TriviaHub");

            GameStarted += async (sender, e) =>
            {

                if (_groupData[$"game_{e.game.GameID}"].questions == null)
                {//, the right difficulty
                    await GetQuestionsAsync(e.game.GameID, e.SubjectId, "hard");
                    await ExecuteAsync(e.game);
                }
            };

        }

        //יצירה וטיפול באירוע של הפעלת למשחק
        public delegate void GameEventHandler(object sender, GroupData e);

        public event GameEventHandler GameStarted;


        protected virtual void OnGameStarted(GroupData e)
        {
            GameStarted?.Invoke(this, e);
        }



        // הצטרפות למשחק קיים
        public async Task JoinExistingGameAsync(int playerId, string subject)
        {
            PlayerDTO player = await _playerService.GetByIdAsync(playerId);
            GameDTO game = await _gameService.FindActiveGameAsync(subject, player);
            if (game == null)
            {
                await Clients.Caller.SendAsync("ReceiveMessage", $"there are not active game in subject {subject} with your rating.");

            }
            if (_connections.Values.Any(p => (p.player == player) && (p.game == game.GameID)))
            {
                //אם הוא מנסה להצטרף לאותו משחק שוב
                await Clients.Caller.SendAsync("ReceiveMessage", "You may not join the same game twice!");
            }
            else
            {
                _connections.Add(Context.ConnectionId, new UserConnection(player, game.GameID));
                await Groups.AddToGroupAsync(Context.ConnectionId, $"game_{game.GameID}");
                _groupData[$"game_{game.GameID}"].NumOfPlayers++;
                await Clients.Group($"game_{game.GameID}").SendAsync("PlayerJoined", player);
                List<PlayerDTO> members = _connections.Values.ToList().Where(e => e.game == game.GameID && !(e.player.PlayerID == playerId)).Select(e => e.player).ToList();
                await Clients.Caller.SendAsync("JoinGame", members);
                //$"player {player.PlayerName} has joined the game{game.GameID} in subject {subject.Subjectname}.");

                Console.WriteLine($"player {player.PlayerID} joined to game (in process) {game.GameID}");
            }
        }

        // פתיחת חדר חדש
        public async Task CreateNewGameAsync(int playerId, string subject, int subjectId)
        {
            PlayerDTO player = await _playerService.GetByIdAsync(playerId);

            GameDTO game = new GameDTO();
            game.Subject = subject;
            game.GameDate = DateTime.Now;
            game.Rating = player.ELORating;
            game.IsActive = true;
            game.OnHold = true;
            game.Players = new List<PlayerDTO>();
            game.Players.Add(player);
            game = await _gameService.AddGameAsync(game);
            if (game == null)
            {
                return;
            }
            if (_connections.Values.Any(p => (p.player == player) && (p.game == game.GameID)))
            {
                //אם הוא מנסה להצטרף לאותו משחק שוב
                await Clients.Caller.SendAsync("ReceiveMessage", "You may not join the same game twice!");
            }
            else
            {
                //לא בטוח שצריך את הנעילה
                lock (_groupData)
                {
                    if (!_groupData.ContainsKey($"game_{game.GameID}"))
                    {
                        _groupData.Add($"game_{game.GameID}", new GroupData());
                    }
                }
                //אם הוא הראשון שהצטרף- המשך הטיפול מחוץ לקטע הקריטי
                if (_groupData[$"game_{game.GameID}"].game == null)
                {
                    _groupData[$"game_{game.GameID}"].GameManagerConnectionID = Context.ConnectionId;
                    _groupData[$"game_{game.GameID}"].game = game;
                    _groupData[$"game_{game.GameID}"].SubjectId = subjectId;
                    await _gameService.UpdateGameAsync(game.GameID, _groupData[$"game_{game.GameID}"].game);
                }
                //לא צריך לנעול כי בכל מקרה זה מפתחות שונים              

                _connections.Add(Context.ConnectionId, new UserConnection(player, game.GameID));

                await Groups.AddToGroupAsync(Context.ConnectionId, $"game_{game.GameID}");
                _groupData[$"game_{game.GameID}"].NumOfPlayers++;


                List<PlayerDTO> members = _connections.Values.ToList().Where(e => e.game == game.GameID).Select(e => e.player).ToList();
                await Clients.Caller.SendAsync("JoinWaitingRoom", true, members, subject, game.Rating);

                Console.WriteLine($"player {player.PlayerID} open new waiting room to game {game.GameID}");
            }
        }

        //הצטרפות לחדר המתנה
        public async Task JoinWaitingRoomAsync(int playerId, string subject, int subjectId)
        {
            PlayerDTO player = await _playerService.GetByIdAsync(playerId);
            GameDTO game = await _gameService.FindOnHoldGameAsync(subject, player);
            if (game == null)
            {
                await CreateNewGameAsync(playerId, subject, subjectId);//אם לא מצאו חדר בהמתנה פותחים חדר חדש
                return;
            }
            else
            {
                if (_connections.Values.Any(p => (p.player == player) && (p.game == game.GameID)))
                {
                    //אם הוא מנסה להצטרף לאותו משחק שוב
                    await Clients.Caller.SendAsync("ReceiveMessage", "You may not join the same game twice!");
                }
                else
                {
                    //לא צריך לנעול כי בכל מקרה זה מפתחות שונים          
                    _connections.Add(Context.ConnectionId, new UserConnection(player, game.GameID));

                    await Groups.AddToGroupAsync(Context.ConnectionId, $"game_{game.GameID}");
                    _groupData[$"game_{game.GameID}"].NumOfPlayers++;
                    List<PlayerDTO> members = _connections.Values.ToList().Where(e => e.game == game.GameID && !(e.player.PlayerID == playerId)).Select(e => e.player).ToList();
                    await Clients.Caller.SendAsync("JoinWaitingRoom", false, members, subject, game.Rating);
                    await Clients.Group($"game_{game.GameID}").SendAsync("PlayerJoined", player);
                    Console.WriteLine($"player {player.PlayerID} joined to waiting room for game {game.GameID}");
                }
            }
        }

        //הפעלת המשחק על ידי מי שפתח את החדר
        public async Task StartGameByManager()
        {

            GroupData game = _groupData[$"game_{_connections[Context.ConnectionId].game}"];

            if (_groupData[$"game_{game.game.GameID}"].GameManagerConnectionID == Context.ConnectionId)
            {
                _groupData[$"game_{game.game.GameID}"].IsActive = true;
                game.game.OnHold = false;
                await _gameService.UpdateGameAsync(game.game.GameID, game.game);
                OnGameStarted(game);
            }

        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                Clients.Group($"game_{userConnection.game}").SendAsync("ReceiveMessage", "my app", $"{userConnection.player.PlayerID} has left");
                List<PlayerDTO> members = _connections.Values.ToList().Where(e => e.game == userConnection.game).Select(e => e.player).ToList();
                Clients.Group($"game_{userConnection.game}").SendAsync("JoinWaitingRoom", members);
            }

            return base.OnDisconnectedAsync(exception);
        }



        //קבלת השאלות מהרשת, המרה לליסט של אובייקטים מסוג שאלה
        [HttpGet("{subject},{diffuculty}", Name = "GetRanking")]
        public async Task GetQuestionsAsync(int gameId, int subject, string difficulty)
        {
            try
            {
                int amount = _configuration.GetValue<int>("NumOfQuestions");//מספר השאלות            
                var client = new RestClient($"https://opentdb.com/api.php?amount={amount}&category={subject}&difficulty={difficulty}");
                var request = new RestRequest("", Method.Get);
                RestResponse response = await client.ExecuteAsync(request);

                string jsonString = response.Content;
                //המרה מג'יסון לאובייקט שאלה
                Root questionsList =
                    JsonSerializer.Deserialize<Root>(jsonString);

                if (questionsList.results == null)//אם אין אינטרנט בינתיים שיקרא מהדף
                {
                    string text = File.ReadAllText(@"H:\תכנות שנה ב תשפג\שושי שטרנברגר\פרויקט גמר\finnal project\WarOfMinds\WarOfMinds.WebApi\SignalR\Questions.json");
                    questionsList = JsonSerializer.Deserialize<Root>(text);
                }
                _groupData[$"game_{gameId}"].questions = questionsList.results;
                // Set questionId for each Question object
                int questionId = 0;
                foreach (var question in questionsList.results)
                {
                    question.questionId = questionId++;
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

        }

        //מהלך המשחק
        public async Task ExecuteAsync(GameDTO game)
        {
            try
            {
                int timeToAnswer = 10000;// _configuration.GetValue<int>("TimeToAnswer") * 1000; //10 שניות
                int timeToSeeAnswer = _configuration.GetValue<int>("timeToSeeAnswer") * 1000;
                Random rnd = new Random();
                rnd.Next();
                foreach (Question item in _groupData[$"game_{game.GameID}"].questions)
                {
                    _groupData[$"game_{game.GameID}"].IsTimeOver = false;
                    //שולח את השאלה לכל השחקנים
                    await DisplayQuestionAsync(game.GameID, item);
                    //כאן השהיה של כמה שניות לקבלת התשובות
                    await Task.Delay(timeToAnswer);
                    _groupData[$"game_{game.GameID}"].IsTimeOver = true;
                    //שולח את התשובה לכל השחקנים
                    //חישוב הניקוד של השאלה הזו עבור כל השחקנים
                    string winner = SortPlayersByAnswers(game.GameID);
                    await ReceiveAnswerAndWinner(game.GameID, winner, item);
                    await Task.Delay(timeToSeeAnswer);//השהיה של כמה שניות להצגת התשובה
                    if (item.questionId % 7 == 0 && item.questionId != 0)//פעם ב-8 שאלות
                    {
                        await Send10TopPlayers(game.GameID);
                        await Task.Delay(timeToSeeAnswer);
                    }

                }
                await Scoring(game.GameID);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        private async Task Send10TopPlayers(int gameID)
        {
            try
            {
                await _hubContext.Clients.Group($"game_{gameID}").SendAsync("TopPlayers", (await TopPlayers(gameID, 10)).Select(p => GetUserConnectionByPlayerID(p).player.PlayerName).ToList());
            }
            catch (Exception e) { }
        }


        public string SortPlayersByAnswers(int gameId)
        {
            try
            {
                string winner = "nobody";
                if (_groupData[$"game_{gameId}"].gameResults != null)
                {
                    //אם יש שחקנים שענו נכון על השאלה ממינים אותם לפי סדר המענה ושולפים את השחקן הראשון שזמן המענה שלו היה הכי נמוך

                    //ברשימה הזו יש רק את מי שענה נכון על השאלה. צריך למיין את הרשימה לפי זמן מענה, לראות מי המנצח ולעדכן לכל השחקנים את כל הניקודים.
                    List<AnswerResult> answers = _groupData[$"game_{gameId}"].gameResults;
                    if (answers.Count > 0)
                    {
                        answers.Sort();//מיון התשובות לפי נכונות וזמן
                        winner = answers[0].player.PlayerName;
                    }

                }
                //ניקוי לתשובות של השאלה הבאה
                if (_groupData[$"game_{gameId}"].gameResults != null)
                {
                    _groupData[$"game_{gameId}"].gameResults.Clear();
                    _groupData[$"game_{gameId}"].RightAnswers = 0;
                }
                return winner;
            }
            catch (Exception e) { return "error"; }

        }

        public async Task ReceiveAnswerAndWinner(int gameId, string winner, Question q)
        {
            //כדאי לשלוח את השם של השחקן שענה נכון ראשון

            //כרגע שולח רק את התשובה
            try
            {
                await _hubContext.Clients.Group($"game_{gameId}").SendAsync("ReceiveAnswerAndWinner", q.correct_answer, winner);
            }
            catch (Exception e) { }
        }

        public async Task GetAnswerAsync(int qNum, string answer, int time)
        {
            try
            {
                if (_groupData[$"game_{_connections[Context.ConnectionId].game}"].IsTimeOver == false)
                {
                    Question q = _groupData[$"game_{_connections[Context.ConnectionId].game}"].questions[qNum];
                    if (q.correct_answer == answer)
                    {
                        int score = _configuration.GetValue<int>("timeToAnswer") - time + 1;//על כל שניה של איחור מפסידים נקודה
                        _connections[Context.ConnectionId].score += score;//מוסיפים את הנקודות על השאלה הזו לניקוד בכל המשחק
                        AnswerResult result = new AnswerResult();
                        result.connectionId = Context.ConnectionId;
                        result.player = _connections[Context.ConnectionId].player;
                        result.qNum = qNum;
                        result.AnswerTime = time;//ההפרש בין הזמן שהוא קיבל את השאלה לבין הזמן שהוא שלח את התשובה.
                        if (_groupData[$"game_{_connections[Context.ConnectionId].game}"].gameResults == null)
                        {
                            lock (_groupData[$"game_{_connections[Context.ConnectionId].game}"])
                            {
                                //if it is the first question, we have to create a new dictionary
                                _groupData[$"game_{_connections[Context.ConnectionId].game}"].gameResults = new List<AnswerResult>();
                                _groupData[$"game_{_connections[Context.ConnectionId].game}"].RightAnswers++;
                            }
                        }
                        lock (_groupData[$"game_{_connections[Context.ConnectionId].game}"].gameResults)
                        {
                            // Add the AnswerResult object to the list at the specified key
                            _groupData[$"game_{_connections[Context.ConnectionId].game}"].gameResults.Add(result);

                        }
                    }
                    //שולחים לו מייד אם ענה נכון או לא
                    //await Clients.Caller.SendAsync("ReceiveAnswerAndWinner",
                    //    $" Your answer has been captured in the system [{q.correct_answer == answer}], the correct answer is:{_groupData[$"game_{_connections[Context.ConnectionId].game}"].questions[qNum].correct_answer}");
                    int num = _groupData[$"game_{_connections[Context.ConnectionId].game}"].NumOfPlayers;
                    await Clients.Group($"game_{_connections[Context.ConnectionId].game}").SendAsync("PlayerAnswered", _connections[Context.ConnectionId].player.PlayerName, 100 * (_groupData[$"game_{_connections[Context.ConnectionId].game}"].RightAnswers / num));

                }
                else
                {
                    await Clients.Caller.SendAsync("ReceiveMessage","error", "time over");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }

        //מחזיר את מספר השחקנים המובילים
        private async Task<List<PlayerDTO>> TopPlayers(int gameId, int num)
        {
            try
            {
                List<PlayerDTO> players = (await _gameService.GetByIdInNewScopeAsync(gameId)).Players.ToList();
                players.Sort((p1, p2) => (GetUserConnectionByPlayerID(p2).score).CompareTo(GetUserConnectionByPlayerID(p1).score));
                return players.GetRange(0, Math.Min(players.Count, num));
            }
            catch (Exception e) { return null; }
        }


        private async Task Scoring(int gameId)
        {
            try
            {

                List<PlayerDTO> players = await TopPlayers(gameId, int.MaxValue);
                List<int> scores = players.Select(p => GetUserConnectionByPlayerID(p).score).ToList();
                await _eloCalculator.UpdateRatingOfAllPlayers(gameId, players, scores);
                //עדכון מצב המשחק ללא פעיל
                _groupData[$"game_{gameId}"].game.IsActive = false;
                await _gameService.UpdateGameInNewScopeAsync(_groupData[$"game_{gameId}"].game);
                //איכשהו לשלוח לשחקן את הציון המעודכן שלו.
                //אולי בסיום דרך הקונטרולר
                foreach (var item in _connections)
                {
                    dynamic results = new
                    {
                        PlayersSortedByScore = players.Select(p => GetUserConnectionByPlayerID(p).player.PlayerName).ToList().GetRange(0, Math.Min(players.Count, 10)),
                        myPreRating = item.Value.player.ELORating,
                        myUpdatedRating = await _playerService.GetPlayerByIdInNewScopeAsync(item.Value.player.PlayerID)

                    };
                    await _hubContext.Clients.Client(item.Key).SendAsync("ReceiveWinnerAndGameEnd", (object)results);
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }



        //מציאת UserConnection לפי playerID
        private UserConnection GetUserConnectionByPlayerID(PlayerDTO player)
        {
            try
            {
                var userConnection = _connections.Values.FirstOrDefault(conn => conn.player.PlayerID == player.PlayerID);

                if (userConnection == null)
                    return null;
                return userConnection;
            }
            catch (Exception e)
            {
                return null;
            }
        }



        [HubMethodName("ReceiveQuestion")]
        private async Task DisplayQuestionAsync(int gameId, Question question)
        {
            try
            {
                Random rand = new Random();
                int randomInt = rand.Next(4);//מגרילים מקום לתשובה הנכונה                     
                Question q = new Question();
                q.question = question.question;
                q.questionId = question.questionId;
                q.incorrect_answers = question.incorrect_answers;
                q.incorrect_answers.Insert(randomInt, question.correct_answer);//מוסיפים את  התשובה הנכונה לרשימת התשובות
                q.difficulty = question.difficulty;
                q.category = question.category;


                await _hubContext.Clients.Group($"game_{gameId}").SendAsync("ReceiveQuestion", q);
            }
            catch (Exception e) { Console.WriteLine(e); }
        }



        [HubMethodName("ReceiveWinnerAndGameEnd")]
        private async Task DisplayWinnerAndEndGameAsync(int gameId, dynamic results)
        {
            //שליחת המנצחים
            try
            {
                object res = results;
                await _hubContext.Clients.Group($"game_{gameId}").SendAsync("ReceiveWinnerAndGameEnd", res);
            }
            catch (Exception e) { Console.WriteLine(e); }

        }




    }

}
