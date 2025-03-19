import { NavLink } from "react-router-dom";
import useStore from "../../../../zustand/store";

function Associate() {
    const user = useStore((store) => store.user);
    
    return (
        <nav>
        <ul>
            {user.id && (
            <>
                <li>
                <NavLink to="/associate">Associate</NavLink>
                </li>
                <li>
                <NavLink to="/associate/dashboard">My Dashboard</NavLink>
                </li>
            </>
            )}
        </ul>
        </nav>
    );
}
export default Associate;