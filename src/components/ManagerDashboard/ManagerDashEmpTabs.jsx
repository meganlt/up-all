import { useState, useEffect } from 'react';
import './ManagerDashEmpTabs.css';
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


const ManagerDashEmpTabs = () => {
  const user = useStore((state) => state.user);
  const [tabIndex, setTabIndex] = useState(0);
  const [lastWeekResponse, setLastWeekResponse] = useState('');
  const [readConfirmed, setReadConfirmed] = useState(false);
  const [followUpOption, setFollowUpOption] = useState('');

  useEffect(() => {
  }, []);
  // Placeholder employee names
  const employees = ['Employee 1', 'Employee 2', 'Employee 3'];

  // State to track the selected employee and active tab
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [activeTab, setActiveTab] = useState('Weekly Content');

  return (
    <div className="dashboard-container">
      {/* Vertical Navigation for Employees */}
      <nav className="employee-nav">
        <ul>
          {employees.map((employee) => (
            <li
              key={employee}
              className={selectedEmployee === employee ? 'active' : ''}
              onClick={() => setSelectedEmployee(employee)}
            >
              {employee}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
       

        {/* Content Display Area */}
        <div className="weekly-content">
          <h2>{selectedEmployee}'s {activeTab}</h2>
          <p>Content for {activeTab} will be displayed here.</p>
          </div>

          <div className="last-week-follow-up">
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
        </div>

        <div className="this-week">
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
        </div>

        <div className="this-weeks-focus">
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>This Week's Focus</Typography>
            <p>Content displayed from GET Route for "This Week's Focus Content."</p>
          </Paper>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashEmpTabs;
