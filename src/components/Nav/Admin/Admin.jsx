import { NavLink } from "react-router-dom";
import useStore from "../../../../zustand/store";

function Admin() {
    const user = useStore((store) => store.user);
    
    return (
        <nav>
        <ul>
            {user.id && (
            <>
                <li>
                <NavLink to="/admin">Admin</NavLink>
                </li>
                <li>
                <NavLink to="/admin/dashboard">My Dashboard</NavLink>
                </li>
                <li>
                <NavLink to="/admin/users">Manager users</NavLink>
                </li>
                <li>
                <NavLink to="/admin/weekly">Weekly content</NavLink>
                </li>
            </>
            )}
        </ul>
        </nav>
    );
}
export default Admin;   