import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../../zustand/store';

function UserAccountPage() {
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);
  // const [user, setUser] = useState(null);
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [pronouns, setPronouns] = useState(user.pronouns);
  const [job_title, setJobTitle] = useState(user.job_title);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  // console.log(user);

  useEffect(() => {
    // const fetchUserData = async () => {
    //   try {
    //     const response = await axios.get('/api/user');
    //     if (response.data) {
    //       setUser(response.data);
    //       setFirstName(response.data.first_name || '');
    //       setLastName(response.data.last_name || '');
    //       setPronouns(response.data.pronouns || '');
    //       setJobTitle(response.data.job_title || '');
    //       setEmail(response.data.email || '');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //     alert('Failed to load user data.');
    //   }
    // };
    
    // fetchUserData();
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      first_name,
      last_name,
      pronouns,
      job_title,
      email,
    };


    if (password) {
      updatedData.password = password;
    }

    console.log('Updated data:', updatedData);

    try {
      await axios.put('/api/user/update', updatedData, { withCredentials: true });
      alert('Account updated successfully!');
      setPassword(''); 
      fetchUser();
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Failed to update account. Please try again later.');
    }
  };

 

  return (
    <>
      <h1>User Account Page</h1>
      <h2>Hi, {user.username}!</h2>
      <h3>Update your account information here.</h3>

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="first_name"
          placeholder={user.first_name}
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="last_name"
          placeholder={user.last_name}
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="pronouns">Pronouns</label>
        <input
          type="text"
          id="pronouns"
          name="pronouns"
          placeholder={user.pronouns}
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value)}
        />

        <label htmlFor="jobTitle">Job Title</label>
        <input
          type="text"
          id="jobTitle"
          name="job_title"
          placeholder={user.job_title}
          value={job_title}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder={user.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">New Password (optional)</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Update Account Information</button>
      </form>
    </>
  );
}

export default UserAccountPage;