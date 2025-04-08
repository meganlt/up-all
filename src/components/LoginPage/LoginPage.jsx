import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import './LoginPage.css'
import {
  Paper,
  Box,
  Button,
  FormLabel,
  Grid2,
  TextField
} from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const logIn = useStore((state) => state.logIn)
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [])

  const handleLogIn = (event) => {
    event.preventDefault();

    logIn({
      username: username,
      password: password,
    })
  };

  return (
    <>
      
      <Paper elevation={1} sx={{ p: 0, mb: 4, maxWidth: '1000px', m: 'auto' }}>
      <Box sx={{ flexGrow: 1}}>
            <Grid2 container spacing={4}>
              <Grid2  size={6} container spacing={4} sx={{ backgroundColor: 'info.main' }}>
                <img src="/members.jpg" width="100%" className="login-promo"/>
              </Grid2>
              <Grid2  size={6} sx={{ p: 4}}>
                <h2>Login:</h2>
                <form onSubmit={handleLogIn}>
                  <FormLabel htmlFor="username">Username:</FormLabel>
                  <TextField
                  fullWidth
                    type="text"
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2}}
                  />
                  <FormLabel htmlFor="password">Password:</FormLabel>
                  <TextField
                  fullWidth
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2}}
                  /> 
                  <p>
                    <Button variant="contained" type="submit" fullWidth>
                      Log In
                    </Button>
                  </p>
                  
                </form>
                <p>Don't have a login yet? <a href="./registration">Register here.</a></p>
                { // Conditionally render login error:
                  errorMessage && (
                    <h3 className="message-error">{errorMessage}</h3>
                  )
                }
              </Grid2>
            </Grid2>
            
          </Box>
      </Paper>
      
      
      
    </>
  );
}


export default LoginPage;
