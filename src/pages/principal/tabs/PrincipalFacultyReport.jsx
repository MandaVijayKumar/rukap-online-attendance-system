import React,{useEffect,useState} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
Box,
Typography,
Card,
CardContent,
Table,
TableHead,
TableRow,
TableCell,
TableBody,
TableContainer,
Paper,
Chip,
Button
} from "@mui/material";

import Navbar from "../../../components/Navbar";

function PrincipalFacultyReport(){

const token = localStorage.getItem("token");

const location = useLocation();

const {
faculty_id,
faculty_name,
dept_name,
designation,
college_name
} = location.state;

const [records,setRecords] = useState([]);

/* ================= LOAD DATA ================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/principal-faculty-attendance/${faculty_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setRecords(res.data));

},[faculty_id]);



/* ================= EXPORT EXCEL ================= */

const exportExcel = () => {

if(records.length === 0){
alert("No data to export");
return;
}

const data = records.map(r=>({

Subject: r.subject_name,
Type: r.subject_type,   // ✅ added
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

XLSX.utils.book_append_sheet(workbook,worksheet,"Faculty Attendance");

XLSX.writeFile(workbook,"Faculty_Attendance_Report.xlsx");

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

doc.addImage(img,"PNG",90,5,30,30);

doc.setFontSize(16);
doc.text("Rayalaseema University",105,45,{align:"center"});

doc.setFontSize(11);
doc.text("Kurnool - 518007, Andhra Pradesh",105,52,{align:"center"});
doc.text("State Government University",105,58,{align:"center"});

doc.setFontSize(13);
doc.text("Faculty Attendance Report",105,66,{align:"center"});

doc.setFontSize(10);

doc.text(`Faculty : ${faculty_name}`,14,80);
doc.text(`Department : ${dept_name}`,14,86);
doc.text(`Designation : ${designation}`,14,92);
doc.text(`College : ${college_name}`,14,98);
doc.text(`Generated On : ${generatedTime}`,14,104);

const columns = [
"Subject",
"Type",   // ✅ added
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

doc.save("Faculty_Attendance_Report.pdf");

};

};



/* ================= UI ================= */

return(
<>
<Navbar/>

<Box p={3}>

<Box display="flex" justifyContent="flex-end" mb={2}>
<Button
variant="contained"
onClick={()=>window.history.back()}
>
Go Back
</Button>
</Box>

<Typography variant="h5" fontWeight="bold" align="center" mb={2}>
Faculty Attendance Report
</Typography>

<Box mb={2}>
<Typography><b>Faculty:</b> {faculty_name}</Typography>
<Typography><b>Department:</b> {dept_name}</Typography>
<Typography><b>Designation:</b> {designation}</Typography>
<Typography><b>College:</b> {college_name}</Typography>
</Box>

<Box mb={2}>
<Button variant="contained" color="success" onClick={exportExcel} sx={{mr:2}}>
Export Excel
</Button>

<Button variant="contained" color="error" onClick={exportPDF}>
Export PDF
</Button>
</Box>

<Card>
<CardContent sx={{p:0}}>

<TableContainer component={Paper} sx={{maxHeight:500}}>

<Table stickyHeader size="small">

<TableHead>
<TableRow>

{[
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
].map((h,i)=>(
<TableCell key={i} sx={{
background:"#0d47a1",
color:"#fff",
fontWeight:"bold"
}}>
{h}
</TableCell>
))}

</TableRow>
</TableHead>

<TableBody>

{records.length === 0 ? (

<TableRow>
<TableCell colSpan={10} align="center">
No data available
</TableCell>
</TableRow>

) : (

records.map((r,index)=>(

<TableRow key={index} sx={{
background:index%2===0?"#fafafa":"#fff",
"&:hover":{background:"#eef5ff"}
}}>

<TableCell>{r.subject_name}</TableCell>

<TableCell>
<Chip
label={r.subject_type}
size="small"
sx={{
background:r.subject_type==="Lab"?"#ffebee":"#e3f2fd",
color:r.subject_type==="Lab"?"#c62828":"#0d47a1"
}}
/>
</TableCell>

<TableCell>
{new Date(r.attendance_date).toLocaleDateString("en-IN")}
</TableCell>

<TableCell>{r.course_name}</TableCell>

<TableCell>{r.semester}</TableCell>

<TableCell>{r.academic_year}</TableCell>

<TableCell>{r.section || "No Section"}</TableCell>

<TableCell>
<Chip label={r.period} size="small"/>
</TableCell>

<TableCell>
<Chip label={r.present} sx={{bgcolor:"#e8f5e9",color:"#2e7d32"}}/>
</TableCell>

<TableCell>
<Chip label={r.absent} sx={{bgcolor:"#ffebee",color:"#c62828"}}/>
</TableCell>

</TableRow>

))

)}

</TableBody>

</Table>

</TableContainer>

</CardContent>
</Card>

</Box>
</>
);

}

export default PrincipalFacultyReport;