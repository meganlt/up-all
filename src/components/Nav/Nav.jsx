import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';
import Manager from './Manager/Manager';

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
          // <li>manager links</li>
          <Manager/>
        ) : user.id && user.role === "associate" ? (
          <li>non-manager links</li>
        ) : user.id && user.role === "admin" ? (
          <li>admin links</li>
        ) : (
          <li>in limbo links</li>
        )
      }
      {/* Show these links regardless of auth status: */}
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
}


export default Nav;
