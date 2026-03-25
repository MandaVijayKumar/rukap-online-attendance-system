import React, { useState } from "react";
import PrincipalSidebar from "./PrincipalSidebar";
import PrincipalOverview from "./tabs/PrincipalOverview";
import PrincipalDepartments from "./tabs/PrincipalDepartments";
import PrincipalFaculty from "./tabs/PrincipalFaculty";
import PrincipalStudents from "./tabs/PrincipalStudents";
import PrincipalAttendance from "./tabs/PrincipalAttendance";
import Navbar from "../../components/Navbar";

function PrincipalDashboard(){

const [activeTab,setActiveTab] = useState("overview");

const renderContent = () => {

switch(activeTab){

case "overview":
return <PrincipalOverview/>;

case "departments":
return <PrincipalDepartments/>;

case "faculty":
return <PrincipalFaculty/>;

case "students":
return <PrincipalStudents/>;

case "attendance":
return <PrincipalAttendance/>;

default:
return <PrincipalOverview/>;

}

};

return(
<>
<Navbar/>
<div style={{display:"flex"}}>

<PrincipalSidebar setActiveTab={setActiveTab}/>

<div style={{
flex:1,
padding:"20px",
background:"#f5f6fa",
minHeight:"100vh"
}}>

{renderContent()}

</div>

</div>
</>
);

}

export default PrincipalDashboard;