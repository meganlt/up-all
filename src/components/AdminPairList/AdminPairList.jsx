import { useState, useEffect, useMemo } from 'react';
import useStore from '../../zustand/store';
import axios from 'axios';
import {
  Select, MenuItem, FormControl, InputLabel, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button
} from '@mui/material';

function AdminPairList() {
  const pairAssignments = useStore((state) => state.pairAssignments);
  const fetchPairAssignments = useStore((state) => state.fetchPairAssignments);
  const [weeks, setWeeks] = useState([]);

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

  const groupedAssignments = useMemo(() => {
    if (!pairAssignments.length || !weeks.length) return [];

    const weekToQuarter = new Map(
      weeks.map(w => [w.id, w.quarter_title])
    );

    return Object.values(
      pairAssignments.reduce((acc, item) => {
        const key = `${item.manager_id}-${item.team_member_id}`;

        if (!acc[key]) {
          acc[key] = {
            company_name: item.company_name,
            manager: item.manager_name,
            manager_id: item.manager_id,
            team_member: item.team_member_name,
            team_member_id: item.team_member_id,
            quarter_title: '',
            active_dates: [],
          };
        }

        if (!acc[key].quarter_title) {
          const qt = weekToQuarter.get(item.dashboard_week_id);
          if (qt) {
            acc[key].quarter_title = qt;
          }
        }

        acc[key].active_dates.push(new Date(item.active_date_start));
        return acc;
      }, {})
    );
  }, [pairAssignments, weeks]);

  const formattedAssignments = groupedAssignments.map(group => {
    const sortedDates = group.active_dates.sort((a, b) => a - b);
    const firstDate = sortedDates[0];
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    lastDate.setDate(lastDate.getDate() + 7);

    const formatDate = date =>
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    return {
      company_name: group.company_name,
      manager: group.manager,
      manager_id: group.manager_id,
      team_member: group.team_member,
      team_member_id: group.team_member_id,
      quarter_title: group.quarter_title,
      active_dates: `${formatDate(firstDate)} - ${formatDate(lastDate)}`
    };
  });

  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const companies = [...new Set(formattedAssignments.map((row) => row.company_name))];
  const managers = [...new Set(formattedAssignments.map((row) => row.manager))];

  const filteredRows = formattedAssignments.filter((row) => {
    return (
      (selectedCompany === '' || row.company_name === selectedCompany) &&
      (selectedManager === '' || row.manager === selectedManager)
    );
  });

  function handleDelete(pair) {
    if (!window.confirm(`Are you sure you want to delete this assignment for ${pair.team_member || "Manager Only"}?`)) return;

    axios.post('/api/assignments/bulk-delete', {
      manager_id: pair.manager_id,
      team_member_id: pair.team_member_id,
      quarter_title: pair.quarter_title
    })
    .then(() => {
      alert('Assignment deleted!');
      fetchPairAssignments();
    })
    .catch((err) => {
      console.error('Error deleting pair:', err);
      alert('Failed to delete assignment.');
    });
  }

  useEffect(() => {
    fetchPairAssignments();
    fetchWeeks();
  }, [])

  return (
    <div className='admin-pair-list'>
      <h2>All Pair Assignments</h2>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Company</InputLabel>
            <Select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              label="Filter by Company"
            >
              <MenuItem value="">All Companies</MenuItem>
              {companies.map((company, i) => (
                <MenuItem key={i} value={company}>{company}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Manager</InputLabel>
            <Select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              label="Filter by Manager"
            >
              <MenuItem value="">All Managers</MenuItem>
              {managers.map((manager, i) => (
                <MenuItem key={i} value={manager}>{manager}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Team Member</TableCell>
                <TableCell>Quarter Title</TableCell>
                <TableCell>Active Dates</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((pair, index) => (
                <TableRow key={index}>
                  <TableCell>{pair.company_name}</TableCell>
                  <TableCell>{pair.manager}</TableCell>
                  <TableCell>{pair.team_member}</TableCell>
                  <TableCell>{pair.quarter_title}</TableCell>
                  <TableCell>{pair.active_dates}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(pair)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No results</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default AdminPairList;