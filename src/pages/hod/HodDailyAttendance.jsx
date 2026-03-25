import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function HodDailyAttendance(){

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");

const [courses,setCourses] = useState([]);
const [records,setRecords] = useState([]);

const [deptName,setDeptName] = useState("");
const [collegeName,setCollegeName] = useState("");

const [academicYears,setAcademicYears] = useState([]);

const [filters,setFilters] = useState({
course_id:"",
course_type:"",
semester:"",
academic_year:"",
section:"ALL",
attendance_date:""
});


/* =========================
   LOAD COURSES
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/courses/${dept_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setCourses(res.data))
.catch(()=>alert("Error loading courses"));

},[dept_id]);


/* =========================
   LOAD DEPARTMENT DETAILS
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/department-details/${dept_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
setDeptName(res.data.dept_name);
setCollegeName(res.data.college_name);
})
.catch(()=>alert("Error loading department details"));

},[dept_id]);


/* =========================
   HANDLE INPUT CHANGE
========================= */

const handleChange = (e)=>{

const {name,value} = e.target;

let updated = {...filters,[name]:value};

if(name === "course_type"){

let duration = 0;

if(value === "UG") duration = 3;
if(value === "PG") duration = 2;
if(value === "BTech") duration = 4;
if(value === "MTech") duration = 2;
if(value === "PhD") duration = 5;

const startYears = [2024,2025,2026,2027,2028,2029];

let years = startYears.map(start=>{
return `${start}-${start + duration}`;
});

setAcademicYears(years);
}

setFilters(updated);
};


/* =========================
   LOAD ATTENDANCE
========================= */

const loadAttendance = ()=>{

if(!filters.course_id || !filters.semester || !filters.academic_year || !filters.attendance_date){

alert("Please select all filters");
return;

}

axios.get("https://rukap.edu.in/attendance-api/hod-daily-attendance",{
params:filters,
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setRecords(res.data))
.catch(err=>alert(err.response?.data?.message || "No attendance found"));

};


/* =========================
   EXPORT EXCEL
========================= */

const exportToExcel = () => {

if(records.length === 0){
alert("No data to export");
return;
}

const data = records.map(r => ({
Date:new Date(r.attendance_date).toLocaleDateString("en-IN"),
Period:r.period,
Section:r.section || "No Section",
Subject:r.subject_name,
Faculty:r.faculty_name,
Roll:r.roll_number,
Student:r.student_name,
Status:r.status
}));

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

XLSX.writeFile(workbook, "HOD_Daily_Attendance.xlsx");

};


/* =========================
   EXPORT PDF
========================= */

const exportToPDF = () => {

if(records.length === 0){
alert("No data to export");
return;
}

const doc = new jsPDF();

const now = new Date();

const generatedTime = now.toLocaleString("en-IN",{
day:"2-digit",
month:"short",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
});

const img = new Image();
img.src="/logo.png";

img.onload=function(){

doc.addImage(img,"PNG",90,5,30,30);

doc.setFontSize(16);
doc.text("Rayalaseema University",105,45,{align:"center"});

doc.setFontSize(11);
doc.text("Kurnool - 518007, Andhra Pradesh",105,52,{align:"center"});
doc.text("State Government University",105,58,{align:"center"});

doc.setFontSize(13);
doc.text("HOD Daily Attendance Report",105,66,{align:"center"});

const selectedCourse=courses.find(c=>c.course_id==filters.course_id);

doc.setFontSize(10);

doc.text(`College : ${collegeName}`,14,78);
doc.text(`Department : ${deptName}`,14,84);

doc.text(`Course : ${selectedCourse?.course_name || ""}`,14,90);
doc.text(`Course Type : ${filters.course_type}`,110,90);

doc.text(`Semester : ${filters.semester}`,14,96);
doc.text(`Academic Year : ${filters.academic_year}`,110,96);

doc.text(`Section : ${filters.section === "ALL" ? "All Sections" : filters.section === "NULL" ? "No Section" : filters.section}`,14,102);

doc.text(`Date : ${new Date(filters.attendance_date).toLocaleDateString("en-IN")}`,14,108);

doc.text(`Generated On : ${generatedTime}`,14,114);

const tableColumn=[
"Date",
"Period",
"Section",
"Subject",
"Faculty",
"Roll",
"Student",
"Status"
];

const tableRows=[];

records.forEach(r=>{

tableRows.push([
new Date(r.attendance_date).toLocaleDateString("en-IN"),
r.period,
r.section || "No Section",
r.subject_name,
r.faculty_name,
r.roll_number,
r.student_name,
r.status
]);

});

autoTable(doc,{
head:[tableColumn],
body:tableRows,
startY:120,
styles:{fontSize:8},
headStyles:{fontSize:9}
});

doc.save("HOD_Daily_Attendance_Report.pdf");

};

};


/* =========================
   UI
========================= */

return(

<div style={{padding:"20px"}}>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"15px",
marginBottom:"20px"
}}>

<select name="course_id" value={filters.course_id} onChange={handleChange}>
<option value="">Select Course</option>
{courses.map(c=>(
<option key={c.course_id} value={c.course_id}>{c.course_name}</option>
))}
</select>


<select name="course_type" value={filters.course_type} onChange={handleChange}>
<option value="">Course Type</option>
<option value="UG">UG</option>
<option value="PG">PG</option>
<option value="BTech">BTech</option>
<option value="MTech">MTech</option>
</select>


<select name="semester" value={filters.semester} onChange={handleChange}>
<option value="">Semester</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
</select>


<select name="academic_year" value={filters.academic_year} onChange={handleChange}>
<option value="">Academic Year</option>
{academicYears.map((year,index)=>(
<option key={index} value={year}>{year}</option>
))}
</select>


<select name="section" value={filters.section} onChange={handleChange}>

<option value="ALL">All Sections</option>
<option value="NULL">No Section</option>
<option value="A">Section A</option>
<option value="B">Section B</option>
<option value="C">Section C</option>
<option value="D">Section D</option>

</select>


<input
type="date"
name="attendance_date"
value={filters.attendance_date}
onChange={handleChange}
/>

<button onClick={loadAttendance}>
Load Attendance
</button>

</div>


{/* EXPORT BUTTONS */}

<div style={{marginBottom:"15px"}}>

<button
onClick={exportToExcel}
style={{
marginRight:"10px",
padding:"8px 15px",
background:"#2e7d32",
color:"white",
border:"none",
cursor:"pointer"
}}
>
Export Excel
</button>

<button
onClick={exportToPDF}
style={{
padding:"8px 15px",
background:"#c62828",
color:"white",
border:"none",
cursor:"pointer"
}}
>
Export PDF
</button>

</div>


{/* TABLE */}

{records.length > 0 && (

<table border="1" cellPadding="10" width="100%">

<thead>

<tr>
<th>Date</th>
<th>Period</th>
<th>Section</th>
<th>Subject</th>
<th>Faculty</th>
<th>Roll</th>
<th>Student</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{records.map((r,index)=>(

<tr key={index}>

<td>{new Date(r.attendance_date).toLocaleDateString("en-IN")}</td>
<td>{r.period}</td>
<td>{r.section || "No Section"}</td>
<td>{r.subject_name}</td>
<td>{r.faculty_name}</td>
<td>{r.roll_number}</td>
<td>{r.student_name}</td>

<td style={{
color:r.status==="Present" ? "green":"red",
fontWeight:"bold"
}}>
{r.status}
</td>

</tr>

))}

</tbody>

</table>

)}

</div>

);

}

export default HodDailyAttendance;