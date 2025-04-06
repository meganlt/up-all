import { useState, useEffect, useMemo } from 'react';
import useStore from '../../zustand/store';
import axios from 'axios';

function AdminPairList() {
  const pairAssignments = useStore((state) => state.pairAssignments);
  const fetchPairAssignments = useStore((state) => state.fetchPairAssignments);
  const assignedUsers = useStore((state) => state.assignedUsers);
  const [weeks, setWeeks] = useState([]);

  // Default view: pending (incomplete) assignments.
  const [viewCompleted, setViewCompleted] = useState(false);

  // Filtering state.
  const [showCompanyFilter, setShowCompanyFilter] = useState(false);
  const [showManagerFilter, setShowManagerFilter] = useState(false);
  const [selectedFilterCompany, setSelectedFilterCompany] = useState('');
  const [selectedFilterManager, setSelectedFilterManager] = useState('');

  // Inline editing state.
  const [editingKey, setEditingKey] = useState(null);
  const [editValues, setEditValues] = useState({
    new_manager_id: '',
    new_team_member_id: '',
    new_active_date_start: '',
  });

  // -------------------------------------------
  // Fetch Weeks
  // -------------------------------------------
  function fetchWeeks() {
    console.log('Fetching Weeks...');
    axios
      .get('/api/week')
      .then((response) => {
        if (Array.isArray(response.data)) {
          console.log('Weeks Fetched Successfully:', response.data);
          setWeeks(response.data);
        } else {
          console.error('Expected An Array For Weeks But Got:', response.data);
          setWeeks([]);
        }
      })
      .catch((err) => {
        console.error('Error Fetching Weeks:', err);
        alert('Error In FetchWeek: ' + err.message);
      });
  }

  // -------------------------------------------
  // On Mount: Fetch Pair Assignments And Weeks
  // -------------------------------------------
  useEffect(() => {
    console.log('Fetching All Pair Assignments...');
    fetchPairAssignments();
    fetchWeeks();
  }, []);

  // -------------------------------------------
  // Group Assignments By Company, Manager, And Team Member
  // -------------------------------------------
  const groupedAssignments = useMemo(() => {
    if (!pairAssignments.length || !weeks.length) {
      console.log('No Pair Assignments Or Weeks Available Yet.');
      return [];
    }
    console.log('Grouping Assignments...');
    const weekToQuarter = new Map(weeks.map((w) => [w.id, w.quarter_title]));
    const groups = {};

    pairAssignments.forEach((item) => {
      //console.log('Processing Item:', item);
      const key = `${item.company_name}-${item.manager_id}-${item.team_member_id}`;
      if (!groups[key]) {
        groups[key] = {
          key,
          company_name: item.company_name,
          manager_id: item.manager_id,
          manager: item.manager_name,
          team_member_id: item.team_member_id,
          team_member: item.team_member_name,
          quarter_title: weekToQuarter.get(item.dashboard_week_id) || '',
          active_dates: [],
          is_completed: item.is_completed || false,
        };
      }
      //console.log('Updating Each Week In Pair Assignment:', item);//
      groups[key].active_dates.push(new Date(item.active_date_start));
    });
    console.log('Grouped Assignments:', groups);
    return Object.values(groups);
  }, [pairAssignments, weeks]);

  // -------------------------------------------
  // Format Active Date Ranges
  // -------------------------------------------
  const formattedAssignments = useMemo(() => {
    console.log('Formatting Assignments...');
    const formatted = groupedAssignments.map((group) => {
      if (!group.active_dates.length) {
        console.warn('No Active Dates For Group:', group);
        return { ...group, active_dates: 'No Dates', first_active_date: null };
      }
      const sortedDates = group.active_dates.sort((a, b) => a - b);
      const firstDate = sortedDates[0];
      const lastDate = new Date(sortedDates[sortedDates.length - 1]);
      lastDate.setDate(lastDate.getDate() + 7);
      const formatDate = (date) =>
        `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      const formattedRange = `${formatDate(firstDate)} - ${formatDate(lastDate)}`;
      console.log(`Formatted Group ${group.key}: ${formattedRange}`);
      return {
        ...group,
        active_dates: formattedRange,
        first_active_date: firstDate,
      };
    });
    console.log('Fetching All Formatted Assignments:', formatted);
    return formatted;
  }, [groupedAssignments]);

  // -------------------------------------------
  // Unique Values For Filtering Dropdowns
  // -------------------------------------------
  const uniqueCompanies = useMemo(() => {
    const companies = [...new Set(formattedAssignments.map((item) => item.company_name))];
    console.log('Fetching Unique Companies:', companies);
    return companies;
  }, [formattedAssignments]);

  const uniqueManagers = useMemo(() => {
    const managers = [...new Set(formattedAssignments.map((item) => item.manager))];
    console.log('Fetching Unique Managers:', managers);
    return managers;
  }, [formattedAssignments]);

  // -------------------------------------------
  // Filter Assignments Based On Selected Filters And View Completed
  // -------------------------------------------
  const filteredAssignments = useMemo(() => {
    const filtered = formattedAssignments.filter((assignment) => {
      const companyMatch = selectedFilterCompany
        ? assignment.company_name === selectedFilterCompany
        : true;
      const managerMatch = selectedFilterManager
        ? assignment.manager === selectedFilterManager
        : true;
      const statusMatch = viewCompleted ? assignment.is_completed : !assignment.is_completed;
      return companyMatch && managerMatch && statusMatch;
    });
    console.log('Default Pending Pair Assignments:', filtered);
    return filtered;
  }, [formattedAssignments, selectedFilterCompany, selectedFilterManager, viewCompleted]);

  // -------------------------------------------
  // Inline Editing: Handle Edit, Cancel, Update
  // -------------------------------------------
  const handleEditClick = (group) => {
    console.log('Entering Edit Mode For Group:', group);
    setEditingKey(group.key);
    setEditValues({
      new_manager_id: group.manager_id,
      new_team_member_id: group.team_member_id,
      new_active_date_start: group.first_active_date
        ? new Date(group.first_active_date).toISOString().split('T')[0]
        : '',
    });
  };

  const handleCancelEdit = () => {
    console.log('Edit Canceled');
    setEditingKey(null);
    setEditValues({
      new_manager_id: '',
      new_team_member_id: '',
      new_active_date_start: '',
    });
  };

  const handleUpdate = (group) => {
    console.log('Updating Group:', group);
    console.log('New Values:', editValues);
    const payload = {
      company: group.company_name,
      original_manager_id: group.manager_id,
      original_team_member_id: group.team_member_id,
      new_manager_id: Number(editValues.new_manager_id),
      new_team_member_id: Number(editValues.new_team_member_id),
      new_active_date_start: editValues.new_active_date_start,
      quarter_title: group.quarter_title,
    };

    axios
      .put('/api/assignments/update/pair', payload)
      .then((res) => {
        console.log('Update Response:', res.data);
        fetchPairAssignments();
        setEditingKey(null);
      })
      .catch((err) => {
        console.error('Error Updating Assignment:', err);
        alert('Error updating assignment');
      });
  };

  // -------------------------------------------
  // Delete A Group Of Assignments
  // -------------------------------------------
  const handleDelete = (group) => {
    console.log('Deleting Group:', group);
    const payload = {
      company: group.company_name,
      manager_id: group.manager_id,
      team_member_id: group.team_member_id,
      quarter_title: group.quarter_title,
    };
    axios
      .delete('/api/assignments/delete/pair', { data: payload })
      .then((res) => {
        console.log('Delete Response:', res.data);
        fetchPairAssignments();
      })
      .catch((err) => {
        console.error('Error Deleting Assignment:', err);
        alert('Error deleting assignment');
      });
  };

  // -------------------------------------------
  // Mark Group As Complete/Incomplete
  // -------------------------------------------
  const handleMarkComplete = (group, newStatus) => {
    console.log(`Marking Group ${group.key} As ${newStatus ? 'Completed' : 'Incomplete'}`);
    const payload = {
      company: group.company_name,
      manager_id: group.manager_id,
      team_member_id: group.team_member_id,
      quarter_title: group.quarter_title,
      is_completed: newStatus,
    };
    axios
      .put('/api/assignments/complete/pair', payload)
      .then((res) => {
        console.log('Mark Complete Response:', res.data);
        fetchPairAssignments();
      })
      .catch((err) => {
        console.error('Error Marking Assignment Complete:', err);
        alert('Error marking assignment complete');
      });
  };

  return (
    <div className="_template">
      <h2>All Pair Assignments</h2>
      {/* Filter Section: Arranged In One Row */}
      <div
        style={{
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => {
            setViewCompleted(false);
            console.log('Switching To Pending Assignments View');
          }}
        >
          View Pending Assignments
        </button>
        <button
          onClick={() => {
            setViewCompleted(true);
            console.log('Switching To Completed Assignments View');
          }}
        >
          View Completed Assignments
        </button>
        <button
          onClick={() =>
            setShowCompanyFilter((prev) => {
              if (prev) setSelectedFilterCompany('');
              return !prev;
            })
          }
        >
          Filter By Company
        </button>
        {showCompanyFilter && (
          <select
            value={selectedFilterCompany}
            onChange={(e) => {
              console.log('Company Filter Changed To:', e.target.value);
              setSelectedFilterCompany(e.target.value);
            }}
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() =>
            setShowManagerFilter((prev) => {
              if (prev) setSelectedFilterManager('');
              return !prev;
            })
          }
        >
          Filter By Manager
        </button>
        {showManagerFilter && (
          <select
            value={selectedFilterManager}
            onChange={(e) => {
              console.log('Manager Filter Changed To:', e.target.value);
              setSelectedFilterManager(e.target.value);
            }}
          >
            <option value="">All Managers</option>
            {uniqueManagers.map((manager, index) => (
              <option key={index} value={manager}>
                {manager}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Display Message If No Assignments Match The Current View */}
      {filteredAssignments.length === 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {viewCompleted
            ? 'No Completed Assignments Found.'
            : 'No Pending Assignments Found.'}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Manager</th>
            <th>Team Member</th>
            <th>Quarter Title</th>
            <th>Active Dates</th>
            {viewCompleted && <th>Completion</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((group) => (
            <tr key={group.key}>
              <td>{group.company_name}</td>
              <td>
                {editingKey === group.key ? (
                  <select
                    value={editValues.new_manager_id}
                    onChange={(e) =>
                      setEditValues({ ...editValues, new_manager_id: e.target.value })
                    }
                  >
                    {assignedUsers
                      .filter((u) => u.company === group.company_name && u.role === 'manager')
                      .map((mgr) => (
                        <option key={mgr.id} value={mgr.id}>
                          {mgr.username}
                        </option>
                      ))}
                  </select>
                ) : (
                  group.manager
                )}
              </td>
              <td>
                {editingKey === group.key ? (
                  <select
                    value={editValues.new_team_member_id}
                    onChange={(e) =>
                      setEditValues({ ...editValues, new_team_member_id: e.target.value })
                    }
                  >
                    {assignedUsers
                      .filter(
                        (u) =>
                          Number(u.manager_assigned) === Number(group.manager_id) &&
                          u.company === group.company_name
                      )
                      .map((tm) => (
                        <option key={tm.id} value={tm.id}>
                          {tm.username}
                        </option>
                      ))}
                  </select>
                ) : (
                  group.team_member
                )}
              </td>
              <td>{group.quarter_title}</td>
              <td>
                {editingKey === group.key ? (
                  <input
                    type="date"
                    value={editValues.new_active_date_start}
                    onChange={(e) =>
                      setEditValues({ ...editValues, new_active_date_start: e.target.value })
                    }
                  />
                ) : (
                  group.active_dates
                )}
              </td>
              {viewCompleted && (
                <td style={{ color: group.is_completed ? 'green' : 'red' }}>
                  {group.is_completed ? 'Completed' : 'Incomplete'}
                </td>
              )}
              <td>
                {editingKey === group.key ? (
                  <>
                    <button onClick={() => handleUpdate(group)}>Update</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(group)}>Edit</button>
                    <button onClick={() => handleDelete(group)}>Delete</button>
                    {viewCompleted ? (
                      <button onClick={() => handleMarkComplete(group, false)}>
                        Mark As Not Completed
                      </button>
                    ) : (
                      <button onClick={() => handleMarkComplete(group, true)}>
                        Assignment Completed
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPairList;