import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import AdminNewCompany from '../AdminNewCompany/AdminNewCompany';
import AdminCompanyList from '../AdminCompanyList/AdminCompanyList';

function AdminCompanyAssignments() {

  const [ weeklyContentTitles, setWeeklyContentTitles ] = useState( [] );
  // TODO:
  // Create hook for companyt assignments

  function fetchWeeklyContentTitles(){
    console.log('in fetchWeeklyContentTitles');
    // TO DO: 
    // Axios GET call to get all available titles for each week,
    // then, look through them, and put the titles into the array like this:
    setWeeklyContentTitles(['1-Meaningful Feedback', '2-Effective Meetings']);
    
  }

  function fetchCompanyAssignments(){
    console.log('in fetchCompanyAssignments');
    // TO DO: 
    // Axios GET call to get all company assignments
    // Then, set a hook above to pass to component below
  }

  useEffect(() => {
    fetchCompanyAssignments();
    fetchWeeklyContentTitles();
  }, [])

  return (
    <div className="page company-assignments">
     <h1>Company Assignments</h1>
     <div className="main-container container-company-assignments">
      <AdminNewCompany weeklyContentTitles={weeklyContentTitles}/>
     </div>
     <div className="main-container container-company-list">
      <AdminCompanyList/>
     </div>
    </div>
  );
}

export default AdminCompanyAssignments;
