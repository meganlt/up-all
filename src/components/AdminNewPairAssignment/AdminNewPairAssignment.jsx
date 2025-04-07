import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import axios from "axios";

function AdminNewPairAssignment() {
  const user = useStore((state) => state.user);
  const [weeks, setWeeks] = useState([]);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);

  console.log('weeks:', weeks);

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

  console.log(assignedUsers);
  console.log(uniqueCompanies);
  console.log('quarters:', quarters);


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
      console.log(response.data);
    }).catch( function(err){
      alert('Error sending new assignment to server');
      console.log(err);
    })
  }

  return (
    <div className='container-section'>
     <h2>Add New Assignent</h2>
     <form onSubmit={addNewPairAssignment}>
        {/* Company Select */}
        <label>Company:</label>
        <select required value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          <option value="" disabled hidden >Select Company</option>
          {uniqueCompanies.map((company, index) => (
            <option key={index} value={company}>{company}</option>
          ))}
        </select>

        {/* Manager Select */}
        <label>Manager:</label>
        <select required value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
          <option value="" disabled hidden >Select Manager</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>{manager.username}</option>
          ))}
        </select>

        {/* Team Member Select */}
        <label>Team Member:</label>
        <select required value={selectedTeamMember} onChange={(e) => setSelectedTeamMember(e.target.value)}>
          <option value="" disabled hidden >Select Team Member</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>{member.username}</option>
          ))}
        </select>

        {/* Quarter Title */}
        <label>Quarter Title:</label>
        <select required value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)} >
          <option value="" disabled hidden >Select Quarter</option>
          {quarters.map((title, index) => (
            <option key={index} value={title}>{title}</option>
          ))}
        </select>

        {/* Start Date */}
        <label>Start Date:</label>
        <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <button type="submit">Create Assignment</button>
      </form>
    </div>
  );
}

export default AdminNewPairAssignment;
