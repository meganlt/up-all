import { useState, useEffect } from 'react';
import useStore from "../../zustand/store";



function AssociateDashboard() {
    const user = useStore((store) => store.user);

    // const { associates } = useStore((state) => ({
    //     associates: state.associates,
    // }));
    
    return (
        <div>
        <h2>Associate</h2>
        <ul>
            {/* {associates.map((associate) => (
            <li key={associate.id}>{associate.name}</li>
            ))} */}
        </ul>
        </div>
    );
}

export default AssociateDashboard;