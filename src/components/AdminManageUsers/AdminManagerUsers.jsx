import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';


function AdminManageUsers() {
  const pendingUsers = useStore((state) => state.pendingUsers);
  const fetchPendingUsers = useStore((state) => state.fetchPendingUsers);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    fetchPendingUsers();
    fetchAssignedUsers();
  }, [])
  return (
    <>
      <h1>Manage Users</h1>
      <div>
        <h2>Users To Assign:</h2>
        {JSON.stringify(pendingUsers)}
        <ul>
          <li>List people here <button>reject</button><button>assign</button></li>
        </ul>
      </div>
      <div>
        <h2>All Users:</h2>
        {JSON.stringify(assignedUsers)}
      </div>
    </>
  );
}


export default AdminManageUsers;