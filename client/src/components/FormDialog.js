import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import SignIn from './SignIn';
import SignUp from './SignUp';
export default function FormDialog({ setIsLogged ,setColorProfile}) {
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState("login");
    React.useEffect(() => { handleClickOpen() }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
               Log in
            </Button> */}
            <Dialog open={open} onClose={handleClose}>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
                {form == "login" ?
                    <SignIn setIsLogged={setIsLogged} setColorProfile={setColorProfile}  setForm={()=>setForm("register") } /> :
                    <SignUp setIsLogged={setIsLogged} setColorProfile={setColorProfile} setForm={()=>setForm("login") } />
                }
            </Dialog>
        </div>
    );
}