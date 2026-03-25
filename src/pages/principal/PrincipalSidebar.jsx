import React from "react";
import { useNavigate } from "react-router-dom";
import "./PrincipalSidebar.css";

function PrincipalSidebar({setActiveTab}){

const navigate = useNavigate();

const handleLogout = () => {
localStorage.clear();
navigate("/");
};

return(

<div className="principal-sidebar">

<h3 className="principal-title">
Principal Panel
</h3>

<ul className="principal-menu">

<li
className="principal-menu-item"
onClick={()=>setActiveTab("overview")}
>
Dashboard
</li>

<li
className="principal-menu-item"
onClick={()=>setActiveTab("departments")}
>
Departments
</li>

<li
className="principal-menu-item"
onClick={()=>setActiveTab("faculty")}
>
Faculty
</li>

<li
className="principal-menu-item"
onClick={()=>setActiveTab("students")}
>
Students
</li>

<li
className="principal-menu-item logout"
onClick={handleLogout}
>
Logout
</li>

</ul>

</div>

);

}

export default PrincipalSidebar;