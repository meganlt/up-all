import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';
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

function UserAccountPage() {
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);
  // const [user, setUser] = useState(null);
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [pronouns, setPronouns] = useState(user.pronouns);
  const [job_title, setJobTitle] = useState(user.job_title);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      first_name,
      last_name,
      pronouns,
      job_title,
      email,
    };


    if (password) {
      updatedData.password = password;
    }

    console.log('Updated data:', updatedData);

    try {
      await axios.put('/api/user/update', updatedData, { withCredentials: true });
      alert('Account updated successfully!');
      setPassword(''); 
      fetchUser();
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account. Please try again later.');
    }
  };

 

  return (
    <>
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        

        <h1>Hi, {user.first_name ? user.first_name : user.username}!</h1>
        <p>Update your account information here.</p>
        <form onSubmit={handleSubmit}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid2 container spacing={4}>
              <Grid2 size={6}>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <TextField
                  type="text"
                  fullWidth
                  id="firstName"
                  name="first_name"
                  placeholder={user.first_name}
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={{mb:3}}
                />

                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <TextField
                  type="text"
                  fullWidth
                  id="lastName"
                  name="last_name"
                  placeholder={user.last_name}
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{mb:3}}
                />

                <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
                <TextField
                  type="text"
                  fullWidth
                  id="pronouns"
                  name="pronouns"
                  placeholder={user.pronouns}
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  sx={{mb:3}}
                />
              </Grid2>
              <Grid2 size={6}>
                <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                <TextField
                  type="text"
                  fullWidth
                  id="jobTitle"
                  name="job_title"
                  placeholder={user.job_title}
                  value={job_title}
                  onChange={(e) => setJobTitle(e.target.value)}
                  sx={{mb:3}}
                />

                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  type="text"
                  fullWidth
                  id="email"
                  name="email"
                  placeholder={user.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{mb:3}}
                />

                <FormLabel htmlFor="password">New Password (optional)</FormLabel>
                <TextField
                  type="password"
                  fullWidth
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{mb:3}}
                />
              </Grid2>
            </Grid2>
          </Box>
          



          <Button variant="contained" type="submit">Update Account Information</Button>
        </form>
      </Paper>
    </>
  );
}

export default UserAccountPage;