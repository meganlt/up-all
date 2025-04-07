import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import AdminNewPairAssignment from '../AdminNewPairAssignment/AdminNewPairAssignment';
import AdminPairList from '../AdminPairList/AdminPairList';
import { Paper } from '@mui/material';

function AdminPairAssignments() {

  return (
    <div className="page company-assignments">
     <h1>Manager + Team Member Assignments</h1>
     <div className="main-container container-company-assignments">
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <AdminNewPairAssignment />
      </Paper>
      
     </div>
     <div className="main-container container-company-list">
     <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <AdminPairList/>
      </Paper>
     </div>
    </div>
  );
}

export default AdminPairAssignments;
