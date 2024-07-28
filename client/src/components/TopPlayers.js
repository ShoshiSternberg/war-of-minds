
import React, { useState, forwardRef } from 'react';
import '../App.css';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, Outlet, useSearchParams } from 'react-router-dom';
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
const TopPlayers = ({ players }) => {
    const tooltipText = "Only players who have a rating close to this rating are allowed to join here.";
    const generateRandomColor = () => {

        const strongColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FF0f0F', '#000FFF']; // Example strong color palette

        const randomIndex = Math.floor(Math.random() * strongColors.length);
        return strongColors[randomIndex];

    };

    return (
        <div>
            <h3 className='TopPlayersTitle'>10 Top Players---</h3>
           
            <div className='containerWaitings'>

                <ul className='waitings'>
                    {players.map((element, index) => (
                        <li style={{ color: generateRandomColor() ,fontSize:"30px"}} className='waitingsElement' key={index}>{element}</li>
                    ))}
                </ul>                
            </div>

        </div>

    );
}

export default TopPlayers;