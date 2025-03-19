import { NavLink } from "react-router-dom";
import useStore from "../../../zustand/store";
function Manager() {
    const user = useStore((store) => store.user);
    
    return (
        <>
            <li>
                <NavLink to="/manager-dashboard">My Dashboard</NavLink>
            </li>
            <li>
                <NavLink to="/my-account">Manager {user.first_name}</NavLink>
            </li>
        </>
    );
}

export default Manager;