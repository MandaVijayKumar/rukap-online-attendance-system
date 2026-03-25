import React,{useEffect,useState} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../../components/Navbar";

function HodStudentHistory(){

const token = localStorage.getItem("token");

const location = useLocation();

const {
student_id,
roll_number,
student_name,
course_name,
course_type,
semester,
academic_year,
section,
course_id,
college_name,
dept_name
} = location.state;

const [records,setRecords] = useState([]);


/* LOAD HISTORY */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/student-attendance-history/${student_id}`,{
params:{
course_id:course_id,
semester:semester,
academic_year:academic_year,
section:section
},
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setRecords(res.data));

},[student_id]);


/* SUMMARY */

const totalPeriods = records.length;

const totalPresent = records.filter(
r=>r.status==="Present"
).length;

const totalAbsent = records.filter(
r=>r.status==="Absent"
).length;

const totalDays = [
...new Set(records.map(r=>r.attendance_date))
].length;

const percentage = totalPeriods
? Math.round((totalPresent/totalPeriods)*100)
:0;


/* EXPORT EXCEL */

const exportExcel=()=>{

const data=records.map(r=>({

Date:new Date(r.attendance_date).toLocaleDateString("en-IN"),
Period:r.period,
Section:r.section || "No Section",
Subject:r.subject_name,
Faculty:r.faculty_name,
Status:r.status

}));

const ws=XLSX.utils.json_to_sheet(data);
const wb=XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb,ws,"Attendance");

XLSX.writeFile(wb,"Student_Attendance_History.xlsx");

};


/* EXPORT PDF */

const exportPDF=()=>{

const doc=new jsPDF();

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

img.onload=function(){

doc.addImage(img,"PNG",90,5,30,30);

doc.setFontSize(16);
doc.text("Rayalaseema University",105,45,{align:"center"});

doc.setFontSize(11);
doc.text("Kurnool - 518007, Andhra Pradesh",105,52,{align:"center"});
doc.text("State Government University",105,58,{align:"center"});

doc.setFontSize(13);
doc.text("Student Attendance History",105,66,{align:"center"});


doc.setFontSize(10);

doc.text(`College : ${college_name}`,14,78);
doc.text(`Department : ${dept_name}`,14,84);

doc.text(`Course : ${course_name}`,14,90);
doc.text(`Course Type : ${course_type}`,110,90);

doc.text(`Semester : ${semester}`,14,96);
doc.text(`Academic Year : ${academic_year}`,110,96);

doc.text(`Section : ${section==="NULL" ? "No Section" : section}`,14,102);

doc.text(`Roll Number : ${roll_number}`,14,108);
doc.text(`Student Name : ${student_name}`,14,114);


doc.text(`Total Days : ${totalDays}`,14,124);
doc.text(`Total Periods : ${totalPeriods}`,14,130);

doc.text(`Present : ${totalPresent}`,110,124);
doc.text(`Absent : ${totalAbsent}`,110,130);

doc.text(`Attendance % : ${percentage}%`,14,136);


const columns=[
"Date",
"Period",
"Section",
"Subject",
"Faculty",
"Status"
];

const rows=[];

records.forEach(r=>{

rows.push([
new Date(r.attendance_date).toLocaleDateString("en-IN"),
r.period,
r.section || "No Section",
r.subject_name,
r.faculty_name,
r.status
]);

});

autoTable(doc,{
head:[columns],
body:rows,
startY:145
});

doc.text(`Generated On : ${generatedTime}`,14,140);

doc.save("Student_Attendance_History.pdf");

};

};


return(
<>
<Navbar/>

<div style={{padding:"20px"}}>

<div style={{
display:"flex",
justifyContent:"flex-end",
marginBottom:"20px"
}}>

<button
onClick={()=>window.history.back()}
style={{
padding:"8px 16px",
background:"#1a237e",
color:"white",
border:"none",
cursor:"pointer",
borderRadius:"4px"
}}
>
Go Back
</button>

</div>

<h2>Student Attendance History</h2>

<p><b>Roll:</b> {roll_number}</p>
<p><b>Name:</b> {student_name}</p>

<p>
<b>Course:</b> {course_name} |
<b> Type:</b> {course_type} |
<b> Semester:</b> {semester}
</p>

<p>
<b>Academic Year:</b> {academic_year} |
<b> Section:</b> {section==="NULL" ? "No Section" : section}
</p>

<p>
<b>College:</b> {college_name} |
<b> Department:</b> {dept_name}
</p>


{/* SUMMARY */}

<div style={{marginTop:"10px"}}>

<p>
<b>Total Days:</b> {totalDays} |
<b> Total Periods:</b> {totalPeriods}
</p>

<p>
<b>Present:</b> {totalPresent} |
<b> Absent:</b> {totalAbsent}
</p>

<p>
<b>Attendance %:</b> {percentage}%
</p>

</div>


<button onClick={exportExcel} style={{marginRight:"10px"}}>
Export Excel
</button>

<button onClick={exportPDF}>
Export PDF
</button>


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

<td>{new Date(r.attendance_date).toLocaleDateString("en-IN")}</td>

<td>{r.period}</td>

<td>{r.section || "No Section"}</td>

<td>{r.subject_name}</td>

<td>{r.faculty_name}</td>

<td style={{
color:r.status==="Present"?"green":"red",
fontWeight:"bold"
}}>
{r.status}
</td>

</tr>

))}

</tbody>

</table>

</div>
</>
);

}

export default HodStudentHistory;