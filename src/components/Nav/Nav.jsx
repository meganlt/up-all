import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';
import Admin from './NavAdmin/NavAdmin';
import Manager from './NavManager/NavManager';
import Associate from './NavAssociate/NavAssociate';
import NavUserAccount from './NavUserAccount/NavUserAccount';
import NavPending from './NavPending/NavPending';

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
        ) : user.id && user.role === "pending" ? (
          <NavPending />
        ) : user.id && (
          <li>in limbo links</li>
        )
      }
      </ul>
    </nav>
  );
}


export default Nav;
