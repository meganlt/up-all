import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';

function employeeSideBar() {
  return (
    <Box
      sx={{
        width: '200px',
        height: '100vh',
        backgroundColor: 'darkgrey',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        boxShadow: 3,
      }}
    >
      <List>
        {['Dashboard', 'Tasks', 'Messages', 'Settings'].map((text, index) => (
          <ListItem
            key={index}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'teal',
                color: 'white',
                transition: 'background-color 0.3s ease',
              },
            }}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default employeeSideBar;