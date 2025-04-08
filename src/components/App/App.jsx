import { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import useStore from '../../zustand/store';
// Define a custom theme for Material UI
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const theme = createTheme({
  typography: {
    fontFamily: "'Quicksand', Arial, sans-serif",
    fontSize: 16
  },
  palette: {
    primary: {
      main: 'rgb(28, 164, 198)'
    },
    secondary: {
      main: '#CEB324'
    },
    info: {
      main: 'rgba(99, 55, 97, 1)'
    },
    background: {
      paper: 'white',
      default: 'rgba(99, 55, 97, 0.125)'
    },
    text: {
      primary: 'rgba(99, 55, 97, 1)'
    }
  },
  components:{
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          fontSize: '1.14rem',
          textTransform: 'capitalize'
        },
        contained: {
          color: 'white'
        }
      }
    }
  }
});
import Nav from '../Nav/Nav';
import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import PendingPage from '../PendingPage/PendingPage';
import UserAccountPage from '../UserAccountPage/UserAccountPage';
// Admin Includes
import AdminManageUsers from '../AdminManageUsers/AdminManagerUsers';
import WeeklyContent from '../WeeklyContent/WeeklyContent';
// Manager Includes
import ManagerDashboard from '../ManagerDashboard/ManagerDashboard';
// Associate Includes
import AssociateDashboard from '../AssociateDashboard/AssociateDashboard';
import AdminPairAssignments from '../AdminPairAssignments/AdminPairAssignments';

function App() {
  const user = useStore((state) => state.user);
  const isLoading = useStore((state)=>state.isUserLoading);
  const fetchUser = useStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading){
    return <p>Loading...</p>
  }

  return (
    <><ThemeProvider theme={theme}>
      <CssBaseline />
      <header>
        <img className="header-logo" src="../../../public/UpAll_Logo.svg"/>
        <Nav />
      </header>
      <main>
        <Routes>
          <Route 
            exact path="/"
            element={
              user.id && user.role == "admin" ? (
                <Navigate to="/admin-manage-users" replace /> // Redirect authenticated ADMIN
              ) : 
              user.id && user.role == "manager" ?
              (
                <Navigate to="/manager-dashboard" replace /> // Redirect authenticated MANAGER.
              ) : 
              user.id && user.role == "associate" ? (
                <Navigate to="/associate-dashboard" replace /> // Redirect authenticated ASSOCIATE
              ) : 
              user.id && user.role == "pending" ? (
                <PendingPage/> // Render HomePage for authenticated user without role assigned
              ) :
              (
                <Navigate to="/login" replace /> // Redirect unauthenticated user.
              )
            }
          />
          <Route 
            exact path="/login"
            element={
              user.id ? (
                <Navigate to="/" replace /> // Redirect authenticated user.
              ) : (
                <LoginPage /> // Render LoginPage for unauthenticated user.
              )
            }
          />
          <Route 
            exact path="/registration"
            element={
              user.id ? (
                <Navigate to="/" replace /> // Redirect authenticated user.
              ) : (
                <RegisterPage /> // Render RegisterPage for unauthenticated user.
              )
            }
          />
          <Route 
            exact path="/admin-manage-users"
            element={
              user.id && user.role == "admin" ? (
                <AdminManageUsers/> // Redirect authenticated user.
              ) : (
                <Navigate to="/" replace /> // Render LoginPage for unauthenticated user.
              )
            }
          />
          <Route 
            exact path="/manager-dashboard"
            element={
              user.id && user.role=="manager"? (
                <ManagerDashboard/> // Redirect authenticated user.
              ) : (
                <Navigate to="/" replace /> // Render LoginPage for unauthenticated user.
              )
            }
          />

          <Route
          exact path="/associate-dashboard"
          element={
            user.id ? (
              <AssociateDashboard/>  // Redirect authenticated user.
            ):(
              <Navigate to="/" replace /> // Render LoginPage for unauthenticated user.
            )
          }
          />
          <Route
          exact path="/pending-role"
          element={
            user.id ? (
              <PendingPage/>  // Redirect authenticated user.
            ):(
              <LoginPage /> // Render LoginPage for unauthenticated user.
            )
          }
          />
            <Route 
            exact path="/admin-manage-weekly-content"
            element={
              user.id && user.role == "admin" ? (
                <WeeklyContent/> // Redirect authenticated user.
              ) : (
                <Navigate to="/" replace /> // Render LoginPage for unauthenticated user.
              )
            }
          />
          <Route 
            exact path="/admin-pair-assignments"
            element={
              user.id && user.role == "admin" ? (
                <AdminPairAssignments/> // Redirect authenticated user.
              ) : (
                <Navigate to="/" replace /> // Render LoginPage for unauthenticated user.
              )
            }
          />
          

<Route
          exact path="/my-account"
          element={
            user.id ? (
              <UserAccountPage/>  // Redirect authenticated user.
            ):(
              <LoginPage /> // Render LoginPage for unauthenticated user.
            )
          }
          />
          

          {/* <Route 
            exact path="/about"
            element={
              <>
                <h2>About Page</h2>
                <p>
                  Intelligence doesn’t seem like an aspect of personal character, and it isn’t.
                  Coincidentally, great intelligence is only loosely connected to being a good programmer.
                </p>
                <p>
                  What? You don’t have to be superintelligent?
                </p>
                <p>
                  No, you don’t. Nobody is really smart enough to program computers.
                  Fully understanding an average program requires an almost limitless capacity
                  to absorb details and an equal capacity to comprehend them all at the same time.
                  The way you focus your intelligence is more important than how much intelligence you have…
                </p>
                <p>
                  …most of programming is an attempt to compensate for the strictly limited size of our skulls.
                  The people who are the best programmers are the people who realize how small their brains are.
                  They are humble. The people who are the worst at programming are the people who refuse to
                  accept the fact that their brains aren’t equal to the task.
                  Their egos keep them from being great programmers.
                  The more you learn to compensate for your small brain, the better a programmer you’ll be.
                  <span className="squiggle"> The more humble you are, the faster you’ll improve.</span>
                </p>
                <p>
                  --From Steve McConnell's <em>Code Complete</em>.
                </p>
              </>
            }
          /> */}
          <Route
            path="*"
            element={
              <h2>404 Page</h2>
            } 
          />
        </Routes>
      </main>
      <footer>
        <p>Copyright © {new Date().getFullYear()}</p>
      </footer>
      </ThemeProvider>
    </>
  );
}


export default App;
