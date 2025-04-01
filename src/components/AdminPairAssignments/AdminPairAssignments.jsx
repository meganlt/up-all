import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import AdminNewPairAssignment from '../AdminNewPairAssignment/AdminNewPairAssignment';
import AdminPairList from '../AdminPairList/AdminPairList';

function AdminPairAssignments() {

  return (
    <div className="page company-assignments">
     <h1>Manager + Team Member Assignments</h1>
     <div className="main-container container-company-assignments">
      <AdminNewPairAssignment />
     </div>
     <div className="main-container container-company-list">
      <AdminPairList/>
     </div>
    </div>
  );
}

export default AdminPairAssignments;
