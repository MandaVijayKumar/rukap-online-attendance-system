import React,{useEffect,useState} from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
Container,
Typography,
Button,
Table,
TableHead,
TableRow,
TableCell,
TableBody,
Paper,
TableContainer,
Box
} from "@mui/material";

import FacultyNavbar from "./FacultyNavbar";

function FacultyAttendanceRegister(){

const token = localStorage.getItem("token");
const faculty_id = localStorage.getItem("faculty_id");

const [subjects,setSubjects] = useState([]);
const [records,setRecords] = useState([]);

const [subjectId,setSubjectId] = useState("");
const [courseId,setCourseId] = useState("");
const [semester,setSemester] = useState("");
const [academicYear,setAcademicYear] = useState("");

const [students,setStudents] = useState([]);
const [sessions,setSessions] = useState([]);


/* LOAD SUBJECTS */

useEffect(()=>{

axios.get(
`https://rukap.edu.in/attendance-api/faculty-subjects/${faculty_id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>setSubjects(res.data))
.catch(()=>alert("Error loading subjects"));

},[faculty_id]);


/* SUBJECT SELECT */

const handleSubjectChange=(e)=>{

const id = e.target.value;

setSubjectId(id);

const subject = subjects.find(s => s.subject_id == id);

if(subject){
setCourseId(subject.course_id);
setSemester(subject.semester);
setAcademicYear(subject.academic_year);
}

};


/* LOAD REPORT */

const loadReport=()=>{

axios.get(
"https://rukap.edu.in/attendance-api/faculty-attendance-report",
{
params:{
subject_id:subjectId,
course_id:courseId,
semester:semester,
academic_year:academicYear
},
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{

const data = res.data;

setRecords(data);

/* UNIQUE STUDENTS */

const uniqueStudents = [
...new Map(data.map(s=>[s.student_id,s])).values()
];

setStudents(uniqueStudents);


/* SAFE UNIQUE SESSIONS */

let uniqueSessions = [
...new Map(
data
.filter(r => r.attendance_date && r.period) // 🔥 FIX
.map(r => [`${r.attendance_date}_${r.period}`, r])
).values()
];


/* SORT SESSIONS */

uniqueSessions.sort((a,b)=>{
if(a.attendance_date === b.attendance_date){
return a.period.localeCompare(b.period);
}
return new Date(a.attendance_date) - new Date(b.attendance_date);
});

setSessions(uniqueSessions);

})
.catch(()=>{
alert("Error loading report");
});

};


/* SAFE DATE FORMAT */

const formatDate = (date)=>{
if(!date) return "-";

const d = new Date(date);

return isNaN(d)
? "-"
: d.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
};


/* GET STATUS */

const getStatus=(studentId,date,period)=>{

const rec = records.find(
r=>r.student_id===studentId &&
r.attendance_date===date &&
r.period===period
);

return rec ? rec.status : "-";

};


/* COUNT */

const getPresent=(studentId)=>{
return records.filter(
r=>r.student_id===studentId && r.status==="Present"
).length;
};

const getAbsent=(studentId)=>{
return records.filter(
r=>r.student_id===studentId && r.status==="Absent"
).length;
};


/* EXPORT EXCEL */

const exportExcel = () => {

if(students.length === 0){
alert("No data to export");
return;
}

const selectedSubject = subjects.find(s => s.subject_id == subjectId);

const header = [
"Roll Number",
"Student Name",
...sessions.map(s =>
`${formatDate(s.attendance_date)} ${s.period}`
),
"Present",
"Absent",
"Attendance %"
];

const data = students.map(st => {

const present = getPresent(st.student_id);
const absent = getAbsent(st.student_id);

const percentage = Math.round(
(present / (present + absent)) * 100
) || 0;

return [

st.roll_number,
st.student_name,

...sessions.map(s =>
getStatus(st.student_id,s.attendance_date,s.period)==="Present"
? "P"
: getStatus(st.student_id,s.attendance_date,s.period)==="Absent"
? "A"
: "-"
),

present,
absent,
`${percentage}%`

];

});

const ws = XLSX.utils.aoa_to_sheet([header,...data]);
const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb,ws,"Attendance");

const fileName = `Attendance_${selectedSubject?.subject_name}_${academicYear}.xlsx`;

const excelBuffer = XLSX.write(wb,{
bookType:"xlsx",
type:"array"
});

saveAs(new Blob([excelBuffer]), fileName);

};


return(

<>
<FacultyNavbar/>

<Container maxWidth="lg" sx={{mt:4}}>

<Typography variant="h4" gutterBottom>
Attendance Register
</Typography>

<Button variant="outlined" sx={{mb:2}} onClick={exportExcel}>
Export Excel
</Button>


{/* FILTER */}

<Box sx={{display:"flex",gap:3,mb:3}}>

<select
value={subjectId}
onChange={handleSubjectChange}
style={{height:"40px",minWidth:"350px"}}
>
<option value="">Select Subject</option>

{subjects.map(s=>(
<option key={s.subject_id} value={s.subject_id}>
{s.subject_name} | {s.course_name} | Sem {s.semester} | {s.academic_year}
</option>
))}

</select>

<Button variant="contained" onClick={loadReport}>
Load Register
</Button>

</Box>


{/* TABLE */}

{students.length>0 &&(

<TableContainer component={Paper}>

<Table>

<TableHead>

<TableRow>

<TableCell>Roll</TableCell>
<TableCell>Name</TableCell>

{sessions.map(s=>(
<TableCell key={`${s.attendance_date}-${s.period}`}>
{formatDate(s.attendance_date)}
<br/>
<b>{s.period}</b>
</TableCell>
))}

<TableCell>Present</TableCell>
<TableCell>Absent</TableCell>
<TableCell>%</TableCell>

</TableRow>

</TableHead>


<TableBody>

{students.map(st=>(

<TableRow key={st.student_id}>

<TableCell>{st.roll_number}</TableCell>
<TableCell>{st.student_name}</TableCell>

{sessions.map(s=>(
<TableCell key={`${s.attendance_date}-${s.period}`}>
{getStatus(st.student_id,s.attendance_date,s.period)==="Present"
? "P"
: getStatus(st.student_id,s.attendance_date,s.period)==="Absent"
? "A"
: "-"}
</TableCell>
))}

<TableCell>{getPresent(st.student_id)}</TableCell>
<TableCell>{getAbsent(st.student_id)}</TableCell>

<TableCell>
{Math.round(
(getPresent(st.student_id) /
(getPresent(st.student_id)+getAbsent(st.student_id))) * 100
) || 0}%
</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</TableContainer>

)}

</Container>
</>

);

}

export default FacultyAttendanceRegister;