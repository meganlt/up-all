import { NavLink } from "react-router-dom";
import useStore from "../../../zustand/store";
import { Typography } from "@mui/material";
function Manager() {
    const user = useStore((store) => store.user);
    const logOut = useStore((state) => state.logOut);

    return (
        <>
            <li>
                <NavLink to="/manager-dashboard">My Dashboard</NavLink>
            </li>
            <li>
                <NavLink to="/my-account">{user.username}'s account</NavLink>
            </li>
            <Typography variant="h6">Log out</Typography>
            <li>
                {/* <button onClick={logOut}>Log Out</button> */}
            </li>
        </>
    );
}

export default Manager;