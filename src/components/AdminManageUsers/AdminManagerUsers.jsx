import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import AdminEditUser from '../AdminEditUser/AdminEditUser';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  FormControl,
  Grid2,
  TextField
} from '@mui/material';

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
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
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
      </Paper>
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
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
      </Paper>
      
    </>
  );
}


export default AdminManageUsers;