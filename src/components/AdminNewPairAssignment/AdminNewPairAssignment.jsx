import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

function AdminNewPairAssignment() {

  const [ quarters, setQuarters ] = useState( [] );
  const [ users, setUsers ] = useState( [] );
  const [ companies, setCompanies ] = useState( [] );
  const [ managers, setManagers ] = useState( [] );
  const [ teamMembers, setTeamMembers ] = useState( [] );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function fetchQuarters(){
    console.log('in fetchQuarters');
    // TO DO: 
    // Axios GET call to get all available titles for each week,
    // then, look through them, and put the titles into the array like this:
    setQuarters(['Meaningful Feedback', 'Effective Meetings']);
    
  }



  function fetchUsers(){
    console.log('in fetchUsers');

    // axios fetch user data

    // loop through and find all companies

    // set users

    // TEMPORARY DATA FOR STATIC
    setUsers([
      {
        userId: 2,
        username: 'marks',
        manager_assigned: '',
        manager_id: 1,
        company: 'lumon'
      },
      {
        userId: 5,
        username: 'hellyr',
        manager_assigned: 'marks',
        manager_id: 2,
        company: 'lumon'
      }
    ]);

    findCompanies();
  }

  function findCompanies(){
    // create a new array of all company names
    // setCompanies to new array
  }

  function findManagersForCompany(){
    // create a new array of managers from selected company 
    // setManagers to new array

  }

  function handleStartChange(e){
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // Calculate end date to be 12 weeks after start date:
    // Set End date to calculated date
  }

  function addNewPairAssignment(e){
    e.preventDefault();
    console.log('in addNewCompanyAssignment');
    // TO DO: Add Axios call to POST new assignment

  }

  useEffect(() => {
    fetchUsers();
    fetchQuarters();
  }, [])

  return (
    <div className='_template'>
     <h2>Add New Assignent</h2>
     <form onSubmit={addNewPairAssignment}>
      <label>Company:</label>
      <select onChange={findManagersForCompany}>
        <option>Select Company Name</option>
      </select>
      <label>Manager:</label>
      <select>
        <option>Select Manager Name</option>
      </select>
      <label>Team Member:</label>
      <select>
        <option>Select Team Member</option>
      </select>
      <label>Quarter Title:</label>
      <select>
        {quarters.map((title, index) => (
          <option key={index} value={title}>
            {title}
          </option>
        ))}
      </select>
    

      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={handleStartChange}/> 
      <button type="submit">Assign Week</button>
     </form>
    </div>
  );
}

export default AdminNewPairAssignment;
