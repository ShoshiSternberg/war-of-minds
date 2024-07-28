import React, { useState, forwardRef } from 'react';
import '../App.css';
import { Link, Outlet } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const CustomTooltip = forwardRef(({ children, tooltipText, ...props }, ref) => {
    return (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="create-tooltip">{tooltipText}</Tooltip>}
        >
            <span ref={ref} {...props}>
                {children}
            </span>
        </OverlayTrigger>
    );
});

function WaitingRoom({ players, subject, rating, manager, startGame, closeConnection }) {
    const tooltipText = "Only players who have a rating close to this rating are allowed to join here.";
    const generateRandomColor = () => {

        const strongColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FF0f0F', '#000FFF']; // Example strong color palette

        const randomIndex = Math.floor(Math.random() * strongColors.length);
        return strongColors[randomIndex];

    };

    return (
        <>
            
            <div className='waitingRoomTitle'>waiting room</div>   
            <div className='WaitingsTitle'>
            {/* <div className='subjectOfRoom'>{subject}</div> */}
                <CustomTooltip id="ratingAvg" tooltipText={tooltipText}>

                    average rating: {rating}
                </CustomTooltip>
            </div>

            <div className='containerWaitings'>

                <ul className='waitings'>
                    {players.map((element, index) => (
                        <li style={{ color: generateRandomColor() }} className='waitingsElement' key={index}>{element.playerName}</li>
                    ))}
                </ul>
                {manager && <CustomTooltip id='startGame' tooltipText={"allow to manager only"} onClick={startGame}>

                    start game
                </CustomTooltip>}
            </div>


        </>
    );
}

export default WaitingRoom;