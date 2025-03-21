import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import AdminEditUser from '../AdminEditUser/AdminEditUser';

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
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            pendingUsers.map( (userToEdit, index)=>(
              <tr key={index}>
                <td>{userToEdit.email}</td>
                <td>{userToEdit.username}</td>
                <td>{userToEdit.company}</td>
                <td><AdminEditUser userToEdit={userToEdit}/></td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
      <div>
        <h2>All Users:</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Manager Assigned</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            assignedUsers.map( (userToEdit, index)=>(
              <tr key={index}>
                <td>{userToEdit.email}</td>
                <td>{userToEdit.username}</td>
                <td>{userToEdit.role}</td>
                <td>{userToEdit.manager_username}</td>
                <td>{userToEdit.company}</td>
                <td><AdminEditUser userToEdit={userToEdit}/></td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </>
  );
}


export default AdminManageUsers;