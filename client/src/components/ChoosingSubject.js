// export default ChoosingSubject;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../horizontal_slider.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import styled from 'styled-components';
import $ from 'jquery';
import '../App.css';
import { Card, CardImg, CardBody } from 'reactstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
const { Button } = require("react-bootstrap");

const HorizontalSlider = (props) => {
    const [data, setData] = useState([]);
    const [width, setWidth] = useState(props.width || "150");
    const [height, setHeight] = useState(props.height || "90");
    const [subject, setSubject] = useState();
    const [subjectID, setSubjectID] = useState();
    useEffect(() => {
        axios.get(`https://opentdb.com/api_category.php`)
            .then(res => {
                setData(res.data["trivia_categories"]);
            });
    }, []);

    const scroll = (direction) => {
        let far = $(`.menu${props.id}`).width() / 2 * direction;
        let pos = $(`.menu${props.id}`).scrollLeft() + far;
        $(`.menu${props.id}`).animate({ scrollLeft: pos }, 800);
    };
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

    const Car = styled.div`
    margin:15px;
    padding:10px;
    display: inline-block;
    text-align: center;
    width: ${width}px;
    height: ${height}px; 
    cursor:pointer; 
  `;

    return (
        <div className="container">

            <div className="row">
                <div className="parent col-md-1">
                    <a className={`prev2 pv${props.id}`} onClick={() => scroll(-1)}>&#10094;</a>
                </div>

                <div className={`main menu${props.id} col-md-10 row`}>
                    {data.map((element, index) => (
                        <Car
                            key={index}
                            className={`subjectForChoosing `}
                            onClick={() => {
                                setSubject(element.name);
                                setSubjectID(parseInt(element.id));
                            }}
                            style={element.name === subject ? { backgroundColor: generateRandomColor() } : {}}
                        >
                            {element.name}
                        </Car>
                    ))}

                </div>

                <div className="col-md-1 row">
                    <a className={`next2 nt${props.id}`} onClick={() => scroll(1)}>&#10095;</a>
                </div>
            </div>
            {subject != null && <div className='DivSubjectExplaination'>
                you choose the subject: <br />
                <span id="SpanSubjectExplaination" >{subject}</span><br />
                beautifull!!<br />
                now you can choose one of these 3 options. <br />
                enjoy anywhere!!!
            </div>}

            <div className="button-group">
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="create-tooltip">you are creating a new waiting room. the time of the begining of the game is depends on you.<br/>
                    until you will start the game, another players can join</Tooltip>}
                >
                    <Button className='subjectButtons' onClick={() => props.createGame(subject, subjectID)} disabled={!subject}>
                        Create new game
                    </Button>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="join-tooltip">Notice that you are joining to game that already started so you may not earn the maximum score in this game</Tooltip>}
                >
                    <Button className='subjectButtons' onClick={() => props.joinGame(subject)} disabled={!subject}>
                        Join to existing game
                    </Button>
                </OverlayTrigger>

                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="wait-tooltip">Join a waiting room that someone has opened but hasn't started the game yet. This is exactly the time!</Tooltip>}
                >
                    <Button className='subjectButtons' onClick={() => props.waitGame(subject, subjectID)} disabled={!subject}>
                        Wait to start game
                    </Button>
                </OverlayTrigger>
            </div>
        </div>
    );
};

export default HorizontalSlider;