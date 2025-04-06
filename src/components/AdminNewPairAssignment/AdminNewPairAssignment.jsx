import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import axios from "axios";

function AdminNewPairAssignment() {
  // Get store data and actions.
  const user = useStore((state) => state.user);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);
  const fetchPairAssignments = useStore((state) => state.fetchPairAssignments);

  // Local state for weeks (for quarter info)
  const [weeks, setWeeks] = useState([]);

  // Form selection state.
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [startDate, setStartDate] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');

  // Derived lists for dropdowns.
  const uniqueCompanies = [...new Set(assignedUsers.map((user) => user.company))];
  const quarters = [...new Set(weeks.map((week) => week.quarter_title))];

  // Local state for dropdown options.
  const [managers, setManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Fetch weeks from backend.
  function fetchWeeks() {
    axios
      .get('/api/week')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setWeeks(response.data);
        } else {
          console.error('Weeks: Expected an array but got:', response.data);
          setWeeks([]);
        }
      })
      .catch((err) => {
        console.error('Weeks: Error fetching weeks:', err);
        alert('Error in fetchWeek: ' + err.message);
      });
  }

  // On mount, load assigned users, weeks, and pair assignments.
  useEffect(() => {
    fetchAssignedUsers();
    fetchWeeks();
    fetchPairAssignments();
  }, []);

  // Update manager dropdown when a company is selected.
  useEffect(() => {
    if (selectedCompany) {
      const companyManagers = assignedUsers.filter(
        (user) => user.company === selectedCompany && user.role === 'manager'
      );
      setManagers(companyManagers);
      setSelectedManager('');
      setTeamMembers([]);
    }
  }, [selectedCompany, assignedUsers]);

  // Update team member dropdown when a manager is selected.
  useEffect(() => {
    if (selectedManager) {
      const managerTeam = assignedUsers.filter(
        (user) =>
          user.manager_assigned === parseInt(selectedManager) &&
          user.id !== parseInt(selectedManager)
      );
      setTeamMembers(managerTeam);
    } else {
      setTeamMembers([]);
    }
  }, [selectedManager, assignedUsers]);

  // Handle form submission.
  function addNewPairAssignment(e) {
    e.preventDefault();
    const payload = {
      admin_id: user.id,
      company_name: selectedCompany,
      manager_id: Number(selectedManager),
      team_member_id: Number(selectedTeamMember),
      active_date_start: startDate,
      quarter_title: selectedQuarter,
    };
    axios
      .post('/api/assignments/assign', payload)
      .then((response) => {
        fetchPairAssignments();
        // Clear form fields.
        setSelectedCompany('');
        setSelectedManager('');
        setSelectedTeamMember('');
        setStartDate('');
        setSelectedQuarter('');
      })
      .catch((err) => {
        alert('Error sending new assignment to server');
        console.error('Assignment submission error:', err);
      });
  }

  return (
    <div className="container-section">
      <h2>Add New Assignment</h2>
      <form onSubmit={addNewPairAssignment}>
        {/* Company Select */}
        <label>Company:</label>
        <select
          required
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="" disabled hidden>
            Select Company
          </option>
          {uniqueCompanies.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>

        {/* Manager Select */}
        <label>Manager:</label>
        <select
          required
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          <option value="" disabled hidden>
            Select Manager
          </option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.username}
            </option>
          ))}
        </select>

        {/* Team Member Select */}
        <label>Team Member:</label>
        <select
          required
          value={selectedTeamMember}
          onChange={(e) => setSelectedTeamMember(e.target.value)}
        >
          <option value="" disabled hidden>
            Select Team Member
          </option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.username}
            </option>
          ))}
        </select>

        {/* Quarter Title */}
        <label>Quarter Title:</label>
        <select
          required
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
        >
          <option value="" disabled hidden>
            Select Quarter
          </option>
          {quarters.map((title, index) => (
            <option key={index} value={title}>
              {title}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <label>Start Date:</label>
        <input
          required
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <button type="submit">Assign Week</button>
      </form>
    </div>
  );
}

export default AdminNewPairAssignment;