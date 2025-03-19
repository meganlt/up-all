import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';
import Admin from './Admin/Admin';
import Manager from './Manager/Manager';
import Associate from './Associate/Associate';

function Nav() {
  const user = useStore((store) => store.user);

  return (
    <nav>
      <ul>
      { // User is not logged in, render these links:
        !user.id && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/registration">Register</NavLink>
            </li>
          </>
        )
      }
      { // User is logged in, render these links:
        user.id && user.role === "manager" ? (
          // Manager Links:
          <Manager/>
        ) : user.id && user.role === "associate" ? (
          // Associate Links:
          <Associate/>
        ) : user.id && user.role === "admin" ? (
          <Admin/>
        ) : user.id && (
          <li>in limbo links</li>
        )
      }
      </ul>
    </nav>
  );
}


export default Nav;
