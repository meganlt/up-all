import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';

function AdminUpdateAdminPairAssignment() {
    const assignedUsers = useStore((state) => state.assignedUsers);
    const fetchAssignedUsers = useStore((state) => state.fetchAssignedUsers);
    const fetchUser = useStore((state) => state.fetchUser);
  
    const [filters, setFilters] = useState({
      company_name: '',
      manager_id: '',
      team_member_id: '',
      quarter_title: ''
    });
  
    const [quarters, setQuarters] = useState([]);
    const [groupAssignments, setGroupAssignments] = useState([]);
    const [editMode, setEditMode] = useState(false);
  
    useEffect(() => {
      fetchUser();
      fetchAssignedUsers();
      axios.get('/api/week').then(res => {
        const unique = [...new Set(res.data.map(w => w.quarter_title))];
        setQuarters(unique);
      });
    }, [fetchUser, fetchAssignedUsers]);
  
    const fetchGroup = async () => {
      const { company_name, manager_id, quarter_title, team_member_id } = filters;
      const url = `/api/assignments/group/${manager_id}/${company_name}/${quarter_title}/${team_member_id || ''}`;
      const res = await axios.get(url);
      setGroupAssignments(res.data);
    };
  
    const updateGroup = async () => {
      await Promise.all(
        groupAssignments.map(row =>
          axios.put(`/api/assignments/${row.id}`, {
            manager_id: parseInt(filters.manager_id),
            team_member_id: filters.team_member_id ? parseInt(filters.team_member_id) : null,
            active_date_start: row.active_date_start
          })
        )
      );
      alert('Group updated');
    };
  
    const deleteGroup = async () => {
      await axios.delete('/api/assignments/group', { data: filters });
      alert('Deleted');
      setGroupAssignments([]);
    };
  
    return (
      <section>
        <h2>Edit Pair Assignment Group</h2>
  
        <label>Company:</label>
        <input value={filters.company_name} onChange={(e) => setFilters({ ...filters, company_name: e.target.value })} />
  
        <label>Manager:</label>
        <select value={filters.manager_id} onChange={(e) => setFilters({ ...filters, manager_id: e.target.value })}>
          <option value="">Select</option>
          {assignedUsers.filter(u => u.role === 'manager').map(u => (
            <option key={u.id} value={u.id}>{u.first_name}</option>
          ))}
        </select>
  
        <label>Team Member:</label>
        <select value={filters.team_member_id} onChange={(e) => setFilters({ ...filters, team_member_id: e.target.value })}>
          <option value="">(Optional)</option>
          {assignedUsers.filter(u => u.role === 'team_member').map(u => (
            <option key={u.id} value={u.id}>{u.first_name}</option>
          ))}
        </select>
  
        <label>Quarter:</label>
        <select value={filters.quarter_title} onChange={(e) => setFilters({ ...filters, quarter_title: e.target.value })}>
          <option value="">Select</option>
          {quarters.map((q, i) => <option key={i} value={q}>{q}</option>)}
        </select>
  
        <div className="space-x-2 mt-2">
          <button onClick={fetchGroup}>Fetch Group</button>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={deleteGroup}>Delete</button>
        </div>
  
        {groupAssignments.length > 0 && (
          <>
            <h4 className="mt-4">Assignments</h4>
            <ul>
              {groupAssignments.map((row) => (
                <li key={row.id}>Week {row.week} — {row.active_date_start?.split('T')[0]}</li>
              ))}
            </ul>
            {editMode && <button className="mt-2" onClick={updateGroup}>Save Changes</button>}
          </>
        )}
      </section>
    );
  }
  
  export default AdminUpdateAdminPairAssignment;