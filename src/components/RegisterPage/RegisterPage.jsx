import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import {
  Paper,
  Box,
  Button,
  FormLabel,
  Grid2,
  TextField
} from '@mui/material';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const register = useStore((state) => state.register)
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [])

  const handleRegister = (event) => {
    event.preventDefault();

    register({
      username: username,
      email: email,
      password: password,
    })
  };

  return (
    <>
      <Paper elevation={1} sx={{ p: 0, mb: 4, maxWidth: '1000px', m: 'auto' }}>
        <Box sx={{ flexGrow: 1}}>
          <Grid2 container spacing={4}>
            <Grid2  size={6} container spacing={4} sx={{ backgroundColor: 'info.main' }}>
              <img src="../../../public/members.jpg" width="100%" className="login-promo"/>
            </Grid2>
            <Grid2  size={6} sx={{ p: 4}}>
              <h2>Register Here:</h2>
              <form onSubmit={handleRegister}>
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
                <FormLabel htmlFor="email">Email Address:</FormLabel>
                <TextField
                 fullWidth
                  type="text"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    Register 
                  </Button>
                </p>
                <p>Already have an account? <a href="./login">Login here.</a></p>
              </form>
              { // Conditionally render registration error:
                errorMessage && (
                  <h3>{errorMessage}</h3>
                )
              }
            </Grid2>
          </Grid2>
        </Box>
      </Paper>      
    </>
  );
}


export default RegisterPage;
