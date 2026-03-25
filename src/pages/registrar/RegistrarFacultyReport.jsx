import React,{useEffect,useState} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Navbar from "../../components/Navbar";

function RegistrarFacultyReport(){

const token = localStorage.getItem("token");

const location = useLocation();

const {
faculty_id,
faculty_name,
dept_name,
designation,
college_name
} = location.state || {};

const [records,setRecords] = useState([]);

/* ================= LOAD DATA ================= */

useEffect(()=>{

if(!faculty_id) return;

axios.get(
`https://rukap.edu.in/attendance-api/principal-faculty-attendance/${faculty_id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>setRecords(res.data))
.catch(()=>alert("Error loading report"));

},[faculty_id,token]);


/* ================= EXPORT EXCEL ================= */

const exportExcel = () => {

if(records.length === 0){
alert("No data to export");
return;
}

const data = records.map(r=>({

Subject: r.subject_name,
Type: r.subject_type,
Date: new Date(r.attendance_date).toLocaleDateString("en-IN"),
Course: r.course_name,
Semester: r.semester,
AcademicYear: r.academic_year,
Section: r.section || "No Section",
Period: r.period,
Present: r.present,
Absent: r.absent

}));

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook,worksheet,"Faculty Report");

XLSX.writeFile(workbook,"Registrar_Faculty_Report.xlsx");

};


/* ================= EXPORT PDF ================= */

const exportPDF = () => {

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
img.src = "/logo.png";

img.onload = function(){

doc.addImage(img,"PNG",85,8,40,30);

doc.setFontSize(16);
doc.text("Rayalaseema University",105,45,{align:"center"});

doc.setFontSize(11);
doc.text("Kurnool - 518007, Andhra Pradesh",105,52,{align:"center"});
doc.text("State Government University",105,58,{align:"center"});

doc.setFontSize(13);
doc.text("Registrar Faculty Attendance Report",105,66,{align:"center"});

doc.setFontSize(10);

doc.text(`Faculty : ${faculty_name}`,14,80);
doc.text(`Department : ${dept_name}`,14,86);
doc.text(`Designation : ${designation}`,14,92);
doc.text(`College : ${college_name}`,14,98);
doc.text(`Generated On : ${generatedTime}`,14,104);

const columns = [
"Subject",
"Type",
"Date",
"Course",
"Semester",
"Academic Year",
"Section",
"Period",
"Present",
"Absent"
];

const rows = records.map(r=>[
r.subject_name,
r.subject_type,
new Date(r.attendance_date).toLocaleDateString("en-IN"),
r.course_name,
r.semester,
r.academic_year,
r.section || "No Section",
r.period,
r.present,
r.absent
]);

autoTable(doc,{
head:[columns],
body:rows,
startY:110,
styles:{fontSize:8},
headStyles:{fillColor:[26,35,126],textColor:255}
});

doc.save("Registrar_Faculty_Report.pdf");

};

/* FALLBACK */

img.onerror = function(){

doc.setFontSize(16);
doc.text("Rayalaseema University",105,20,{align:"center"});

doc.setFontSize(13);
doc.text("Registrar Faculty Attendance Report",105,28,{align:"center"});

autoTable(doc,{
head:[["Subject","Type","Date","Course","Semester","Academic Year","Section","Period","Present","Absent"]],
body:records.map(r=>[
r.subject_name,
r.subject_type,
new Date(r.attendance_date).toLocaleDateString("en-IN"),
r.course_name,
r.semester,
r.academic_year,
r.section || "No Section",
r.period,
r.present,
r.absent
]),
startY:40
});

doc.save("Registrar_Faculty_Report.pdf");

};

};


/* ================= UI ================= */

return(

<>
<Navbar/>

<div style={{padding:"20px"}}>

<button
onClick={()=>window.history.back()}
style={{
padding:"8px 16px",
background:"#1a237e",
color:"white",
border:"none",
borderRadius:"4px",
cursor:"pointer",
marginBottom:"15px"
}}
>
Go Back
</button>

<h2 style={{textAlign:"center"}}>
Registrar Faculty Attendance Report
</h2>

<p><b>Faculty:</b> {faculty_name}</p>
<p><b>Department:</b> {dept_name}</p>
<p><b>Designation:</b> {designation}</p>
<p><b>College:</b> {college_name}</p>


<div style={{marginBottom:"15px"}}>

<button
onClick={exportExcel}
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
onClick={exportPDF}
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


<table border="1" width="100%" cellPadding="10">

<thead style={{background:"#0d47a1",color:"#fff"}}>

<tr>
<th>Subject</th>
<th>Type</th>
<th>Date</th>
<th>Course</th>
<th>Semester</th>
<th>Academic Year</th>
<th>Section</th>
<th>Period</th>
<th>Present</th>
<th>Absent</th>
</tr>

</thead>

<tbody>

{records.length === 0 ? (

<tr>
<td colSpan="10" style={{textAlign:"center"}}>
No data available
</td>
</tr>

) : (

records.map((r,index)=>(

<tr key={index}>

<td>{r.subject_name}</td>

<td style={{
fontWeight:"bold",
color:r.subject_type==="Lab" ? "#c62828" : "#1565c0"
}}>
{r.subject_type}
</td>

<td>
{new Date(r.attendance_date).toLocaleDateString("en-IN")}
</td>

<td>{r.course_name}</td>
<td>{r.semester}</td>
<td>{r.academic_year}</td>
<td>{r.section || "No Section"}</td>
<td>{r.period}</td>

<td style={{color:"green",fontWeight:"bold"}}>
{r.present}
</td>

<td style={{color:"red",fontWeight:"bold"}}>
{r.absent}
</td>

</tr>

))

)}

</tbody>

</table>

</div>
</>
);

}

export default RegistrarFacultyReport;