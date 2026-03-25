import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./Dashboard.css";

function Dashboard(){

return(

<div className="dashboard">

<Navbar/>

<div className="dashboard-body">

<Sidebar/>

<div className="dashboard-content">

<h2>Dashboard</h2>

<p>Welcome to University Attendance System</p>

</div>

</div>

</div>

)

}

export default Dashboard