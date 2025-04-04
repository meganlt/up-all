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
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
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
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {
              pendingUsers.map( (userToEdit, index)=>(
                <TableRow key={index}>
                  <TableCell>{userToEdit.email}</TableCell>
                  <TableCell>{userToEdit.username}</TableCell>
                  <TableCell>{userToEdit.company}</TableCell>
                  <TableCell><AdminEditUser userToEdit={userToEdit}/></TableCell>
                </TableRow>
              ))
            }
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <div>
          <h2>All Users:</h2>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Manager Assigned</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {
              assignedUsers.map( (userToEdit, index)=>(
                <TableRow key={index}>
                  <TableCell>{userToEdit.email}</TableCell>
                  <TableCell>{userToEdit.username}</TableCell>
                  <TableCell>{userToEdit.role}</TableCell>
                  <TableCell>{userToEdit.manager_username}</TableCell>
                  <TableCell>{userToEdit.company}</TableCell>
                  <TableCell><AdminEditUser userToEdit={userToEdit}/></TableCell>
                </TableRow>
              ))
            }
            </TableBody>
          </Table>
        </div>
      </Paper>
      
    </>
  );
}


export default AdminManageUsers;