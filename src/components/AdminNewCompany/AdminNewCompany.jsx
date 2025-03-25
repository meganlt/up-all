import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

function AdminNewCompany(weeklyContentTitles) {

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function handleStartChange(e){
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // If the current end date is before the new start date, reset it
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  }

  function handleEndChange(e){
    const newEndDate = e.target.value;
    if (newEndDate >= startDate) {
      setEndDate(newEndDate);
    } else {
      alert("End date cannot be earlier than the start date.");
    }
  }

  function addNewCompanyAssignment(e){
    e.preventDefault();
    console.log('in addNewCompanyAssignment');
    // TO DO: Add Axios call to POST new assignment
  }

  return (
    <div className='_template'>
     <h2>Add New Assignent</h2>
     <form onSubmit={addNewCompanyAssignment}>
      <label>Company:</label>
      <input type="text" placeholder="Enter company name"/>
      <label>Weekly Assignment:</label>
      <select>
      {weeklyContentTitles.weeklyContentTitles.map((title, index) => (
        <option key={index} value={title}>
          {title}
        </option>
      ))}
    </select>
      <label>Active Dates:</label>
      <input type="date" value={startDate} onChange={handleStartChange}/> 
      - 
      <input type="date" value={endDate} onChange={handleEndChange}/>
      <button type="submit">Assign Week</button>
     </form>
    </div>
  );
}

export default AdminNewCompany;
