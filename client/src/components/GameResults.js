import React, { useEffect } from 'react';
import { Link, Outlet, useSearchParams } from 'react-router-dom';

const GameResults = ({ gameResults,singlePlayer }) => {
  const winners = gameResults.playersSortedByScore;
  const preRating = gameResults.myUpdatedRating;
  const UpdatedRating = gameResults.myUpdatedRating;
  useEffect(()=>{
     alert(winners);
  });
 

  return (
    <div>
      <h3>Game Results</h3>
      <div>
        <div className='TopPlayers winners'>
          <ul className='subjects'>

            {winners.map((element, index) => (
              <li key={index}>
                <div class="container">

                  <div class="row">
                    <div class="col-md-12 text-center">
                      <h3 class="animate-charcter"> {element}</h3>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {singlePlayer&&"Playing without competitors cannot change your rating"}
        {/* <span className='ratingResults'>pre rating <br/>{preRating}</span>
        <span className='ratingResults'>updated rating<br/> {UpdatedRating}</span> */}

      </div>
    </div>

  );
}

export default GameResults;