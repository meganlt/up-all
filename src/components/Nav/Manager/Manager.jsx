import { NavLink } from "react-router-dom";
import useStore from "../../../../zustand/store";

function Manager() {
    const user = useStore((store) => store.user);
    
    return (
        <nav>
        <ul>
            {user.id && (
            <>
                <li>
                <NavLink to="/manager">Manager</NavLink>
                </li>
                <li>
                <NavLink to="/manager/dashboard">My Dashboard</NavLink>
                </li>
            </>
            )}
        </ul>
        </nav>
    );
}

export default Manager;