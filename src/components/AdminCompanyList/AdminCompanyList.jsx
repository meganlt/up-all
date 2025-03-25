import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

function AdminCompanyList() {

  const [ hook, setHook ] = useState( '' );

  return (
    <div className='_template'>
     <h2>All Company Assignments</h2>
    <button>filter</button>
    <table>
      <thead>
        <tr>
          <th>Company Name</th>
          <th>Week Title</th>
          <th>Active Dates</th>
          <th>Edit</th>
        </tr>
      </thead>
    </table>
    </div>
  );
}

export default AdminCompanyList;
