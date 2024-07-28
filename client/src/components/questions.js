import React, { useEffect, useRef, useState } from 'react';
import CountdownTimer from './Timer';
import ProgressBar from './progressBar';
import counter from '../audio/10-seconds-game-countdown-142456.mp3';
import failure from '../audio/failure-1-89170.mp3';
import success from '../audio/new-level-142995.mp3';

function Question({ question, closeConnection, sendAnswer, rightAnswer, playerAnswer, winnerForQuestion, percentage }) {
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionChange, setQuestionChange] = useState(false);
  const startTimeRef = useRef();
  const [timeToAnswer, setTimeToAnswer] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  useEffect(() => {
    setIsPlaying(true);
    setQuestionChange(true);
    setSelectedAnswer(null);
    const audio = new Audio(counter);
    audio.play();
    startTimeRef.current = Date.now(); // Store the current time when the question changes
    setTimeLeft(10);

  }, [question]);

  useEffect(() => {
    // Change the color of the right answer when it is received
    if (selectedAnswer === rightAnswer && rightAnswer != null) {
      const audio = new Audio(success);
      audio.play();
    } else {
      const audio = new Audio(failure);
      audio.play();
    }
    const buttons = document.getElementsByClassName('answer-button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button.value === rightAnswer) {
        button.classList.add('correct-answer');
        setTimeout(() => {
          button.classList.remove('correct-answer');
        }, 5000); // Remove the class after 1 second (adjust the delay as needed)
      }
    }

  }, [rightAnswer]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      // Handle the timer reaching 0, if needed
      document.getElementById("clock").style.border = "solid 5px red";
      clearInterval(timer);
    }
    else {
      document.getElementById("clock").style.border = "solid 5px white";
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);


  if (!question) {
    // Display a loading message or a placeholder while the question is being received
    return <div>Loading...</div>;
  }

  function handleAnswerClick(answer) {
    setSelectedAnswer(answer);
    const endTime = Date.now();
    const timeDifference = Math.floor((endTime - startTimeRef.current) / 1000);
    setTimeToAnswer(timeDifference);
    sendAnswer(answer, timeDifference);
  }

  const renderNewDiv = () => {
    return <div className="my-custom-div">{playerAnswer}</div>;
  };

  const decodeHtmlEntities = (str) => {
    const element = document.createElement('div');
    element.innerHTML = str;
    return element.innerText;
  };

  const getBorderColor = (index) => {
    const colors = ['rgb(233, 80, 3)', 'yellow', 'rgb(20, 244, 20)', 'rgb(252, 9, 207)'];
    return colors[index % colors.length];
  };




  return (
    <div>
      
      <div className="questionPage">


        <div id="clock" >
          <span id="seconds" className="clock-text">{timeLeft}</span>
        </div>

        <h3 id="question">
          <span id="questionId">{question.questionId+1}</span> {decodeHtmlEntities(question.question)}
        </h3>
        <div className="answer-grid">
          {question.incorrect_answers.map((answer, index) => (
            <button
              className={`answer-button ${selectedAnswer === answer ? 'selected-answer' : ''} ${rightAnswer === answer ? 'correct-answer-animation' : ''}`}
              style={{ borderColor: getBorderColor(index), backgroundColor: selectedAnswer === answer ? getBorderColor(index) : '' }}
              key={index}
              onClick={() => handleAnswerClick(answer)}
              disabled={selectedAnswer !== null}
              value={answer}
            >
              {decodeHtmlEntities(answer)}
            </button>
          ))}
        </div>
        <div className="ProgressBarContainer">
          <ProgressBar completed={percentage} />
        </div>
        <span >
          {winnerForQuestion != null ? (
            <div className='theFastest' >
              <span id="theFastestTitle">The fastest </span><br />
              {winnerForQuestion === 'nobody' ? (
                'nobody :('
              ) : (
                winnerForQuestion
              )}
            </div>
          ) : playerAnswer != null ? (
            <div className="AlreadyAnswered">{renderNewDiv()}</div>
          ) : (
            <></>
          )}
        </span>
      </div>
    </div>
  );
}

export default Question;