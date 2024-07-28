import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../horizontal_slider.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import styled from 'styled-components';
import $ from 'jquery';
import '../App.css';
import { Avatar } from '@mui/material';
const { Button } = require("react-bootstrap");

const PlayersInGame = ({ props, players }) => {
  const [width, setWidth] = useState("150");
  const [height, setHeight] = useState("20");

  const scroll = (direction) => {
    let far = $(`.menu${2}`).width() / 2 * direction;
    let pos = $(`.menu${2}`).scrollLeft() + far;
    $(`.menu${2}`).animate({ scrollLeft: pos }, 800);
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
    margin: 15px;
    padding: 10px;
    display: inline-block;
    text-align: center;
    width: 10px;
    height: ${height}px; 
    cursor: pointer; 
  `;

  return (
    <div className="container">
      <div className="row">
        {players.count>20&&<div className="parent col-md-1">
          <a className={`prev2 pv${2}`} onClick={() => scroll(-1)}>&#10094;</a>
        </div>}
        <div className={`main menu${2} col-md-10 row`}>
          {players.map((element, index) => (
            <Car key={index} title={element.playerName+"  "+element.playerAddress}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: generateRandomColor(), fontSize: "20px", cursor: "pointer" }}>
                {(element.playerName).charAt(0)}
              </Avatar>
            </Car>
          ))}
        </div>
       {players.count>20&& <div className="col-md-1 row">
          <a className={`next2 nt${2}`} onClick={() => scroll(1)}>&#10095;</a>
        </div>}
      </div>
    </div>
  );
};

export default PlayersInGame;