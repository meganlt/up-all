import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';
// imports for dialog form
import * as React from 'react';
import Button from '@mui/material/Button';
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
          <div>
          Email: {userToEdit.userToEdit.email} <br/>
          Username: {userToEdit.userToEdit.username}<br/>
          Company: {userToEdit.userToEdit.company}
          </div>
          <div>
          <br/>
          <label>Role:</label>
          <select id="editRoleInput" defaultValue={userToEdit.userToEdit.role}>
            <option value="manager">Manager</option>
            <option value="associate">Associate</option>
            <option value="pending">Pending</option>
          </select>
          <br/> <br/>
          <label>Manager's Username:</label>
          <input id="editManagerInput" type="text" defaultValue={userToEdit.userToEdit.manager_username}/>
          <br/>
          <label>Company:</label>
          <input id="editCompanyInput" type="text" defaultValue={userToEdit.userToEdit.company}/>
          <br/>
          <label>Set Temporary Password:</label>
          <input id="editPasswordInput" type="text" />
          </div>
        
          
          
        </DialogContent>
        <DialogActions>
          {
            userToEdit.userToEdit.role === "pending" ? (
              <>
                <button onClick={deleteOtherUser}>reject</button>
                <button type="submit">Assign User</button>
              </>

            ): (
              <>
                
                <p>
                  Delete Warning: this cannot be undone.<br/>
                  If this is a manager, please delete or reassign their assigned associates first. <br/>
                <button onClick={deleteOtherUser}>delete user</button>
                </p>
                <button type="submit">Edit User</button>
              </>
              
            )
          }
        </DialogActions>
      </Dialog>
    </>
  );
}


export default AdminEditUser;