import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import { Logout } from '@mui/icons-material';


function PendingPage() {
  
  const [ hook, setHook ] = useState( '' );



  return (
    <>
      <h1>PendingPage</h1>
      <h2>You're registered! Check back soon.</h2>
      <li>
        <button onClick={Logout}>Log Out</button> 
      </li>
    </>
  );
}


export default PendingPage;