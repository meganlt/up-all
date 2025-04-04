import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import ManagerDashEmpTabs from './ManagerDashEmpTabs';

// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   List,
//   ListItem,
//   ListItemText,
//   Tabs,
//   Tab,
//   AppBar,
//   Toolbar,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   RadioGroup,
//   Radio,
//   FormControl,
//   FormLabel
// } from '@mui/material';

// function ManagerDashboard() {
//   const user = useStore((state) => state.user);
//   const [tabIndex, setTabIndex] = useState(0);
//   const [lastWeekResponse, setLastWeekResponse] = useState('');
//   const [readConfirmed, setReadConfirmed] = useState(false);
//   const [followUpOption, setFollowUpOption] = useState('');

  // useEffect(() => {
  // }, []);

  function ManagerDashboard() {
    const user = useStore((state) => state.user);
    const fetchUser = useStore((state) => state.fetchUser);
    const dashboardContent = useStore((state) => state.dashboardContent);
    const fetchDashboardContent = useStore((state) => state.fetchDashboardContent);

    const dummyData = [
      { 
        id: 1,
        manager_id: 5,
        team_member: 7,
        team_member_username: 'spidergwen',
        team_member_firstName: 'Gwen',
        team_member_lastName: 'Stacy',
        company: 'Inc',
        dashboard_week_id: 4,
        quarter_title: 'Effective Meetings',
        week: 3,
        theme: 'Psychological Safety',
        focus: 'Practice safe stuff mmmkay',
        content: 'why stuff matters and main content here'
      },
      {
        id: 1,
        manager_id: 5,
        team_member: 8,
        team_member_username: 'venom',
        team_member_firstName: 'Venom',
        team_member_lastName: 'Sauce',
        company: 'Inc',
        dashboard_week_id: 4,
        quarter_title: 'Effective Meetings',
        week: 3,
        theme: 'Psychological Safety',
        focus: 'Practice safe stuff mmmkay',
        content: 'why stuff matters and main content here'
      },
      {
        id: 1,
        manager_id: 5,
        team_member: 9,
        team_member_username: 'peterp',
        team_member_firstName: 'Peter',
        team_member_lastName: 'Parker',
        company: 'Inc',
        dashboard_week_id: 4,
        quarter_title: 'Effective Meetings',
        week: 3,
        theme: 'Psychological Safety',
        focus: 'Practice safe stuff mmmkay',
        content: 'why stuff matters and main content here'
      }
    ];


    useEffect(() => {
      const fetchData = async () => {
        await fetchUser(); // wait for user to be fetched
    
        // Access the updated user directly from the store
        const latestUser = useStore.getState().user;
        const managerId = latestUser.id;
        console.log(managerId);
        if (managerId) {
          await fetchDashboardContent(managerId);
          console.log(dashboardContent);
        }
      };
    
      fetchData();
      console.log(dashboardContent);
      
    }, []);

    return (
      <div className='container-manager-dashboard'>
        {JSON.stringify(dashboardContent)}
      <div style={{ marginLeft: '200px', padding: '20px 0 0 20px' }}>
        <h1>Manager Dashboard</h1>
      </div>
      <ManagerDashEmpTabs />
      
        <div>
          
        </div>
    </div>
    );
  }
  
  export default ManagerDashboard;
  

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       {/* Top Header */}
//       <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Typography variant="h6">Manager Dashboard</Typography>
//           <Box>
//             <Button color="primary">My Dashboard</Button>
//             <Button color="primary">Manager {user?.first_name || 'Name'}</Button>
//             <Button variant="contained" color="primary">Log out</Button>
//           </Box>
//         </Toolbar>

//         {/* Welcome */}
//         <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
//             <Typography variant="h5" gutterBottom>Welcome, {user?.first_name || 'Manager'}!</Typography>
//           </Paper>

//         {/* Tabs */}
//         <Tabs
//           value={tabIndex}
//           onChange={(e, newValue) => setTabIndex(newValue)}
//           textColor="primary"
//           indicatorColor="primary"
//           sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}
//         >
//           <Tab label="Manager Weekly" />
//           <Tab label="My Team" />
//         </Tabs>
//       </Paper>

//       {/* Tab: Manager Weekly */}
//       {tabIndex === 0 && (
//         <>
//           {/* Last Week Follow-up */}
//           <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
//             <Typography variant="h6" gutterBottom>Last Week's Follow-up</Typography>
//             <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  
//               Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
//             <Typography variant="body1">{lastWeekResponse}</Typography>
//             <FormControl component="fieldset">
//               <FormLabel component="legend"></FormLabel>
//               <RadioGroup
//                 aria-label="follow-up"
//                 name="follow-up"
//                 value={followUpOption}
//                 onChange={(e) => setFollowUpOption(e.target.value)}
//               >
//                 <FormControlLabel value="option1" control={<Radio />} label="I did, let's do it again!" />
//                 <FormControlLabel value="option2" control={<Radio />} label="I didn't get the opputunity, but I will this week!" />
//               </RadioGroup>
//             </FormControl>
//           </Paper>
//         </>
//       )}

//       {/* Tab: My Team */}
//       {tabIndex === 1 && (
//         <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
//           <Typography variant="h6" gutterBottom>My Team</Typography>
//           <List>
//             {/* Add team members list items here */}
//             <ListItem>
//               <ListItemText primary="Team Member 1" />
//             </ListItem>
//             <ListItem>
//               <ListItemText primary="Team Member 2" />
//             </ListItem>
//           </List>
//         </Paper>
//       )}
//     </Container>
//   );
// }

// export default ManagerDashboard;