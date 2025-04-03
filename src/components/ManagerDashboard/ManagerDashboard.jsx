import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import ManagerDashEmpTabs from './ManagerDashEmpTabs';




// function ManagerDashboard() {
//   const user = useStore((state) => state.user);
//   const [tabIndex, setTabIndex] = useState(0);
//   const [lastWeekResponse, setLastWeekResponse] = useState('');
//   const [readConfirmed, setReadConfirmed] = useState(false);
//   const [followUpOption, setFollowUpOption] = useState('');

  // useEffect(() => {
  // }, []);

function ManagerDashboard() {


  

  return (
    <div>
          <div className='container-manager-dashboard'>
          <div style={{ marginLeft: '200px', padding: '20px 0 0 20px' }}>
            <h1>Manager Dashboard</h1>
          </div>
          <ManagerDashEmpTabs />
        </div>
      </div>
  );
}

export default ManagerDashboard;