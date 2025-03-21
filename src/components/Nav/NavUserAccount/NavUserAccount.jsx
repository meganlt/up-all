import { NavLink } from "react-router-dom";
import useStore from "../../../zustand/store";
function UserAccount() {
    const user = useStore((store) => store.user);
    const logOut = useStore((state) => state.logOut);

    return (
        <>
            {/* <li>
                <NavLink to="/what-goes-here?">My Dashboard</NavLink>
            </li> */}
            <li>
                <NavLink to="/my-account">UserAccount {user.first_name}'s account</NavLink>
            </li>
            <li>
                <button onClick={logOut}>Log Out</button>
            </li>
        </>
    );
}

export default UserAccount;