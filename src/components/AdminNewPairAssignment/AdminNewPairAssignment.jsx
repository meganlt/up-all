import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import axios from "axios";
import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  FormControl,
  MenuItem,
  Grid2,
  Select,
  TextField
} from '@mui/material';

function AdminNewPairAssignment() {
  const user = useStore((state) => state.user);
  const [weeks, setWeeks] = useState([]);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);

  // State for selected options
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [startDate, setStartDate] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');

  // Derived lists
  const uniqueCompanies = [...new Set(assignedUsers.map(user => user.company))];
  const quarters = [...new Set(weeks.map( week => week.quarter_title))];
  const [managers, setManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Hooks for MUI Selects
  const handleCompanyChange = (e)=> { setSelectedCompany(e.target.value) };
  const handleManagerChange = (e)=> { setSelectedManager(e.target.value) };
  const handleTeamMemberChange = (e)=> { setSelectedTeamMember(e.target.value) };
  const handleQuarterChange = (e)=> { setSelectedQuarter(e.target.value) };
 
  // console.log(assignedUsers);
  // console.log(uniqueCompanies);
  // console.log('quarters:', quarters);

  // Fetch weeks so we can pull out all unique quarter titles
  function fetchWeeks() {
    axios.get("/api/week")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setWeeks(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setWeeks([]);
        }
      })
      .catch((err) => {
        console.error("ERROR fetching week:", err);
        alert("ERROR in fetchWeek: " + err.message);
      });
  };
  
  // Fetch data on mount
  useEffect(() => {
    fetchAssignedUsers();
    fetchWeeks();
  }, []);

  // Update managers when company changes
  useEffect(() => {
    if (selectedCompany) {
      const companyManagers = assignedUsers.filter(user => user.company === selectedCompany && user.role === "manager");
      setManagers(companyManagers);
      setSelectedManager(''); // Reset manager selection
      setTeamMembers([]); // Reset team members
    }
  }, [selectedCompany, assignedUsers]);

  // Update team members when manager changes
  useEffect(() => {
    if (selectedManager) {
      const managerTeam = assignedUsers.filter(user => user.manager_assigned === parseInt(selectedManager));
      setTeamMembers(managerTeam);
    } else {
      setTeamMembers([]);
    }
  }, [selectedManager, assignedUsers]);

  function addNewPairAssignment(e) {
    e.preventDefault();
    console.log('Submitting new assignment...');

    const objectToSend = {
      admin_id: user.id,
      company_name: selectedCompany,
      manager_id: Number(selectedManager),
      team_member_id: Number(selectedTeamMember),
      active_date_start: startDate,
      quarter_title: selectedQuarter
    }
    console.log(objectToSend);
    // TO DO: Axios POST call
    axios.post('/api/assignments/assign', objectToSend).then( function(response){
      // console.log(response.data);
    }).catch( function(err){
      alert('Error sending new assignment to server');
      console.log(err);
    })
  }

  return (
    <div className='container-section'>
     <h2>Add New Assignent</h2>
     <form onSubmit={addNewPairAssignment}>
      <Box sx={{ flexGrow: 1}}>
        <Grid2 container spacing={4}>
          <Grid2 size={4}>
            {/* Company Select */}
            <label>Company:</label>
            <Select 
              id="companyInput"
              defaultValue={selectedCompany}
              value={selectedCompany}
              fullWidth
              size="small"
              onChange={handleCompanyChange}
            >
              <MenuItem value="label" disabled hidden>Select a company</MenuItem>
              {uniqueCompanies.map((company, index) => (
                  <MenuItem key={index} value={company}>{company}</MenuItem>
              ))}
            </Select>
            {/* <select required value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
              <option value="" disabled hidden >Select Company</option>
              {uniqueCompanies.map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select> */}
          </Grid2>
          <Grid2 size={4}>
            {/* Manager Select */}
            <label>Manager:</label>
            <Select 
              id="managerInput"
              defaultValue={selectedManager}
              value={selectedManager}
              fullWidth
              size="small"
              onChange={handleManagerChange}
            >
              <MenuItem value="" disabled hidden >Select Manager</MenuItem>
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>{manager.username}</MenuItem>
              ))}
            </Select>
            {/* <select required value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
              <option value="" disabled hidden >Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>{manager.username}</option>
              ))}
            </select> */}
          </Grid2>
          <Grid2 size={4}>
            {/* Team Member Select */}
            <label>Team Member:</label>
            <Select 
              id="teamMemberInput"
              defaultValue={selectedTeamMember}
              value={selectedTeamMember}
              fullWidth
              size="small"
              onChange={handleTeamMemberChange}
            >
              <MenuItem value="" disabled hidden >Select Team Member</MenuItem>
              {teamMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>{member.username}</MenuItem>
              ))}
            </Select>
            {/* <select required value={selectedTeamMember} onChange={(e) => setSelectedTeamMember(e.target.value)}>
              <option value="" disabled hidden >Select Team Member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>{member.username}</option>
              ))}
            </select> */}
          </Grid2>
        </Grid2>
        <Grid2 container spacing={4} sx={{mt: 4, mb:4}}>
          <Grid2 size={6}>
            {/* Quarter Title */}
            <label>Quarter Title:</label>
            <Select 
              id="quarterInput"
              defaultValue={selectedQuarter}
              value={selectedQuarter}
              fullWidth
              size="small"
              onChange={handleQuarterChange}
            >
               <MenuItem value="" disabled hidden >Select Quarter</MenuItem>
              {quarters.map((title, index) => (
                <MenuItem key={index} value={title}>{title}</MenuItem>
              ))}
            </Select>
            {/* <select required value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)} >
              <option value="" disabled hidden >Select Quarter</option>
              {quarters.map((title, index) => (
                <option key={index} value={title}>{title}</option>
              ))}
            </select> */}
          </Grid2>
          <Grid2 size={6}>
            {/* Start Date */}
            <label>Start Date:</label>
            <TextField
              required 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              InputLabelProps={{
                shrink: true, // Keeps the label in the "shrunk" state, like it is in the placeholder
              }}
            />
            {/* <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> */}
          </Grid2>
        </Grid2>
        <Button variant="contained" type="submit">Create Assignment</Button>
      </Box>
        



        





       
      </form>
    </div>
  );
}

export default AdminNewPairAssignment;
