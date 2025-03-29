import { useState, useEffect } from 'react';
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
  RadioGroup,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';

function ManagerDashboard() {
  const user = useStore((state) => state.user);
  const [tabIndex, setTabIndex] = useState(0);
  const [lastWeekResponse, setLastWeekResponse] = useState('');
  const [readConfirmed, setReadConfirmed] = useState(false);
  const [followUpOption, setFollowUpOption] = useState('');

  useEffect(() => {
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Top Header */}
      <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Manager Dashboard</Typography>
          <Box>
            <Button color="primary">My Dashboard</Button>
            <Button color="primary">Manager {user?.first_name || 'Name'}</Button>
            <Button variant="contained" color="primary"></Button>
          </Box>
        </Toolbar>

        {/* Welcome */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Welcome, {user?.first_name || 'Manager'}!</Typography>
          </Paper>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}
        >
          <Tab label="Manager Weekly" />
          <Tab label="My Team" />
        </Tabs>
      </Paper>

      {/* Tab: Manager Weekly */}
      {tabIndex === 0 && (
        <>
          {/* Last Week Follow-up */}
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Last Week's Follow-up</Typography>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <Typography variant="body1">{lastWeekResponse}</Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend"></FormLabel>
              <RadioGroup
                aria-label="follow-up"
                name="follow-up"
                value={followUpOption}
                onChange={(e) => setFollowUpOption(e.target.value)}
              >
                <FormControlLabel value="option1" control={<Radio />} label="I did, let's do it again!" />
                <FormControlLabel value="option2" control={<Radio />} label="I didn't get the opputunity, but I will this week!" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </>
      )}

      {/* Tab: My Team */}
      {tabIndex === 1 && (
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>My Team</Typography>
          <List>
            {/* Add team members list items here */}
            <ListItem>
              <ListItemText primary="Team Member 1" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Team Member 2" />
            </ListItem>
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default ManagerDashboard;