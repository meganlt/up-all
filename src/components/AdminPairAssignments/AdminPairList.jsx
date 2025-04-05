import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import axios from 'axios';

function AdminPairList() {
  // State for pair assignments and errors.
  const [pairs, setPairs] = useState([]);
  const [error, setError] = useState(null);
  
  // Bring in assignedUsers from your store.
  const assignedUsers = useStore((state) => state.assignedUsers);

  // Function to fetch all assignments.
  const fetchPairAssignments = () => {
    axios.get('/api/assignments')
      .then((res) => {
        console.log('Fetched assignments:', res.data);
        setPairs(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments');
      });
  };

  // useEffect to fetch assignments once on mount.
  useEffect(() => {
    console.log("Fetching pair assignments on mount...");
    fetchPairAssignments();
  }, []);

  // Optional useEffect to log changes to pairs (remove if it affects your layout).
  useEffect(() => {
    console.log("Pairs state updated:", pairs);
  }, [pairs]);

  // Group assignments by company, manager, and quarter.
  const groupedAssignments = pairs.reduce((acc, pair) => {
    const key = `${pair.company_name}-${pair.manager_id}-${pair.quarter_title}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(pair);
    return acc;
  }, {});

  // Toggle expanded state for a group.
  const [expandedGroups, setExpandedGroups] = useState({});
  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Group editing state.
  const [editingGroupKey, setEditingGroupKey] = useState(null);
  const [editGroupData, setEditGroupData] = useState({});

  // Called when the group Edit button is clicked.
  const startGroupEditing = (groupKey, group) => {
    console.log('Start group editing for group:', groupKey, group);
    setEditingGroupKey(groupKey);
    const sortedGroup = group.sort((a, b) => a.week - b.week);
    const firstAssignment = sortedGroup[0];
    setEditGroupData({
      company_name: firstAssignment.company_name,
      quarter_title: firstAssignment.quarter_title,
      manager_id: firstAssignment.manager_id,
      active_date_start: firstAssignment.active_date_start,
      new_team_member_id: ""
    });
  };

  const cancelGroupEditing = () => {
    console.log('Cancel group editing');
    setEditingGroupKey(null);
    setEditGroupData({});
  };

  // Save edited group.
  const saveGroupEditing = (groupKey) => {
    const payload = {
      original_key: groupKey, // Format: "company-managerID-quarter"
      company_name: editGroupData.company_name, // Read-only.
      manager_id: editGroupData.manager_id,       // Updated via drop‑down.
      quarter_title: editGroupData.quarter_title,   // Read-only.
      active_date_start: editGroupData.active_date_start, // Updated start date.
      new_team_member_id: editGroupData.new_team_member_id || null // Optional.
    };
    console.log('Saving group editing with payload:', payload);
    // Use the first assignment's id from the group to update the entire group.
    const groupId = groupedAssignments[groupKey].sort((a, b) => a.week - b.week)[0].id;
    axios.put(`/api/assignments/group-update/${groupId}`, payload)
      .then((res) => {
        console.log('Group update successful:', res.data);
        setEditingGroupKey(null);
        setEditGroupData({});
        // Update local state by re-fetching assignments.
        fetchPairAssignments();
      })
      .catch((err) => {
        console.error('Group update error:', err);
        setError('Failed to update group assignments');
      });
  };

  // Delete an individual assignment.
  const deleteAssignment = (id) => {
    console.log(`Deleting assignment with id ${id}`);
    axios.delete(`/api/assignments/${id}`)
      .then(() => {
        console.log(`Assignment ${id} deleted successfully.`);
        // Update local state without re-fetching from the server:
        setPairs(prev => prev.filter(pair => pair.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting assignment:", err.response ? err.response.data : err);
        setError("Failed to delete assignment");
      });
  };

  // Delete an entire group.
  const deleteGroup = (groupKey) => {
    const group = groupedAssignments[groupKey];
    const firstAssignment = group[0];
    const payload = {
      company_name: firstAssignment.company_name,
      manager_id: firstAssignment.manager_id,
      quarter_title: firstAssignment.quarter_title
    };
    console.log("Deleting group with payload:", payload);
    axios.delete('/api/assignments/group', { data: payload })
      .then(() => {
        console.log("Group deleted successfully.");
        // Update local state by filtering out assignments in this group.
        setPairs(prev => prev.filter(pair =>
          !(pair.company_name === payload.company_name &&
            pair.manager_id === payload.manager_id &&
            pair.quarter_title === payload.quarter_title)
        ));
      })
      .catch((err) => {
        console.error("Error deleting group:", err.response ? err.response.data : err);
        setError("Failed to delete group");
      });
  };

  // For group editing drop-downs: Filter managers and team members by the selected company.
  const managersForCompany = assignedUsers.filter(
    (u) => u.company === editGroupData.company_name && u.role === 'manager'
  );
  const teamMembersForCompany = assignedUsers.filter(
    (u) => u.company === editGroupData.company_name && u.role !== 'manager'
  );

  return (
    <div className="_template">
      <h2>All Pair Assignments</h2>
      {error && <p className="text-red-600">{error}</p>}
      {Object.keys(groupedAssignments).length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        Object.entries(groupedAssignments).map(([groupKey, group]) => {
          const sortedGroup = group.sort((a, b) => a.week - b.week);
          const firstAssignment = sortedGroup[0];
          // Build header text including team member names.
          const teamMembersInGroup = [
            ...new Set(group.map(row => row.team_member_name || row.team_member_id || "N/A"))
          ];
          const headerText = `${firstAssignment.company_name} | Manager: ${firstAssignment.manager_name || firstAssignment.manager_id} | Team Member: ${teamMembersInGroup.join(", ")} | Quarter: ${firstAssignment.quarter_title}`;
          const weekText = `Week ${firstAssignment.week} – ${firstAssignment.active_date_start ? new Date(firstAssignment.active_date_start).toLocaleDateString() : 'N/A'}`;
          
          return (
            <div key={groupKey} className="mb-4 border p-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingGroupKey === groupKey ? (
                  <div>
                    <div>
                      <label>
                        Company:&nbsp;
                        <span className="ml-1">{editGroupData.company_name}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        Manager:&nbsp;
                        <select 
                          value={editGroupData.manager_id}
                          onChange={(e) => setEditGroupData(prev => ({ ...prev, manager_id: e.target.value }))}
                          className="ml-1 border p-1"
                        >
                          {managersForCompany.map(manager => (
                            <option key={manager.id} value={manager.id}>
                              {manager.username}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div>
                      <label>
                        Quarter Title:&nbsp;
                        <span className="ml-1">{editGroupData.quarter_title}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        Start Date:&nbsp;
                        <input 
                          type="date" 
                          value={editGroupData.active_date_start ? editGroupData.active_date_start.split('T')[0] : ''} 
                          onChange={(e) => setEditGroupData(prev => ({ ...prev, active_date_start: e.target.value }))}
                          className="ml-1 border p-1"
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        New Team Member (Optional):&nbsp;
                        <select 
                          value={editGroupData.new_team_member_id}
                          onChange={(e) => setEditGroupData(prev => ({ ...prev, new_team_member_id: e.target.value }))}
                          className="ml-1 border p-1"
                        >
                          <option value="">Select Team Member</option>
                          {teamMembersForCompany.map(tm => (
                            <option key={tm.id} value={tm.id}>{tm.username}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong>{headerText}</strong>
                    <br />
                    <span>{weekText}</span>
                  </div>
                )}
                <div>
                  {editingGroupKey === groupKey ? (
                    <>
                      <button 
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2" 
                        onClick={() => saveGroupEditing(groupKey)}
                      >
                        Save
                      </button>
                      <button 
                        className="bg-gray-500 text-white px-2 py-1 rounded" 
                        onClick={cancelGroupEditing}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="bg-blue-500 text-white px-2 py-1 rounded" 
                        onClick={() => startGroupEditing(groupKey, group)}
                      >
                        Edit
                      </button>
                      <button 
                        className="bg-red-500 text-white px-2 py-1 rounded ml-2" 
                        onClick={() => deleteGroup(groupKey)}
                      >
                        Delete Group
                      </button>
                    </>
                  )}
                  <button 
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2" 
                    onClick={() => toggleGroup(groupKey)}
                  >
                    {expandedGroups[groupKey] ? 'Hide Weeks' : 'Show All Weeks'}
                  </button>
                </div>
              </div>
              {expandedGroups[groupKey] && (
                <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Week</th>
                        <th className="border p-2">Active Date</th>
                        <th className="border p-2">Team Member</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedGroup.map(assignment => (
                        <tr key={assignment.id}>
                          <td className="border p-2">{assignment.week}</td>
                          <td className="border p-2">
                            {assignment.active_date_start 
                              ? new Date(assignment.active_date_start).toLocaleDateString() 
                              : 'N/A'}
                          </td>
                          <td className="border p-2">{assignment.team_member_name || assignment.team_member_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default AdminPairList;