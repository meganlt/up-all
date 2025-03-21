import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';


function UserAccountPage() {
  const user = useStore((state) => state.user);

  return (
    <>
      <h1>UserAccountPage</h1>
      <h2>Hi, {user.username}!</h2>
      <h3>Update your account information here.</h3>
      <form>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        placeholder="First Name"
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        placeholder="Last Name"
        />
      <label htmlFor="pronouns">Pronouns</label>
      <input
        type="text"
        id="pronouns"
        name="pronouns"
        placeholder="Pronouns"
        />
      <label htmlFor="jobTitle">Job Title</label>
      <input
        type="text"
        id="jobTitle"
        name="jobTitle"
        placeholder="Job Title"
        />
      <label htmlFor="updateEmail">Update Email</label>
      <input
        type="text"
        id="updateEmail"
        name="updateEmail"
        placeholder="Email Address"
        />
      <label htmlFor="changePassword">Change Password</label>
      <input
        type="text"
        id="changePassword"
        name="changePassword"
        placeholder="New Password"
        />
      <button type="submit">
          Update Account Information 
        </button>
      </form>
    </>
  );
}


export default UserAccountPage;