import axios from 'axios';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;


const createAdminSlice = (set, get) => ({
  assignedUsers: [],
  pendingUsers: [],
  fetchAssignedUsers: async () => {
    //  retreive all assigned users
    try {
      const { data } = await axios.get('/api/admin/users');
      set({ assignedUsers: data });
    } catch (err) {
      console.log('fetchUser error:', err);
      set({assignedUsers : {}});
    }
  },
  fetchPendingUsers: async () => {
    //  retreive all assigned users
    try {
      const { data } = await axios.get('/api/admin/pending');
      set({ pendingUsers: data });
    } catch (err) {
      console.log('fetchUser error:', err);
      set({pendingUsers : {}});
    }
  }
})

export default createAdminSlice;
