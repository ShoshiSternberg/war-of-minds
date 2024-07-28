import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp({ setIsLogged, setForm ,setColorProfile}) {
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();

    
    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = {
            "playerID": 0,
            "playerName": name,
            "playerPassword": password,
            "playerEmail": email,
            "dateOfRegistration": "2023-05-03T22:02:33.445Z",
            "eloRating": 1500,
            "playerAddress": address,
            "games": [
            ]
        };

        console.log("axios");
        await axios.post(`https://localhost:7203/api/Player`, user)
            .then(res => {
                console.log(res);
                console.log(res.data);
                sessionStorage.setItem('user', JSON.stringify(res.data));
                alert("You have successfully registered");
                setIsLogged(true);
                setColorProfile(generateRandomColor());
            })
            .catch(err => {
                console.log(err);
                alert("An error occurred, change the name or password and try again");
                sessionStorage.setItem('user', {});
            })

    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="Name"
                                    required
                                    fullWidth
                                    id="Name"
                                    label="Name"
                                    onChange={e => setName(e.target.value)}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    required
                                    fullWidth
                                    id="Address"
                                    label="Address"
                                    name="address"
                                    autoComplete="address"
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link onClick={setForm} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}