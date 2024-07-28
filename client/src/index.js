import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import App from './App';

import MyHistory from './components/MyHistory';
import MyProfile from './components/MyProfile';
import HomePage from './components/HomePage';
import Game from './components/Game';
import ChoosingSubject from './components/ChoosingSubject';
import WaitingRoom from './components/WaitingRoom';
import Question from './components/questions';
import About from './components/About';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/HomePage' element={<HomePage />}>
          {/* <Route path='/HomePage/Login_Register' element={<Login_Register/>}></Route> */}
        </Route>

        <Route path='/Game' element={<Game />}>
          <Route path='/Game/ChoosingSubject' element={<ChoosingSubject />}></Route>
          <Route path='/Game/WaitingRoom' element={<WaitingRoom />}></Route>
          <Route path='/Game/Question' element={<Question />}></Route>
        </Route>

        <Route path='/MyHistory' element={<MyHistory />}></Route>
        <Route path='/MyProfile' element={<MyProfile />}></Route>
        <Route path='/About' element={<About />}></Route>
      </Route>

    </Routes>
  </BrowserRouter>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
