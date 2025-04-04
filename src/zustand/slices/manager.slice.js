import axios from 'axios';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;


const createManagerSlice = (set, get) => ({
  teamMembers: [],
  dashboardContent: [],
//   fetchDashboardContent: async (managerId) => {
//     if (!managerId) {
//       console.warn('fetchDashboardContent was called with an undefined managerId');
//       return;
//     }

//     try {
//       const { data } = await axios.get(`/api/dashboard/manager/${managerId}`);
//       console.log(data);
//       set({ dashboardContent: data });
//     } catch (err) {
//       console.error('fetchDashboardContent error:', err);
//       set({ dashboardContent: {} }); // Use an empty array if expecting a list
//     }
//   }
fetchDashboardContent: function(managerId){
    axios.get(`/api/dashboard/manager/${managerId}`).then( function(results){
        console.log(results.data);
        set( {dashboardContent: results.data} );
    }).catch( function(err){
        console.log(err);
    })
}
})

export default createManagerSlice;