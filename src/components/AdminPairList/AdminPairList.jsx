import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

function AdminPairList() {

    // TODO:
  // Create hook for pair assignments
  const [ pairs, setPairs ] = useState([]);

  function fetchPairAssignments(){
    console.log('in fetchPairAssignments');
    // TO DO: 
    // Axios GET call to get all company assignments
    // Then, set a hook above to pass to component below
  }

  useEffect(() => {
    fetchPairAssignments();
  }, [])

  return (
    <div className='_template'>
     <h2>All Pair Assignments</h2>
    <button>filter</button>
    <table>
      <thead>
        <tr>
          <th>Company Name:</th>
          <th>Manager:</th>
          <th>Team Member:</th>
          <th>Quarter Title:</th>
          <th>Active Dates:</th>
          <th>Edit</th>
        </tr>
      </thead>
    </table>
    </div>
  );
}

export default AdminPairList;
