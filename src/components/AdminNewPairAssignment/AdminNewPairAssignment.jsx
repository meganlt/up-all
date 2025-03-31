import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import axios from "axios";

function AdminNewPairAssignment() {
  const [weeks, setWeeks] = useState([]);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);

  console.log('weeks:', weeks);

  // State for selected options
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedManager, setSelectedManager] = useState('');

  // Derived lists
  const uniqueCompanies = [...new Set(assignedUsers.map(user => user.company))];
  const quarters = [...new Set(weeks.map( week => week.quarter_title))];
  const [managers, setManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [startDate, setStartDate] = useState('');

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

  function handleStartChange(e) {
    setStartDate(e.target.value);
    // calculate the end date, which is automatically 12 weeks after the start date.
    // Display end date on the dom for Admin's visiblity 
  }

  function addNewPairAssignment(e) {
    e.preventDefault();
    console.log('Submitting new assignment...');
    // TO DO: Axios POST call
  }

  return (
    <div className='container-section'>
     <h2>Add New Assignent</h2>
     <form onSubmit={addNewPairAssignment}>
        {/* Company Select */}
        <label>Company:</label>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          <option value="">Select Company</option>
          {uniqueCompanies.map((company, index) => (
            <option key={index} value={company}>{company}</option>
          ))}
        </select>

        {/* Manager Select */}
        <label>Manager:</label>
        <select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
          <option value="">Select Manager</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>{manager.username}</option>
          ))}
        </select>

        {/* Team Member Select */}
        <label>Team Member:</label>
        <select>
          <option value="">Select Team Member</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>{member.username}</option>
          ))}
        </select>

        {/* Quarter Title */}
        <label>Quarter Title:</label>
        <select>
          {quarters.map((title, index) => (
            <option key={index} value={title}>{title}</option>
          ))}
        </select>

        {/* Start Date */}
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={handleStartChange} />

        <button type="submit">Assign Week</button>
      </form>
    </div>
  );
}

export default AdminNewPairAssignment;
