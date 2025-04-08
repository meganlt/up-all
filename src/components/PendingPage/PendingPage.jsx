import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import { Paper } from '@mui/material';

function PendingPage() {
  
  const [ hook, setHook ] = useState( '' );



  return (
    <>
      <h1>You're registered!</h1>
      
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <h2>Your account is being setup. Please check back soon.</h2>
        <img src="/manager-at-computer.jpeg" alt="Image of a man at his laptop"/>
        <p>In the meantime, you can update your account information <a href="/my-account">here.</a></p>
      </Paper>
    </>
  );
}


export default PendingPage;