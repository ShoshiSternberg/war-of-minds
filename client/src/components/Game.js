import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import Question from './questions';
import ChoosingSubject from './ChoosingSubject';
import { Outlet, useNavigate } from 'react-router';
import Winners from './Winners';
import WaitingRoom from './WaitingRoom';
import TopPlayers from './TopPlayers';
import GameResults from './GameResults';
import joinSound from '../audio/the-notification-email-143029.mp3';
import Applause from '../audio/applause-8.mp3';
import PlayersInGame from './PlayersInGame';

//import Failure from 
const Game = () => {
  const [connection, setConnection] = useState(new HubConnectionBuilder()
    .withUrl("https://localhost:7203/TriviaHub")
    .configureLogging(LogLevel.Information)
    .build());

  const [res, setRes] = useState();
  const [question, setQuestion] = useState(null);
  const [toGame, setTogame] = useState(false)

  const [rightAnswer, setRightAnswer] = useState(null);
  const [winnerForQuestion, setWinnerForQuestion] = useState(null);
  const [playerAnswer, setPlayerAnswer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [manager, setManager] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const [Top10Players, setTop10Players] = useState([]);
  const [percentage, setPrecentage] = useState(0);
  const [subjectOfGame, setSubjectOfGame] = useState();
  const [avgRating, setAvgRating] = useState()
  let navigate = useNavigate();

  const startConnection = async () => {
    try {
      connection.serverTimeoutInMilliseconds = 1000 * 60 * 10;
      connection.on('ReceiveMessage', (user, message) => {
        console.log(user + ' : ' + message);
        setRes(message);
        if (message == "time over")
          alert(message);
        setTogame("Questions");
      });

      //הצטרפות לחדר המתנה- מעבר לחדר וקבלת הממתינים
      connection.on('JoinWaitingRoom', (manager1, Waitings, subject, avgRatingOfGame) => {
        setManager(manager1);
        setPlayers(Waitings);
        setSubjectOfGame(subject);
        setAvgRating(avgRatingOfGame);
        setTogame("waitingRoom");

        console.log("watings: ", Waitings);

      });

      //הצטרפות למשחק פעיל- מעבר למשחק וקבלת השחקנים
      connection.on('JoinGame', (players1) => {
        setPlayers(players1);
        setTogame("Questions");
        console.log("players: ", players1);
      });

      //הצטרפות שחקן אחר לחדר או למשחק
      connection.on('PlayerJoined', (newPlayer) => {
        setPlayers((prevWaitings) => [...prevWaitings, newPlayer]);
        console.log("player joined: ", newPlayer);

        const audio = new Audio(joinSound);
        audio.play();

      });

      connection.on('ReceiveQuestion', (question) => {
        console.log('Received question: ', question);
        setTogame("Questions");
        setRightAnswer(null);
        setWinnerForQuestion(null);
        setPlayerAnswer(null);
        setPrecentage(0);
        setQuestion(question);
      });

      connection.on('ReceiveAnswerAndWinner', (answer, winner) => {
        console.log('right answer:', answer);
        setRightAnswer(answer);
        setWinnerForQuestion(winner);
      });

      connection.on('TopPlayers', (TopPlayers) => {
        console.log('Top players:', TopPlayers);
        setTop10Players(TopPlayers)
        setTogame("TopPlayers");
      });

      //בכל פעם שמישהו עונה כולם מקבלים הודעה
      connection.on('playeranswered', (playerAnswered, percentage) => {
        console.log('player :', playerAnswered, " already answered!");
        setPlayerAnswer(playerAnswered);
        setPrecentage(percentage);
      });


      //סיום המשחק- קבלת המנצחים
      connection.on('ReceiveWinnerAndGameEnd', (GameResults) => {
        console.log("finnal winners: ", GameResults);
        if ((GameResults.playersSortedByScore[0] == user.playername) || (GameResults.playersSortedByScore[1] == user.playername) || (GameResults.playersSortedByScore[2] == user.playername)) {
          const audio = new Audio(Applause);
          audio.play();
        }
        setTogame("Winners");
        setGameResults(GameResults);
      });

      await connection.start();
      console.log(connection);

    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    startConnection();
  }, []);
  let user = JSON.parse(sessionStorage.user);

  const startGame = async () => {
    await connection.invoke("StartGameByManager");
  }

  const joinGame = async (subject) => {
    await connection.invoke("JoinExistingGameAsync", user.playerID, subject);
  }

  const createGame = async (subject, subjectID) => {
    await connection.invoke("CreateNewGameAsync", user.playerID, subject, subjectID);
  }

  const waitGame = async (subject, subjectID) => {
    await connection.invoke("JoinWaitingRoomAsync", user.playerID, subject, subjectID);
  }

  const sendAnswer = async (answer, time) => {
    await connection.invoke("GetAnswerAsync", question.questionId, answer, time);
  }

  const closeConnection = async () => {
    try {
      await connection.stop();
      navigate('/HomePage');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='app'>
      <div className="button-players-container">
        <button onClick={closeConnection}>↩</button>
        <PlayersInGame players={players} />
      </div>
      <h3 className='SubjectTitle'>{subjectOfGame}</h3>

      {toGame == "" ?
        <div className='window'>
          <ChoosingSubject joinGame={joinGame} createGame={createGame} waitGame={waitGame} closeConnection={closeConnection} />
        </div>
        : toGame == "Questions" ?
          <Question
            res={res}
            question={question}
            playerAnswer={playerAnswer}
            //qTime={qTime} 
            rightAnswer={rightAnswer}
            winnerForQuestion={winnerForQuestion}
            sendAnswer={sendAnswer}
            //startGame={startGame} 
            closeConnection={closeConnection}
            percentage={percentage}
          />

          : toGame == "waitingRoom" ? <WaitingRoom subject={subjectOfGame} rating={avgRating} players={players} manager={manager} startGame={startGame} closeConnection={closeConnection} /> :
            toGame == "Winners" ?
              <GameResults gameResults={gameResults} />
              : toGame == "TopPlayers" ? <TopPlayers players={Top10Players} /> : "game component"
      }
    </div>
  );
};

export default Game;


