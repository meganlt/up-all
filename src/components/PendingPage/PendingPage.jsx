import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';


function PendingPage() {
  
  const [ hook, setHook ] = useState( '' );

  return (
    <>
      <h1>PendingPage</h1>
      <h2>You're registered! Check back soon.</h2>
    </>
  );
}


export default PendingPage;