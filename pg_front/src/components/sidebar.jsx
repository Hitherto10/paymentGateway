import React from 'react';

function Sidebar() {
    return (
        <>
            <div className={`w-3xs bg-gray-500 ms-0 space-x-4 flex-col flex z-10 h-screen fixed top-0 left-0 transition-transform duration-300 ease-in-out`}>
                <div className={`p-5`}>
                    <h2> Dashboard Name</h2>
                </div>
                <div>
                    <ul className={`list-none p-0 m-0`}>
                        <li className={`p-3 hover:bg-gray-600 cursor-pointer`}>Dashboard</li>
                        <li className={`p-3 hover:bg-gray-600 cursor-pointer`}>Settings</li>
                        <li className={`p-3 hover:bg-gray-600 cursor-pointer`}>Profile</li>
                    </ul>
                </div>
                <div>
                    <button className={`p-3 hover:bg-gray-600 cursor-pointer`}>Logout</button>

                </div>
            </div>
        </>
    )
}




export default Sidebar;