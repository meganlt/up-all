import { NavLink } from "react-router-dom";
import useStore from "../../../zustand/store";
import { Button } from "@mui/material";

function NavAdmin() {
    const user = useStore((store) => store.user);
    const logOut = useStore((state) => state.logOut);
    
    return (
        <nav>
        <ul>
            {user.id && (
            <>
                <li>
                <NavLink to="/admin-manage-users">Manage Users</NavLink>
                </li>
                <li>
                <NavLink to="/admin-manage-weekly-content">Manage Weekly content</NavLink>
                </li>
                <li>
                <NavLink to="/admin-pair-assignments">Pair Assignments</NavLink>
                </li>
                <li>
                <NavLink to="/my-account">{user.first_name ? user.first_name : user.username}'s Account</NavLink>
                </li>
                <li>
                    <Button variant="outlined" onClick={logOut}>Log Out</Button>
                </li>
            </>
            )}
        </ul>
        </nav>
    );
}
export default NavAdmin;   