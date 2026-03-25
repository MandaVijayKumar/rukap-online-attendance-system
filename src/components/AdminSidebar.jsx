import React from "react";
import "./AdminSidebar.css"; // 🔥 use separate CSS file

function AdminSidebar({setActiveTab}){

return(

<div className="admin-sidebar">

<h3 className="admin-sidebar-title">
Admin Panel
</h3>

<ul className="admin-sidebar-menu">

<li
className="admin-sidebar-item"
onClick={()=>setActiveTab("dashboard")}
>
Dashboard
</li>

<li
className="admin-sidebar-item"
onClick={()=>setActiveTab("createFacultyUser")}
>
Create Faculty Login
</li>
<li
className="admin-sidebar-item"
onClick={()=>setActiveTab("createUser")}
>
Create User
</li>

<li
className="admin-sidebar-item"
onClick={()=>setActiveTab("viewFacultyUsers")}
>
View Faculty Users
</li>

</ul>

</div>

);

}

export default AdminSidebar;