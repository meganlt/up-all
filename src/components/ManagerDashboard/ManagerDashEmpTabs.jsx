import { useState, useEffect } from 'react';
import './ManagerDashEmpTabs.css';
import useStore from '../../zustand/store';
import EmployeeSideBar from '../EmployeeSideBar/EmployeeSideBar';
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

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ManagerDashEmpTabs = (teamMembers) => {
  const user = useStore((state) => state.user);
  const [tabIndex, setTabIndex] = useState(0);
  const [lastWeekResponse, setLastWeekResponse] = useState('');
  const [readConfirmed, setReadConfirmed] = useState(false);
  const [followUpOption, setFollowUpOption] = useState('');
  const dashboardContent = useStore((state) => state.dashboardContent);

  //setup hooks for vertical tabs:
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [tabContentArray , setTabContentArray] = useState([]);

  // console.log('on tabs component:', teamMembers);
  // console.log('on tabs component: dashboard content stuff:', dashboardContent);

  useEffect(() => {
  }, []);

  // State to track the selected employee and active tab
  // const [selectedEmployee, setSelectedEmployee] = useState(teamMembers.teamMembers[0]);
  // const [activeTab, setActiveTab] = useState('Weekly Content');

  return (
    <div>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}} >
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider', width:'100%' }}
        >
          {teamMembers.teamMembers.map((member, index) => (
            <Tab label={member.username} key={index} sx={{ width: 200}}>{member.username}{index}</Tab>
          ))}
        </Tabs>
        {teamMembers.teamMembers.map((member, index) => {
          const memberDashboard = dashboardContent.find(
            (content) => content.team_member.username === member.username
          );

          return (
            <TabPanel value={value} index={index} key={index} sx={{width: '80%'}}>
              {memberDashboard ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {memberDashboard.theme}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Focus: {memberDashboard.focus}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {memberDashboard.content}
                  </Typography>
                </Box>
              ) : (
                <>
                                <Typography>No content to display for {member.username}.</Typography>
                <Typography>No content to display for {member.username}.Nullam condimentum, lorem vel elementum fringilla, sapien sapien rutrum magna, eget accumsan ex mi at tortor.met lectus ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce at viverra turpis, sed suscipit justo. Ut ultricies nibh a ligula posuere, sit amet lacinia urna efficitur. Donec lectus orci, lacinia ut libero ac, blandit feugiat ante. Vestibulum consectetur, nunc at volutpat pretium, ipsum ex interdum massa, non fermentum urna nunc nec odio. Vestibulum lobortis mi nec nibh facilisis maximus. Nam mauris ipsum, aliquet quis justo nec, venenatis hendrerit massa. Donec iaculis massa vitae convallis efficitur.</Typography>
                <Typography>No content to display for {member.username}.</Typography>
                </>

              )}
            </TabPanel>
          );
        })}
        {/* <TabPanel value={value} index={0}>
          Content for Tab One sdlkjfal;kjf ;lsakdjf;lasdkjf ;lasdkjf;alskdjfas
        </TabPanel>
        <TabPanel value={value} index={1}>
          Content for Tab Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Content for Tab Three
        </TabPanel> */}
      </Box>
      {/* Vertical Navigation for Employees */}
      {/* <nav className="employee-nav">
        <ul>
        {teamMembers.teamMembers.map((member, index) => (
            <li
              key={index}
              className={selectedEmployee === member.username ? 'active' : ''}
              onClick={() => setSelectedEmployee(member.username)}
            >
              {member.username}
            </li>
          ))}
        </ul>
      </nav> */}

      {/* Main Content Area */}
      {/* <div className="main-content manager-content"> */}
       

        {/* Content Display Area */}
        {/* <div className="weekly-content">
          <h2>{selectedEmployee}'s {activeTab}</h2>
          <p>Content for {activeTab} will be displayed here.</p>
          </div> */}

          {/* <div className="last-week-follow-up">
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Last Week's Follow-up</Typography>
            <p>Last week, did you maximize the effectiveness of your 1:1s by being intentional about one tip from last week’s Manager Weekly?</p>
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
        </div> */}

        {/* <div className="this-week">
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>This Week</Typography>
            <p>Content displayed from GET Route for "Manager Weekly Content".</p>
            <FormControl component="fieldset">
              <FormLabel component="legend"></FormLabel>
              <RadioGroup
                aria-label="follow-up"
                name="follow-up"
                value={followUpOption}
                onChange={(e) => setFollowUpOption(e.target.value)}
              >
                <FormControlLabel value="option1" control={<Radio />} label="Check this when read! Then, move on to this week’s focus:" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </div> */}

        {/* <div className="this-weeks-focus">
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>This Week's Focus</Typography>
            <p>Content displayed from GET Route for "This Week's Focus Content."</p>
          </Paper>
        </div> */}

      {/* </div> */}
    </div>
  );
};

export default ManagerDashEmpTabs;
