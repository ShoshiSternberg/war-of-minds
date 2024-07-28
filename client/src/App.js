import React, { useEffect, useState } from 'react';
import './App.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import FormDialog from './components/FormDialog';
import HomePage from './components/HomePage';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';

// import { Outlet } from 'react-router-dom';
<style>
  @import url('https://fonts.googleapis.com/css2?family=Moirai+One&family=Varela+Round&display=swap');
</style>
function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState();
  const [colorProfile, setColorProfile] = useState();
  let navigate = useNavigate();
  useEffect(() => {
    navigate("/HomePage");
  }, [])


  const profileOrLogin = () => {
    if (sessionStorage.user != undefined && sessionStorage.user != "")
      navigate("/MyProfile");
    else {
      setOpenFormDialog(true);
    }
  }

  return (
    <div className={`app-container ${isNavbarOpen ? '' : 'navbar-closed'}`}>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'rgb(203, 202, 203)' ,padding:'20px'}}>
          <Toolbar>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link id="warOfMindsLogo" to={{ pathname: "/HomePage", state: { value: 1 } }}>War of minds</Link>
            </Typography>
            <div id="cont">
              <div className="right-side">
              {sessionStorage.user != undefined && sessionStorage.user != "" ? <Avatar onClick={()=>{navigate('/MyProfile') }} sx={{ width: 70, height: 70, bgcolor: colorProfile, fontSize: "40px" ,cursor:"pointer"}}>{(JSON.parse(sessionStorage.user).playerName).charAt(0)}</Avatar> : <button onClick={profileOrLogin} id="profileButton" ></button>}

              
                <button id="exit" onClick={() => { sessionStorage.setItem("user", ""); navigate("/HomePage") }}>exit</button>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </Box>

      {openFormDialog && (sessionStorage.user == "" || sessionStorage.user == undefined) && <FormDialog setIsLogged={setIsLogged} setColorProfile={setColorProfile} setOpenFormDialog={setOpenFormDialog} />}

      <div className="content" >

        <Outlet>

        </Outlet>
      </div>
    </div>
  );
}

export default App;