import React from "react";
import {
FaHome,
FaUniversity,
FaBuilding,
FaBook,
FaChalkboardTeacher,
FaUserGraduate,
FaChartBar
} from "react-icons/fa";

function RegistrarSidebar({activeTab,setActiveTab}){

const sidebarStyle = {
width:"240px",
background: '#0b3c5d',
  color: '#fff',
padding:"20px",
minHeight:"calc(100vh - 70px)"
};

const titleStyle = {
textAlign:"center",
marginBottom:"20px",
fontWeight:"bold",
fontSize:"18px"
};

const ulStyle = {
listStyle:"none",
padding:"0"
};

const getItemStyle = (tab) => ({
  display: "flex",
  alignItems: "center",
  padding: "12px",
  cursor: "pointer",
  borderRadius: "8px",
  marginBottom: "10px",
  transition: "0.3s",

  /* ✅ ACTIVE STYLE */
  background: activeTab === tab ? "#22445a" : "transparent",
  color: activeTab === tab ? "#ffffff" : "#cbd5e1",
  fontWeight: activeTab === tab ? "bold" : "normal"
});

const iconStyle = {
marginRight:"10px"
};

return(

<div style={sidebarStyle}>

<h3 style={titleStyle}>Registrar Panel</h3>

<ul style={ulStyle}>

<li
style={getItemStyle("dashboard")}
onClick={()=>setActiveTab("dashboard")}
>
<FaHome style={iconStyle}/> Dashboard
</li>

<li
style={getItemStyle("colleges")}
onClick={()=>setActiveTab("subject-summary")}
>
<FaBook style={iconStyle}/> Subjects
</li>

<li
style={getItemStyle("departments")}
onClick={()=>setActiveTab("departments")}
>
<FaBuilding style={iconStyle}/> Departments
</li>

{/* <li
style={getItemStyle("courses")}
onClick={()=>setActiveTab("courses")}
>
<FaBook style={iconStyle}/> Courses
</li> */}

<li
style={getItemStyle("faculty")}
onClick={()=>setActiveTab("faculty")}
>
<FaChalkboardTeacher style={iconStyle}/> Faculty
</li>

<li
style={getItemStyle("students")}
onClick={()=>setActiveTab("students")}
>
<FaUserGraduate style={iconStyle}/> Students
</li>

<li
style={getItemStyle("attendance")}
onClick={()=>setActiveTab("attendance")}
>
<FaChartBar style={iconStyle}/> Attendance
</li>

</ul>

</div>

);

}

export default RegistrarSidebar;