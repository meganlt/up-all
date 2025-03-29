import { NavLink } from "react-router-dom";
import useStore from "../../../zustand/store";
import { Typography, Button } from "@mui/material";

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
            <li>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={logOut}
                    sx={{ mt: 1 }}
                >
                    Log Out
                </Button>
            </li>
        </>
    );
}

export default Manager;