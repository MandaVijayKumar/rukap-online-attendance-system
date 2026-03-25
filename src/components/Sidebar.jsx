import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar(){

return(

<div className="sidebar">

<h3>Menu</h3>

<ul>

<li><Link to="/dashboard">Dashboard</Link></li>
<li><Link to="/students">Students</Link></li>
<li><Link to="/faculty">Faculty</Link></li>
<li><Link to="/subjects">Subjects</Link></li>
<li><Link to="/timetable">Timetable</Link></li>
<li><Link to="/attendance">Attendance</Link></li>

</ul>

</div>

)

}

export default Sidebar