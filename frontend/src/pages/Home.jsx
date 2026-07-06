import React from "react";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import useGetOtherUsers from "../customHooks/useGetOtherUsers";

function Home() {
    // Fetch active users when Home mounts
    useGetOtherUsers();

    return (
        <div className="h-screen flex bg-slate-100 overflow-hidden">
            <Sidebar />
            <MessageArea />
        </div>
    );
}

export default Home;