import { NavLink } from "react-router-dom";
import useStore from "../../../../zustand/store";

function Guest() {
    const user = useStore((store) => store.user);
    
    return (
        <nav>
        <ul>
            {user.id && (
            <>
                <li>
                <NavLink to="/guests">Guests</NavLink>
                </li>
                <li>
                <NavLink to="/guests/guest">Guest</NavLink>
                </li>
            </>
            )}
        </ul>
        </nav>
    );
}

export default Guest;