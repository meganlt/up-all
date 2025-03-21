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

  // Initial hook and setup for dialog
  const [openEdit, setOpenEdit] = useState(false);
  const handleEditClickOpen = () => {  setOpenEdit(true);};
  const handleEditClose = () => {  setOpenEdit(false); };

  console.log(userToEdit.userToEdit);
    
  function editOtherUser(e){
    e.preventDefault();
    console.log('in editOtherUser');
    // if its a new user without a role:
    //   if no role yet, set role according to the value ken picks
    //   set manager according to username set in input field
    // otherwise update any info that's changed?
    // clear form details
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
          <button onClick={handleEditClickOpen}>Assign User</button>
        ): (
          <button onClick={handleEditClickOpen}>Edit User</button>
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
        Form content will go here
        
          
          
        </DialogContent>
        
        <DialogActions>
          {
            userToEdit.userToEdit.role === "pending" ? (
              <button type="submit">Assign User</button>
            ): (
              <button type="submit">Edit User</button>
            )
          }
        </DialogActions>
      </Dialog>
    </>
  );
}


export default AdminEditUser;