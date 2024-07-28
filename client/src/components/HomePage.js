import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import FormDialog from './FormDialog';

const HomePage = () => {
  const [isLogged, setIsLogged] = useState(false);

  let navigate = useNavigate();
  const enterToGame = () => {
    if(sessionStorage.user!=undefined&&sessionStorage.user!="")
    navigate('/Game');
    else
    alert("You must be logged in to start playing")
  };

  return (
    <>
      <div className="HomePage">
        {/* {!isLogged && <FormDialog setIsLogged={setIsLogged} /> } Render the FormDialog component when isLogged is false */}
        
        {/* <div className="content"> */}
          {/* {isLogged ? ( */}
            <>
              
              <button onClick={enterToGame} className='enterToGameButton'>Enter the game!</button>
            </>
          {/* ) : ( */}
            
          {/* )} */}
        {/* </div> */}
      </div>
    </>
  );
};

export default HomePage;