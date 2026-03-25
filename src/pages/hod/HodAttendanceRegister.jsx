import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function HodAttendanceRegister(){

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");

const [courses,setCourses] = useState([]);
const [records,setRecords] = useState([]);
const [students,setStudents] = useState([]);

const [academicYears,setAcademicYears] = useState([]);

const [deptName,setDeptName] = useState("");
const [collegeName,setCollegeName] = useState("");

const [filters,setFilters] = useState({
course_id:"",
course_type:"",
semester:"",
academic_year:"",
section:"ALL"
});


/* LOAD COURSES */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/courses/${dept_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setCourses(res.data));

},[dept_id]);


/* LOAD DEPARTMENT */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/department/${dept_id}`)
.then(res=>{
setDeptName(res.data.dept_name);
setCollegeName(res.data.college_name);
});

},[dept_id]);


/* HANDLE CHANGE */

const handleChange=(e)=>{

const {name,value}=e.target;

let updated={
...filters,
[name]:value
};

if(name==="course_type"){

let duration=0;

if(value==="UG") duration=3;
if(value==="PG") duration=2;
if(value==="BTech") duration=4;
if(value==="MTech") duration=2;

const startYears=[2024,2025,2026,2027,2028];

let years=startYears.map(start=>{
return `${start}-${start+duration}`;
});

setAcademicYears(years);

}

setFilters(updated);

};


/* LOAD REGISTER */

const loadRegister=()=>{

if(!filters.course_id || !filters.semester || !filters.academic_year){
alert("Select filters");
return;
}

axios.get("https://rukap.edu.in/attendance-api/hod-attendance-register",{
params:filters,
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{

const data=res.data;

setRecords(data);

/* UNIQUE STUDENTS */

const uniqueStudents=[
...new Map(data.map(s=>[s.student_id,s])).values()
];

setStudents(uniqueStudents);

});

};


/* PRESENT COUNT */

const getPresent=(studentId)=>{

return records.filter(
r=>r.student_id===studentId && r.status==="Present"
).length;

};


/* ABSENT COUNT */

const getAbsent=(studentId)=>{

return records.filter(
r=>r.student_id===studentId && r.status==="Absent"
).length;

};


/* EXPORT EXCEL */

const exportToExcel=()=>{

if(students.length===0){
alert("No data to export");
return;
}

const data=students.map(st=>({

Roll:st.roll_number,
Name:st.student_name,
Section:st.section || "No Section",

Present:getPresent(st.student_id),
Absent:getAbsent(st.student_id),
Total:getPresent(st.student_id)+getAbsent(st.student_id),

Percentage:Math.round(
(getPresent(st.student_id)/
(getPresent(st.student_id)+getAbsent(st.student_id)))*100
)||0

}));

const worksheet=XLSX.utils.json_to_sheet(data);
const workbook=XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook,worksheet,"Attendance Register");

XLSX.writeFile(workbook,"HOD_Attendance_Register.xlsx");

};


/* EXPORT PDF */

const exportToPDF = () => {

if(students.length === 0){
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
doc.text("HOD Attendance Register Report",105,66,{align:"center"});


const selectedCourse = courses.find(
c => c.course_id == filters.course_id
);


doc.setFontSize(10);

doc.text(`College : ${collegeName}`,14,80);
doc.text(`Department : ${deptName}`,14,86);

doc.text(`Course : ${selectedCourse?.course_name || ""}`,14,92);
doc.text(`Course Type : ${filters.course_type}`,110,92);

doc.text(`Semester : ${filters.semester}`,14,98);
doc.text(`Academic Year : ${filters.academic_year}`,110,98);

doc.text(`Section : ${
filters.section==="ALL"
? "All Sections"
: filters.section==="NULL"
? "No Section"
: filters.section
}`,14,104);

doc.text(`Generated On : ${generatedTime}`,14,110);


const columns=[
"Roll",
"Student",
"Section",
"Present",
"Absent",
"Total",
"%"
];

const rows=[];

students.forEach(st=>{

rows.push([
st.roll_number,
st.student_name,
st.section || "No Section",

getPresent(st.student_id),
getAbsent(st.student_id),

getPresent(st.student_id)+getAbsent(st.student_id),

Math.round(
(getPresent(st.student_id)/
(getPresent(st.student_id)+getAbsent(st.student_id)))*100
)||0
]);

});


autoTable(doc,{
head:[columns],
body:rows,
startY:118,
styles:{fontSize:8},
headStyles:{fontSize:9}
});

doc.save("HOD_Attendance_Register.pdf");

};

};


return(

<div style={{padding:"20px"}}>

<h2>Attendance Register</h2>


{/* FILTERS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"15px",
marginBottom:"20px"
}}>

<select name="course_id" value={filters.course_id} onChange={handleChange}>
<option value="">Select Course</option>
{courses.map(c=>(
<option key={c.course_id} value={c.course_id}>
{c.course_name}
</option>
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
<option key={index} value={year}>
{year}
</option>
))}
</select>


{/* SECTION FILTER */}

<select name="section" value={filters.section} onChange={handleChange}>

<option value="ALL">All Sections</option>
<option value="NULL">No Section</option>

<option value="A">Section A</option>
<option value="B">Section B</option>
<option value="C">Section C</option>
<option value="D">Section D</option>

</select>


<button onClick={loadRegister}>
Load Register
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

{students.length>0 &&(

<div style={{overflowX:"auto"}}>

<table border="1" cellPadding="8" width="100%">

<thead>

<tr>
<th>Roll</th>
<th>Name</th>
<th>Section</th>
<th>Present</th>
<th>Absent</th>
<th>Total</th>
<th>%</th>
</tr>

</thead>

<tbody>

{students.map(st=>(

<tr key={st.student_id}>

<td>{st.roll_number}</td>
<td>{st.student_name}</td>
<td>{st.section || "No Section"}</td>

<td>{getPresent(st.student_id)}</td>
<td>{getAbsent(st.student_id)}</td>
<td>{getPresent(st.student_id)+getAbsent(st.student_id)}</td>

<td>

{Math.round(
(getPresent(st.student_id)/
(getPresent(st.student_id)+getAbsent(st.student_id)))*100
)||0}%

</td>

</tr>

))}

</tbody>

</table>

</div>

)}

</div>

);

}

export default HodAttendanceRegister;