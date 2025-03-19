import { NavLink } from "react-router-dom";
import useStore from "../../../zustand/store";

function Admin() {
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
export default Admin;   