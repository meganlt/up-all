import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import axios from 'axios';

function AdminPairAssignment() {
  const user = useStore((state) => state.user);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);

  const [weeks, setWeeks] = useState([]);
  const [pairAssignments, setPairAssignments] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [expandedRows, setExpandedRows] = useState({});
  const [editingGroupKey, setEditingGroupKey] = useState(null);
  const [editValues, setEditValues] = useState({ manager_id: "", team_member_id: "" });

  const [companyFilter, setCompanyFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedTeamMember1, setSelectedTeamMember1] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");

  const uniqueCompanies = [...new Set(assignedUsers.map((u) => u.company))];
  const quarters = [...new Set(weeks.map((week) => week.quarter_title))];

  useEffect(() => {
    fetchAssignedUsers();
    fetchWeeks();
    fetchPairAssignments();
  }, [refreshTrigger]);

  const fetchWeeks = () => {
    axios.get("/api/week")
      .then(res => setWeeks(res.data))
      .catch(err => console.error(err));
  };

  const fetchPairAssignments = () => {
    axios.get("/api/assignments")
      .then(res => {
        console.log("Fetched assignments:", res.data);
        setPairAssignments(res.data);
      })
      .catch(err => console.error(err));
  };

  const groupedAssignments = pairAssignments.reduce((acc, curr) => {
    const key = `${curr.company_name}-${curr.manager_id}-${curr.quarter_title}`;
    console.log("GROUP KEY:", key);
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const toggleRow = (key) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditSubmit = async (group) => {
    const first = group[0];
    try {
      await axios.put("/api/assignments/group-update", {
        original_company_name: first.company_name,
        original_manager_id: first.manager_id,
        original_team_member_id: first.team_member_id,
        original_quarter_title: first.quarter_title,
        new_manager_id: editValues.manager_id,
        new_team_member_id: editValues.team_member_id,
      });
      setEditingGroupKey(null);
      setRefreshTrigger(prev => !prev);
      alert("Group updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update group");
    }
  };

  const addNewPairAssignment = async (e) => {
    e.preventDefault();
    const payload = {
      admin_id: user.id,
      company_name: selectedCompany,
      manager_id: parseInt(selectedManager),
      team_member_id: selectedTeamMember1 ? parseInt(selectedTeamMember1) : null,
      active_date_start: startDate,
      quarter_title: selectedQuarter,
    };

    try {
      const response = await axios.post("/api/assignments/assign", payload);
      console.log("Created assignments:", response.data);
      setRefreshTrigger(prev => !prev);
      alert("Assignment created successfully!");
    } catch (err) {
      console.error("Failed to create assignment:", err);
      alert("Failed to create assignment");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>All Pair Assignments</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
          <option value="">Filter by Company</option>
          {uniqueCompanies.map((company, idx) => (
            <option key={idx} value={company}>{company}</option>
          ))}
        </select>

        <select value={managerFilter} onChange={(e) => setManagerFilter(e.target.value)}>
          <option value="">Filter by Manager</option>
          {assignedUsers.filter(u => u.role === "manager").map(m => (
            <option key={m.id} value={m.id}>{m.username}</option>
          ))}
        </select>
      </div>

      {/* Debug Table */}
      <h3>Debug: Raw Assignment Rows</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Company</th>
            <th>Manager ID</th>
            <th>Team Member ID</th>
            <th>Quarter</th>
            <th>Week</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {pairAssignments.map((a, i) => (
            <tr key={i}>
              <td>{a.company_name}</td>
              <td>{a.manager_id}</td>
              <td>{a.team_member_id ?? 'NULL'}</td>
              <td>{a.quarter_title}</td>
              <td>{a.week}</td>
              <td>{new Date(a.active_date_start).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Form */}
      <h2>Add New Assignment</h2>
      <form onSubmit={addNewPairAssignment} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
          <option value="">Select Company</option>
          {uniqueCompanies.map((company, idx) => (
            <option key={idx} value={company}>{company}</option>
          ))}
        </select>

        <select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
          <option value="">Select Manager</option>
          {assignedUsers.filter(u => u.role === "manager" && u.company === selectedCompany).map(m => (
            <option key={m.id} value={m.id}>{m.username}</option>
          ))}
        </select>

        <select value={selectedTeamMember1} onChange={(e) => setSelectedTeamMember1(e.target.value)}>
          <option value="">Select Team Member</option>
          {assignedUsers.filter(u => u.manager_assigned == selectedManager).map(tm => (
            <option key={tm.id} value={tm.id}>{tm.username}</option>
          ))}
        </select>

        <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
          <option value="">Select Quarter</option>
          {quarters.map((q, idx) => (
            <option key={idx} value={q}>{q}</option>
          ))}
        </select>

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <button type="submit">Assign Team</button>
      </form>
    </div>
  );
}

export default AdminPairAssignment;