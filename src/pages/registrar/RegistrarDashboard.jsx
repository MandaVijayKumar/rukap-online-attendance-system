import React,{useEffect,useState} from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import RegistrarSidebar from "../../components/RegistrarSidebar";
import "./RegistrarLayout.css";

import RegistrarLiveClasses from "./RegistrarLiveClasses";
import RegistrarStudents from "./RegistrarStudents";
import RegistrarDepartments from "./RegistrarDepartments";
import RegistrarFaculty from "./RegistrarFaculty";
import RegistrarSubjectSummary from "./RegistrarSubjectSummary";

function RegistrarDashboard(){

const token = localStorage.getItem("token");

const [activeTab,setActiveTab] = useState("dashboard");

const [data,setData] = useState({
colleges:0,
departments:0,
courses:0,
faculty:0,
students:0,
present:0,
absent:0
});

/* LOAD DASHBOARD */

useEffect(()=>{
if(activeTab==="dashboard"){
axios.get("https://rukap.edu.in/attendance-api/registrar-dashboard-summary",{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setData(res.data))
.catch(()=>alert("Error loading dashboard"));
}
},[activeTab,token]);

/* RENDER */

const renderContent = ()=>{

switch(activeTab){

case "dashboard":
return(
<div>

{/* ===== HEADER ===== */}
<div style={{
marginBottom:"20px"
}}>
<h2 style={{marginBottom:"5px"}}>Registrar Dashboard</h2>
<p style={{color:"#666"}}>
University Overview & Monitoring
</p>
</div>

{/* ===== CARDS ===== */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"20px"
}}>

<Card title="Total Colleges" value={data.colleges} color="#1e88e5"/>
<Card title="Departments" value={data.departments} color="#43a047"/>
<Card title="Courses" value={data.courses} color="#fb8c00"/>
<Card title="Faculty" value={data.faculty} color="#8e24aa"/>
<Card title="Students" value={data.students} color="#e53935"/>

</div>

{/* ===== LIVE CLASSES ===== */}

<div style={{marginTop:"30px"}}>
<SectionTitle title="Today's Live Classes"/>
<RegistrarLiveClasses/>
</div>

{/* ===== SUBJECT SUMMARY ===== */}

<div style={{marginTop:"30px"}}>
<SectionTitle title="Subject Overview"/>
<RegistrarSubjectSummary/>
</div>

</div>
);

case "subject-summary":
return <RegistrarSubjectSummary/>;

case "departments":
return <RegistrarDepartments/>;

case "faculty":
return <RegistrarFaculty/>;

case "students":
return <RegistrarStudents/>;

case "attendance":
return <RegistrarLiveClasses/>;

default:
return null;
}
};

return(
<>
<Navbar/>

<div className="reg-layout-wrapper">

<RegistrarSidebar
activeTab={activeTab}
setActiveTab={setActiveTab}
/>

<div className="reg-content">
{renderContent()}
</div>

</div>
</>
);

}

/* ===== CARD ===== */

const Card = ({title,value,color})=>(

<div style={{
background:"#fff",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.08)",
borderLeft:`6px solid ${color}`,
transition:"0.3s"
}}>

<h4 style={{
marginBottom:"10px",
color:"#555"
}}>
{title}
</h4>

<h2 style={{
margin:0,
color:color
}}>
{value}
</h2>

</div>
);

/* ===== SECTION TITLE ===== */

const SectionTitle = ({title})=>(

<div style={{
marginBottom:"10px",
paddingBottom:"5px",
borderBottom:"2px solid #1976d2"
}}>

<h3 style={{
margin:0,
color:"#1976d2"
}}>
{title}
</h3>

</div>
);

export default RegistrarDashboard;