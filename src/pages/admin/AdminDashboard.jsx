import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import CreateFacultyUser from "./CreateFacultyUser";

import "../../components/Sidebar.css";
import "./AdminDashboard.css";
import Navbar from "../../components/Navbar";
import CreateUser from "./CreateUser";

function AdminDashboard(){

const [activeTab,setActiveTab] = useState("dashboard");

const renderContent = () => {

switch(activeTab){

case "dashboard":
return <h3>Welcome Admin</h3>;

case "createFacultyUser":
return <CreateFacultyUser/>;
case "createUser":
return <CreateUser/>;

default:
return <h3>Welcome Admin</h3>;

}

};

return(
<>
<Navbar/>
<div className="dashboard-layout">

<AdminSidebar setActiveTab={setActiveTab}/>

<div className="dashboard-content">

{renderContent()}

</div>

</div>
</>
);

}

export default AdminDashboard;