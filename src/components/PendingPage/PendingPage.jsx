import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import { Paper } from '@mui/material';
import './PendingPage.css';

function PendingPage() {
  
  const [ hook, setHook ] = useState( '' );



  return (
    <>
      <h1>You're registered!</h1>
      
      <Paper className="pending-container" elevation={1} sx={{ p: 4, mb: 4 }}>
        <h2>Your account is being setup. Please check back soon.</h2>
        <p>In the meantime, you can update your account information <a href="/my-account">here.</a></p>
        <img className="pending-image" src="/manager-at-computer.jpeg" alt="Image of a man at his laptop"/>  
      </Paper>
    </>
  );
}


export default PendingPage;