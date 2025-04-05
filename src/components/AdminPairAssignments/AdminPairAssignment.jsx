import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';

function AdminUpdateAdminPairAssignment() {
  const assignedUsers = useStore((state) => state.assignedUsers);
  const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);

  // Filtering state for the group.
  const [filters, setFilters] = useState({
    company_name: '',
    manager_id: '',
    team_member_id: '',
    quarter_title: ''
  });

  const [quarters, setQuarters] = useState([]);
  const [groupAssignments, setGroupAssignments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quarter titles from weeks.
  useEffect(() => {
    console.log("Fetching quarters from weeks...");
    fetchAssignedUsers();
    axios.get('/api/week')
      .then(res => {
        console.log("Fetched weeks for quarters:", res.data);
        const unique = [...new Set(res.data.map(w => w.quarter_title))];
        setQuarters(unique);
      })
      .catch(err => {
        console.error("Error fetching weeks:", err);
        setError("Failed to fetch weeks");
      });
  }, [fetchAssignedUsers]);

  // Fetch group assignments based on current filters.
  const fetchGroup = async () => {
    const { company_name, manager_id, quarter_title, team_member_id } = filters;
    const url = `/api/assignments/group/${manager_id}/${company_name}/${quarter_title}/${team_member_id || ''}`;
    console.log("Fetching group with URL:", url);
    try {
      const res = await axios.get(url);
      console.log("Fetched group assignments:", res.data);
      setGroupAssignments(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching group:", err.response ? err.response.data : err);
      setError("Failed to fetch group assignments");
    }
  };

  // Update the entire group.
  const updateGroup = async () => {
    try {
      console.log("Updating group assignments...");
      // Update each row individually.
      await Promise.all(
        groupAssignments.map(row =>
          axios.put(`/api/assignments/${row.id}`, {
            manager_id: parseInt(filters.manager_id),
            team_member_id: filters.team_member_id ? parseInt(filters.team_member_id) : row.team_member_id,
            active_date_start: row.active_date_start
          })
        )
      );
      console.log("Group updated successfully");
      alert("Group updated");
      // Re-fetch group assignments to refresh local state.
      fetchGroup();
    } catch (err) {
      console.error("Error updating group:", err.response ? err.response.data : err);
      setError("Failed to update group assignments");
    }
  };

  // Delete the entire group.
  const deleteGroup = async () => {
    const { company_name, manager_id, quarter_title } = filters;
    const payload = { company_name, manager_id, quarter_title };
    console.log("Deleting group with payload:", payload);
    try {
      await axios.delete('/api/assignments/group', { data: payload });
      console.log("Group deleted successfully");
      alert("Group deleted");
      // Clear the group assignments from local state.
      setGroupAssignments([]);
    } catch (err) {
      console.error("Error deleting group:", err.response ? err.response.data : err);
      setError("Failed to delete group");
    }
  };

  return (
    <section>
      <h2>Edit Pair Assignment Group</h2>
      <div>
        <label>Company:</label>
        <input
          value={filters.company_name}
          onChange={(e) => setFilters({ ...filters, company_name: e.target.value })}
        />

        <label>Manager:</label>
        <select
          value={filters.manager_id}
          onChange={(e) => setFilters({ ...filters, manager_id: e.target.value })}
        >
          <option value="">Select</option>
          {assignedUsers.filter(u => u.role === 'manager').map(u => (
            <option key={u.id} value={u.id}>{u.first_name}</option>
          ))}
        </select>

        <label>Team Member (Optional):</label>
        <select
          value={filters.team_member_id}
          onChange={(e) => setFilters({ ...filters, team_member_id: e.target.value })}
        >
          <option value="">(Optional)</option>
          {assignedUsers.filter(u => u.role === 'team_member').map(u => (
            <option key={u.id} value={u.id}>{u.first_name}</option>
          ))}
        </select>

        <label>Quarter:</label>
        <select
          value={filters.quarter_title}
          onChange={(e) => setFilters({ ...filters, quarter_title: e.target.value })}
        >
          <option value="">Select</option>
          {quarters.map((q, i) => <option key={i} value={q}>{q}</option>)}
        </select>
      </div>

      <div className="space-x-2 mt-2">
        <button onClick={fetchGroup}>Fetch Group</button>
        <button onClick={() => setEditMode(true)}>Edit</button>
        <button onClick={deleteGroup}>Delete Group</button>
      </div>

      {groupAssignments.length > 0 && (
        <>
          <h4 className="mt-4">Assignments</h4>
          <ul>
            {groupAssignments.map((row) => (
              <li key={row.id}>
                Week {row.week} — {row.active_date_start ? row.active_date_start.split('T')[0] : 'N/A'}
              </li>
            ))}
          </ul>
          {editMode && (
            <button className="mt-2" onClick={updateGroup}>
              Save Changes
            </button>
          )}
        </>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </section>
  );
}



export default AdminUpdateAdminPairAssignment;