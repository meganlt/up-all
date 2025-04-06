import { useState, useEffect, useMemo } from 'react';
import useStore from '../../zustand/store';
import axios from 'axios';

function AdminPairList() {

    // TODO:
  // Create hook for pair assignments
  const [ pairs, setPairs ] = useState([]);
  const pairAssignments = useStore( (state) => state.pairAssignments);
  const fetchPairAssignments = useStore((state) => state.fetchPairAssignments);
  const [weeks, setWeeks] = useState([]);

  // Get Week Data to find quarter titles:
  // ToDo: consider putting this in the store, as similar usage in AdminNewPairAssignment
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
      weeks.map(w => [w.week, w.quarter_title])
    );
  
    return Object.values(
      pairAssignments.reduce((acc, item) => {
        const key = `${item.manager_id}-${item.team_member_id}`;
  
        if (!acc[key]) {
          acc[key] = {
            company_name: item.company_name,
            manager: item.manager_name,
            team_member: item.team_member_name,
            quarter_title: '', // Placeholder
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
  // Format each group's date range
  const formattedAssignments = groupedAssignments.map(group => {
    const sortedDates = group.active_dates.sort((a, b) => a - b);
    const firstDate = sortedDates[0];
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    lastDate.setDate(lastDate.getDate() + 7); // Add 7 days

    const formatDate = date =>
      `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    return {
      company_name: group.company_name,
      manager: group.manager,
      team_member: group.team_member,
      quarter_title: group.quarter_title, // Fill in from your other table
      active_dates: `${formatDate(firstDate)} - ${formatDate(lastDate)}`
    };
  });

  console.log('formatted:', formattedAssignments);
  console.log('grouped assignments:',groupedAssignments);

  useEffect(() => {
    fetchPairAssignments();
    fetchWeeks();
  }, [])

  return (
    <div className='_template'>
     <h2>All Pair Assignments</h2>
    <button>filter by company</button>
    <button>filter by manager</button>
    <table>
      <thead>
        <tr>
          <th>Company Name:</th>
          <th>Manager:</th>
          <th>Team Member:</th>
          <th>Quarter Title:</th>
          <th>Active Dates:</th>
          {/* <th>Edit</th> */}
        </tr>
      </thead>
      <tbody>
        {
          formattedAssignments.map( (pair, index)=>(
            <tr key={index}>
              <td>{pair.company_name}</td>
              <td>{pair.manager}</td>
              <td>{pair.team_member}</td>
              <td>{pair.quarter_title}</td>
              <td>{pair.active_dates}</td>
              {/* <td></td> */}
            </tr>
          ))
        }
      </tbody>
    </table>
    </div>
  );
}

export default AdminPairList;
