import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';


function ManagerDashboard() {
  const user = useStore((state) => state.user);

  return (
    <>
      <h1>ManagerDashboard</h1>
    </>
  );
}


export default ManagerDashboard;