import { useState, useEffect } from 'react';
import './ManagerDashEmpTabs.css';
import useStore from '../../zustand/store';
import axios from 'axios';
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
          {children}
        </Box>
      )}
    </div>
  );
}

const ManagerDashEmpTabs = (teamMembers) => {
  const user = useStore((state) => state.user);
  const [tabIndex, setTabIndex] = useState(0);
  const [lastWeekResponse, setLastWeekResponse] = useState('');
  const [readChecked, setReadChecked] = useState(false);
  const [followUpOption, setFollowUpOption] = useState('');
  const dashboardContent = useStore((state) => state.dashboardContent);
  // const [checkInCreated, setCheckInCreated] = useState(false);

  //setup hooks for vertical tabs:
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log('newValue', newValue);
  };
  const [tabContentArray , setTabContentArray] = useState([]);

  // Logs to test data coming through:
  // console.log('on tabs component:', teamMembers);
  // console.log('on tabs component: dashboard content stuff:', dashboardContent);


  // FUTURE: Function to handle Last week
  function handleLastWeek(e){
    setFollowUpOption(e.target.value)
    console.log(e.target.value);
  }

  // Function to handle when the complete box is checked
  function handleReadChange(e){
    // Checking status of checkbox and setting it
    const checked = e.target.checked;
    setReadChecked(checked);

    // Getting data from the employee whose tab is currently active
    const currentMember = teamMembers.teamMembers[value];
    const currentDashboard = dashboardContent.find(
      (content) => content.team_member.username === currentMember.username
    );
    const currentDashboardId = currentDashboard.pair_assignment_id;
    // Logging active tab and that data:
    // console.log('active pair assignment:', currentMember, currentDashboard.pair_assignment_id);

    // Verifying that the checkbox is selected as "read" and we have the pa.id    
    if (checked && currentDashboard?.pair_assignment_id) {
      // axios PUT to update pair_assignments table
      axios.put(`/api/assignments/complete/${currentDashboardId}`).then( function(response){
          console.log(response.data);
        }).catch( function(err){
          console.log(err);
          alert('error setting as read!');
        })

    }

  }

  useEffect(() => {
  }, []);

  return (
    <div>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', width: '100%'}} >
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider', width:'20%' }}
        >
          {teamMembers.teamMembers.map((member, index) => (
            <Tab label={member.username} key={index} />
          ))}
        </Tabs>
        <div className="tab-contents">
        {teamMembers.teamMembers.map((member, index) => {
          const memberDashboard = dashboardContent.find(
            (content) => content.team_member.username === member.username
          );

          return (
              <TabPanel value={value} index={index} key={index} sx={{width: '100%'}}>
                  {memberDashboard ? (
                  <>
                      <h2>
                          {memberDashboard.theme}
                      </h2>
                      {/* <h3>Last Week's Follow-up:</h3>
                      <p>Last week, did you maximize the effectiveness of your 1:1s by being intentional about one tip from last week’s Manager Weekly?</p>
                      <FormControl component="fieldset">
                        <FormLabel component="legend"></FormLabel>
                        <RadioGroup
                          aria-label="follow-up"
                          name="follow-up"
                          value={followUpOption}
                          onChange={handleLastWeek}
                        >
                          <FormControlLabel value="option1" control={<Radio />} label="I did, let's do it again!" />
                          <FormControlLabel value="option2" control={<Radio />} label="I didn't get the opportunity, but I will this week!" />
                        </RadioGroup>
                      </FormControl> */}
                      <h3>This Week:</h3>
                      {/* This "dangerouslySetInnerHtml" is to allow Ken to add simple html tags in his content, to format text into lists or paragraphs. */}
                      <div dangerouslySetInnerHTML={{ __html: memberDashboard.content }} />
                      {
                        memberDashboard.is_completed === false ? 
                          <FormControl component="fieldset">
                          <FormControlLabel 
                            control={
                              < Checkbox
                                checked={readChecked}
                                id="weekCompleteInput"
                                aria-label="week-complete"
                                name="week-complete"
                                onChange={handleReadChange}
                              />
                            } 
                            label="Check this when read! Then, move on to this week’s focus:"
                          />
                        </FormControl>
                        :
                        <p><strong>You marked this as read!</strong></p>
                      }
                      
                    
                    <Paper sx={{ p: 2, mt: 4, backgroundColor: 'lightgrey'}}>
                      <h3>This Week's Focus:</h3>
                      {/* This "dangerouslySetInnerHtml" is to allow Ken to add simple html tags in his content, to format text into lists or paragraphs. */}
                      <div dangerouslySetInnerHTML={{ __html: memberDashboard.focus }} />
                    </Paper>
                  </>  
                    
                  ) : (
                    <>
                      <h2>No content to display for {member.username}.</h2>
                      <p>Contact the admin to have an assignment created for you and {member.username}!</p>
                    </>
                  )}
              </TabPanel>
          );
        })}
        </div>
      </Box>
    </div>
  );
};

export default ManagerDashEmpTabs;
