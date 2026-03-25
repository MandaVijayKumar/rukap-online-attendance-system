import React,{useEffect,useState} from "react";
import axios from "axios";
// import {
// BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid
// } from "recharts";
import PrincipalAttendance from "./PrincipalAttendance";

function PrincipalOverview(){

const token = localStorage.getItem("token");
const college_id = localStorage.getItem("college_id");

const [stats,setStats] = useState({});
const [courseData,setCourseData] = useState([]);
const [deptData,setDeptData] = useState([]);
const [periodData,setPeriodData] = useState([]);

// useEffect(()=>{

// axios.get(`http://localhost:5000/principal-overview/${college_id}`,{
// headers:{Authorization:`Bearer ${token}`}
// }).then(res=>setStats(res.data));

// axios.get(`http://localhost:5000/principal-course-attendance/${college_id}`,{
// headers:{Authorization:`Bearer ${token}`}
// }).then(res=>setCourseData(res.data));

// axios.get(`http://localhost:5000/principal-dept-attendance/${college_id}`,{
// headers:{Authorization:`Bearer ${token}`}
// }).then(res=>setDeptData(res.data));

// axios.get(`http://localhost:5000/principal-period-progress/${college_id}`,{
// headers:{Authorization:`Bearer ${token}`}
// }).then(res=>setPeriodData(res.data));

// },[]);

return(

<div>
Principal Dashboard
<h2>Today Live Dashboard</h2>

{/* STAT CARDS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginBottom:"30px"
}}>
<PrincipalAttendance/>
{/* <Card title="Departments" value={stats.departments}/>
<Card title="Faculty" value={stats.faculty}/>
<Card title="Students" value={stats.students}/>
<Card title="Subjects" value={stats.subjects}/>

<Card title="Total Classes Today" value={stats.total_classes}/>
<Card title="Students Present" value={stats.total_present}/>
<Card title="Students Absent" value={stats.total_absent}/>
<Card title="Attendance %" value={`${stats.attendance_percentage}%`}/> */}

</div>

{/* COURSE CHART */}

{/* <h3>Course Wise Attendance</h3>

<ResponsiveContainer width="100%" height={300}>
<BarChart data={courseData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="course_name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="present"/>
<Bar dataKey="absent"/>
</BarChart>
</ResponsiveContainer> */}


{/* DEPARTMENT CHART */}

{/* <h3>Department Wise Attendance</h3>

<ResponsiveContainer width="100%" height={300}>
<BarChart data={deptData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="dept_name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="present"/>
<Bar dataKey="absent"/>
</BarChart>
</ResponsiveContainer> */}


{/* PERIOD PROGRESS */}

{/* <h3>Period Progress</h3>

<ResponsiveContainer width="100%" height={300}>
<BarChart data={periodData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="period"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="total_records"/>
</BarChart>
</ResponsiveContainer> */}

</div>

);

}

function Card({title,value}){

return(

<div style={{
background:"white",
padding:"20px",
borderRadius:"8px",
boxShadow:"0 2px 6px rgba(0,0,0,0.2)"
}}>

<h4>{title}</h4>
<h2>{value || 0}</h2>

</div>

);

}

export default PrincipalOverview;