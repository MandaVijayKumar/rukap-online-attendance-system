import React,{useEffect,useState} from "react";
import axios from "axios";
import {useLocation,useNavigate} from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../../components/Navbar";

function RegistrarStudentHistory(){

const token = localStorage.getItem("token");

const location = useLocation();
const navigate = useNavigate();

const state = location.state || {};

const {
student_id,
roll_number,
student_name,
course_name,
course_type,
dept_name,
college_name,
course_id,
semester,
academic_year,
section
} = state;

const [records,setRecords] = useState([]);
const [loading,setLoading] = useState(true);


/* LOAD HISTORY */

useEffect(()=>{

if(!student_id){
setLoading(false);
return;
}

axios.get(`https://rukap.edu.in/attendance-api/student-attendance-history/${student_id}`,{
params:{
course_id,
semester,
academic_year,
section
},
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
setRecords(res.data);
setLoading(false);
})
.catch(()=>{
setLoading(false);
});

},[student_id,course_id,semester,academic_year,section,token]);


/* SUMMARY */

const totalPeriods = records.length;
const totalPresent = records.filter(r=>r.status==="Present").length;
const totalAbsent = records.filter(r=>r.status==="Absent").length;
const totalDays = [...new Set(records.map(r=>r.attendance_date))].length;

const percentage = totalPeriods
? Math.round((totalPresent/totalPeriods)*100)
:0;


/* EXPORT EXCEL */

const exportExcel=()=>{

const data = records.map(r=>({
Date:new Date(r.attendance_date).toLocaleDateString("en-IN"),
Period:r.period,
Section:r.section || "No Section",
Subject:r.subject_name,
Faculty:r.faculty_name,
Status:r.status
}));

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb,ws,"Attendance");

XLSX.writeFile(wb,"Student_Attendance.xlsx");

};


/* EXPORT PDF */

const exportPDF=()=>{

const doc = new jsPDF();

const img = new Image();
img.src="/logo.png";

const now = new Date();

const generatedTime = now.toLocaleString("en-IN",{
day:"2-digit",
month:"short",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
});

img.onload = function(){

doc.addImage(img,"PNG",90,5,30,30);

doc.setFontSize(16);
doc.text("Rayalaseema University",105,45,{align:"center"});

doc.setFontSize(11);
doc.text("Kurnool - 518007, Andhra Pradesh",105,52,{align:"center"});
doc.text("State Government University",105,58,{align:"center"});

doc.setFontSize(13);
doc.text("Student Attendance History",105,66,{align:"center"});

doc.setFontSize(10);
doc.text(`College: ${college_name}`,14,74);
doc.text(`Department : ${dept_name}`,110,74);
doc.text(`Roll Number : ${roll_number}`,14,80);
doc.text(`Student Name : ${student_name}`,14,86);

doc.text(`Course : ${course_name}`,14,92);
doc.text(`Course Type : ${course_type}`,110,90);



doc.text(`Total Days : ${totalDays}`,14,104);
doc.text(`Total Periods : ${totalPeriods}`,14,110);

doc.text(`Present : ${totalPresent}`,110,104);
doc.text(`Absent : ${totalAbsent}`,110,110);

doc.text(`Attendance % : ${percentage}%`,14,116);

doc.text(`Generated On : ${generatedTime}`,14,122);

const columns = [
"Date",
"Period",
"Section",
"Subject",
"Faculty",
"Status"
];

const rows = records.map(r=>[
new Date(r.attendance_date).toLocaleDateString("en-IN"),
r.period,
r.section || "No Section",
r.subject_name,
r.faculty_name,
r.status
]);

autoTable(doc,{
head:[columns],
body:rows,
startY:130
});

doc.save("Student_Attendance.pdf");

};

};


return(
<>
<Navbar/>

<div style={{padding:"20px"}}>

<button
onClick={()=>navigate(-1)}
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

<h2 style={{textAlign:"center"}}>Student Attendance History</h2>
<p><b>Roll Number:</b> {roll_number}</p>
<p><b>Student Name: {student_name}</b> </p>
<p><b>Course:</b> {course_name} | <b>Department:</b> {dept_name} | <b>College:</b> {college_name}</p>

<div style={{marginTop:"10px"}}>

<p>
<b>Total Days:</b> {totalDays} |
<b>Total Periods:</b> {totalPeriods}
</p>

<p>
<b>Present:</b> {totalPresent} |
<b>Absent:</b> {totalAbsent}
</p>

<p>
<b>Attendance %:</b> {percentage}%
</p>

</div>


<div style={{marginTop:"10px"}}>

<button onClick={exportExcel} style={{marginRight:"10px"}}>
Export Excel
</button>

<button onClick={exportPDF}>
Export PDF
</button>

</div>


{loading ? (
<p>Loading...</p>
) : records.length===0 ? (
<p>No data</p>
) : (

<table border="1" width="100%" cellPadding="10" style={{marginTop:"20px"}}>

<thead>
<tr>
<th>Date</th>
<th>Period</th>
<th>Section</th>
<th>Subject</th>
<th>Faculty</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{records.map((r,index)=>(
<tr key={index}>
<td>{new Date(r.attendance_date).toLocaleDateString()}</td>
<td>{r.period}</td>
<td>{r.section || "No Section"}</td>
<td>{r.subject_name}</td>
<td>{r.faculty_name}</td>
<td style={{color:r.status==="Present"?"green":"red",fontWeight:"bold"}}>{r.status}</td>
</tr>
))}

</tbody>

</table>

)}

</div>
</>
);

}

export default RegistrarStudentHistory;