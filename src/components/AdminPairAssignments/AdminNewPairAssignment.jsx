import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import axios from "axios";


function AdminNewPairAssignment() {
  // Get user and assigned users from the store.
  const user = useStore((state) => state.user);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);
  const fetchUser = useStore((state) => state.fetchUser);

  // State for week data and assignment form.
  const [weeks, setWeeks] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [startDate, setStartDate] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');

  // Derived lists.
  const uniqueCompanies = [...new Set(assignedUsers.map((u) => u.company))];
  const quarters = [...new Set(weeks.map((w) => w.quarter_title))];

  // Local state for managers and team members.
  const [managers, setManagers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // State for existing pair assignments and errors.
  const [pairs, setPairs] = useState([]);
  const [assignmentError, setAssignmentError] = useState(null);
  
  // A refresh trigger to force a re-fetch.
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  console.log("Current user:", user);
  console.log("Assigned users:", assignedUsers);
  console.log("Unique companies:", uniqueCompanies);
  console.log("Quarter titles:", quarters);

  // Fetch weeks from the backend.
  const fetchWeeks = () => {
    axios.get("/api/week")
      .then((response) => {
        console.log("Fetched weeks response:", response.data);
        if (Array.isArray(response.data)) {
          setWeeks(response.data);
        } else {
          console.error("Expected an array for weeks but got:", response.data);
          setWeeks([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching weeks:", err);
        alert("Error in fetchWeeks: " + err.message);
      });
  };

  // Fetch initial data on mount.
  useEffect(() => {
    console.log("Fetching initial data...");
    fetchUser();
    fetchAssignedUsers();
    fetchWeeks();
  }, [fetchUser, fetchAssignedUsers]);

  // Fetch all pair assignments.
  const fetchPairs = () => {
    axios.get('/api/assignments')
      .then((res) => {
        console.log("Fetched assignments:", res.data);
        setPairs(res.data);
      })
      .catch((err) => {
        console.error("Failed to load assignments:", err);
        setAssignmentError("Failed to load assignments");
      });
  };

  // Fetch pairs when the component mounts and whenever refreshTrigger changes.
  useEffect(() => {
    console.log("Fetching pair assignments...");
    fetchPairs();
  }, [refreshTrigger]);

  // Update managers when selectedCompany changes.
  useEffect(() => {
    if (selectedCompany) {
      const companyManagers = assignedUsers.filter(
        (u) => u.company === selectedCompany && u.role === "manager"
      );
      console.log(`Managers for company "${selectedCompany}":`, companyManagers);
      setManagers(companyManagers);
      setSelectedManager('');
      setTeamMembers([]); // Reset team members when company changes.
    }
  }, [selectedCompany, assignedUsers]);

  // Update team members when selectedManager changes.
  useEffect(() => {
    if (selectedManager) {
      const managerTeam = assignedUsers.filter(
        (u) => u.manager_assigned === parseInt(selectedManager)
      );
      console.log(`Team members for manager "${selectedManager}":`, managerTeam);
      setTeamMembers(managerTeam);
    } else {
      setTeamMembers([]);
    }
  }, [selectedManager, assignedUsers]);

  // Function to assign a manager to a team member.
  const assignManagerToUser = (teamMemberId, managerId) => {
    console.log(`Assigning manager ${managerId} to team member ${teamMemberId}`);
    return axios.put('/api/assignments/user/assign-manager', {
      team_member_id: teamMemberId,
      manager_id: managerId,
    });
  };

  // Handle form submission to create new assignments.
  async function addNewPairAssignment(e) {
    e.preventDefault();
    console.log("Submitting new assignment...");
    try {
      // Update manager assignment for the selected team member.
      if (selectedTeamMember) {
        await assignManagerToUser(selectedTeamMember, selectedManager);
      }
      const payload = {
        admin_id: 1, // Hard-coded as 1.
        company_name: selectedCompany,
        manager_id: Number(selectedManager),
        team_member_id: Number(selectedTeamMember),
        active_date_start: startDate,
        quarter_title: selectedQuarter
      };
      console.log("Payload for new assignment:", payload);
      const response = await axios.post('/api/assignments/assign', payload);
      console.log("New assignment created:", response.data);
      alert("Assignment Created!");
      // Reset form fields.
      setSelectedCompany('');
      setSelectedManager('');
      setSelectedTeamMember('');
      setStartDate('');
      setSelectedQuarter('');
      fetchAssignedUsers();
      // Trigger refresh of assignments without a full page reload.
      setRefreshTrigger(prev => !prev);
    } catch (err) {
      console.error("Error in addNewPairAssignment:", err.response ? err.response.data : err);
      alert("Failed to create assignment");
    }
  }

  return (
    <div className="container-section">
      <h2>Add New Assignment</h2>
      <form onSubmit={addNewPairAssignment} className="mb-8">
        <label>Company:</label>
        <select required value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          <option value="" disabled hidden>Select Company</option>
          {uniqueCompanies.map((company, index) => (
            <option key={index} value={company}>{company}</option>
          ))}
        </select>

        <label>Manager:</label>
        <select required value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
          <option value="" disabled hidden>Select Manager</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.username}
            </option>
          ))}
        </select>

        <label>Team Member:</label>
        <select required value={selectedTeamMember} onChange={(e) => setSelectedTeamMember(e.target.value)}>
          <option value="" disabled hidden>Select Team Member</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.username}
            </option>
          ))}
        </select>

        <label>Quarter Title:</label>
        <select required value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
          <option value="" disabled hidden>Select Quarter</option>
          {quarters.map((title, index) => (
            <option key={index} value={title}>{title}</option>
          ))}
        </select>

        <label>Start Date:</label>
        <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <button type="submit">Assign Pair</button>
      </form>
    </div>
  );
}

export default AdminNewPairAssignment;