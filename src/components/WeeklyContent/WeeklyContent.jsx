import axios from "axios";
import useStore from "../../zustand/store";
import { useState, useEffect } from "react";

function WeeklyContent() {
  const [week, setWeek] = useState([])

  const fetchWeek = () => {
    console.log('fetching week...')
    axios.get('/api/week')
      .then((response) => {
        console.log('week fetched: ', response.data)
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setWeek(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setWeek([]); // Set to an empty array to avoid errors
        }
      })
      .catch((err) => {
        console.error('ERROR fetching week: ', err)
        alert('ERROR in fetchWeek: ' + err.message)
      })
  }

  // Fetch data when the component mounts
  useEffect(() => {
    fetchWeek();
  }, [])



  return (
    <div className='WeeklyContent'>
     <h1>Weekly Content Library</h1>
     <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Theme</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {week.map((row, index) => (
            <tr key={index}>
              <td>{row.week_number}</td> 
              <td>{row.theme}</td>       
              <td>{row.content}</td>   
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyContent;
