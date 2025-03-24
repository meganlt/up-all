import { NavLink } from "react-router-dom";
import useStore from "../../../../zustand/store";

function Pending() {
    const user = useStore((store) => store.user);
    
    return (
        <nav>
        <ul>
            {user.id && (
            <>
                <li>
                <NavLink to="/pending-role">Guests</NavLink>
                </li>
                <li>
                <NavLink to="/my-account">{user.username}'s account</NavLink>
                </li>
                <li>
                    <button onClick={logOut}>Log Out</button>
                </li>
                
            </>
            )}
        </ul>
        </nav>
    );
}

export default Pending;