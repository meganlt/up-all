import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';
// imports for dialog form
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import CheckBox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function AdminEditUser(userToEdit) {
  const user = useStore((state) => state.user);
  const pendingUsers = useStore((state) => state.pendingUsers);
  const fetchPendingUsers = useStore((state) => state.fetchPendingUsers);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);

  // Initial hook and setup for dialog
  const [openEdit, setOpenEdit] = useState(false);
  const handleEditClickOpen = () => {  setOpenEdit(true);};
  const handleEditClose = () => {  setOpenEdit(false); };
    
  function editOtherUser(e){
    e.preventDefault();
    console.log('in editOtherUser');

    // if its a new user without a role:
    //   if no role yet, set role according to the value ken picks
    //   set manager according to username set in input field
    // otherwise update any info that's changed?
    // assemble objectToSend
    let objectToSend = {
      userId: userToEdit.userToEdit.id,
      userRole: document.getElementById('editRoleInput').value,
      userManager: document.getElementById('editManagerInput').value,
      userCompany: document.getElementById('editCompanyInput').value,
      userPassword: document.getElementById('editPasswordInput').value
    }

    // send objectToSend to server to update
    axios.put('/api/admin/user', objectToSend).then( function( response){
      console.log(response);
      fetchPendingUsers();
      fetchAssignedUsers();

    } ).catch( function(err){
      console.log(err);
      alert('error updating user');
    })

    // clear form details to reset for next open
    clearForm();
    // close dialog
    handleEditClose();
  }

  function deleteOtherUser(e){
    e.preventDefault();
    console.log('in deleteOtherUser', userToEdit.userToEdit);
    const userToDelete = userToEdit.userToEdit.id;
    // check if user is a manager
    if (userToEdit.userToEdit.role === "manager"){
      // if so, do they have any asociates assigned yet?
      // look through array of assigned users to find anyone with this m anager's id set for "manager_assigned"
      const managerAssignees = assignedUsers.filter(
        (assignedUser)=>{
          return assignedUser.manager_assigned == userToDelete;
        });
        console.log(`Manager still has these users assigned:`, managerAssignees);
        // If there are any assigned users, notify the admin.
        if (managerAssignees.length > 0 ){
          alert('The person you are trying to delete still has ' + managerAssignees.length + ' users assigned. Please reassign these users to other managers first.');
          // exit the function and stop the delete process
          return false;
        }
    }
    // otherwise, axios delete this user
    axios.delete(`/api/admin/user?id=${userToEdit.userToEdit.id}`).then( function(response){
      console.log('back from delete:', response.data);
      fetchPendingUsers();
      fetchAssignedUsers();
    }).catch( function(err){
      console.log(err);
      alert('error deleting user');
    });

    // clear form details to reset for next open
    clearForm();
    // close dialog
    handleEditClose();
  }

  // Function to clear form when dialog is closed
  const clearForm = () => {
    console.log('clear form');
  }

  return (
    <>
      {
        userToEdit.userToEdit.role === "pending" ? (
          <Button variant="outlined" onClick={handleEditClickOpen}>Assign User</Button>
        ): (
          <Button variant="outlined" onClick={handleEditClickOpen}>Edit User</Button>
        )
      }
      <Dialog
          open={openEdit}
          onClose={handleEditClose}
          className="dialog-container"
          slotProps={{
            paper: {
              component: 'form',
              onSubmit: editOtherUser,
            },
          }}
          fullWidth={true}
          maxWidth={'md'}
        >
        <DialogTitle className="dialog-header">
        {
          userToEdit.userToEdit.role === "pending" ? (
            <span>Assign </span>
          ): (
            <span>Edit </span>
          )
        }
          User: {userToEdit.userToEdit.username}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleEditClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="edit-container" dividers>
          <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={4}>
              <Grid2  size={4} container spacing={4}>
                <p>
                  <b>Email:</b> {userToEdit.userToEdit.email}<br/>
                  <b>Username:</b> {userToEdit.userToEdit.username}<br/>
                  <b>Company:</b> {userToEdit.userToEdit.company}
                </p>
              </Grid2>
              <Grid2  size={8}>
                <label>Role:</label>
                <Select id="editRoleInput" defaultValue={userToEdit.userToEdit.role} fullWidth size="small">
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="associate">Associate</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
                <br/> <br/>
                <label>Manager's Username:</label>
                <TextField id="editManagerInput" type="text" defaultValue={userToEdit.userToEdit.manager_username} fullWidth size="small" sx={{ mb: 3}}/>
                <br/>
                <label>Company:</label>
                <TextField id="editCompanyInput" type="text" defaultValue={userToEdit.userToEdit.company} fullWidth size="small" sx={{ mb: 3}}/>
                <br/>
                <label>Set Temporary Password:</label>
                <TextField id="editPasswordInput" type="text" fullWidth size="small" sx={{ mb: 3}}/>
              </Grid2>
            </Grid2>
            
          </Box>
        </DialogContent>
        <DialogActions>
          {
            userToEdit.userToEdit.role === "pending" ? (
              <Box sx={{ flexGrow: 1 }}>
                <Grid2 container spacing={6} padding={2}>
                <Grid2 size={6}>
                <Button color="error" variant="outlined" onClick={deleteOtherUser}>reject</Button>
                </Grid2>
                <Grid2 size={6} sx={{ textAlign: 'right' }}>
                <Button variant="contained" type="submit">Assign User</Button>
                </Grid2>
                </Grid2>
                
                
              </Box>

            ): (
              <Box sx={{ flexGrow: 1 }}>
                <Grid2 container spacing={6} padding={2}>
                  <Grid2 size={6}>
                    <Button color="error" variant="outlined"  onClick={deleteOtherUser}>delete user</Button>
                    <DialogContentText color="error">
                      <b>Delete Warning:</b> <br/>
                      This cannot be undone. <br/>
                      If this is a manager, please delete or reassign their assigned associates first. 
                      <br/>
                    </DialogContentText>
                  </Grid2>
                  <Grid2 size={6} sx={{ textAlign: 'right' }}>
                    <Button variant="contained" type="submit">Edit User</Button>
                  </Grid2>
                </Grid2>
              </Box>
              
            )
          }
        </DialogActions>
      </Dialog>
    </>
  );
}


export default AdminEditUser;