import { NavLink } from "react-router-dom";
import useStore from "../../../zustand/store";
import { Button } from "@mui/material";

function NavPending() {
    const user = useStore((store) => store.user);
    const logOut = useStore((state) => state.logOut);
    
    return (
        <nav>
        <ul>
            {user.id && (
            <>
                <li>
                <NavLink to="/pending-role">Guests</NavLink>
                </li>
                <li>
                <NavLink to="/my-account">{user.first_name ? user.first_name : user.username}'s account</NavLink>
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

export default NavPending;