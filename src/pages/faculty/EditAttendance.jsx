import React, { useEffect, useState } from "react";
import axios from "axios";

import {
Container,
Typography,
Grid,
Button,
FormControl,
InputLabel,
Select,
MenuItem,
Card,
CardContent,
ToggleButtonGroup,
ToggleButton,
Box
} from "@mui/material";

function EditAttendance(){

const token = localStorage.getItem("token");
const faculty_id = localStorage.getItem("faculty_id");
const dept_id = localStorage.getItem("dept_id");
const college_id = localStorage.getItem("college_id");

const [subjects,setSubjects] = useState([]);
const [selectedSubject,setSelectedSubject] = useState(null);
const [period,setPeriod] = useState("");

const [students,setStudents] = useState([]);
const [attendance,setAttendance] = useState({});

const today = new Date().toISOString().split("T")[0];


/* LOAD FACULTY SUBJECTS */

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



/* LOAD EXISTING ATTENDANCE */

const loadAttendance = () => {

if(!selectedSubject || !period){
alert("Please select subject and period");
return;
}

axios.get(
`https://rukap.edu.in/attendance-api/attendance/${selectedSubject.subject_id}/${period}`,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{

const records = res.data;

if(records.length === 0){
alert("No attendance found for this subject and period");
return;
}

setStudents(records);

const updated = {};

records.forEach(student=>{
updated[student.student_id] = student.status;
});

setAttendance(updated);

})
.catch(err=>{
alert(err.response?.data?.message || "Error loading attendance");
});

};



/* TOGGLE ATTENDANCE */

const handleToggle = (studentId,value)=>{

if(!value) return;

setAttendance(prev=>({
...prev,
[studentId]:value
}));

};



/* SAVE UPDATED ATTENDANCE */

const saveAttendance = () => {

const records = students.map(student => ({

student_id: student.student_id,
subject_id: selectedSubject.subject_id,
faculty_id: faculty_id,

course_id: selectedSubject.course_id,
semester: selectedSubject.semester,
academic_year: selectedSubject.academic_year,

dept_id: dept_id,
college_id: college_id,

attendance_date: today,
period: period,

status: attendance[student.student_id]

}));

axios.post(
"https://rukap.edu.in/attendance-api/submit-attendance",
{records},
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{
alert(res.data.message);
})
.catch(err=>{
alert(err.response?.data?.message || "Update failed");
});

};



return(

<Container maxWidth="md" sx={{mt:4}}>

<Typography variant="h4" gutterBottom>
Edit Attendance
</Typography>



{/* SUBJECT SELECT */}

<FormControl fullWidth sx={{mb:3}}>

<InputLabel>Select Subject</InputLabel>

<Select
value={selectedSubject?.subject_id || ""}
label="Select Subject"
onChange={(e)=>{

const subject = subjects.find(s=>s.subject_id === e.target.value);
setSelectedSubject(subject);

}}
>

{subjects.map(subject=>(

<MenuItem key={subject.subject_id} value={subject.subject_id}>
{subject.subject_name} (Sem {subject.semester})
</MenuItem>

))}

</Select>

</FormControl>



{/* PERIOD SELECT */}

<FormControl fullWidth sx={{mb:3}}>

<InputLabel>Select Period</InputLabel>

<Select
value={period}
label="Select Period"
onChange={(e)=>setPeriod(e.target.value)}
>

<MenuItem value="P1">P1 (10-11)</MenuItem>
<MenuItem value="P2">P2 (11-12)</MenuItem>
<MenuItem value="P3">P3 (12-1)</MenuItem>

<MenuItem disabled>Lunch Break</MenuItem>

<MenuItem value="P4">P4 (2-3)</MenuItem>
<MenuItem value="P5">P5 (3-4)</MenuItem>
<MenuItem value="P6">P6 (4-5)</MenuItem>

</Select>

</FormControl>



<Button
variant="contained"
sx={{mb:3}}
onClick={loadAttendance}
disabled={!selectedSubject || !period}
>
Load Attendance
</Button>



{/* STUDENT LIST */}

{students.map(student=>(

<Card key={student.student_id} sx={{mb:2}}>

<CardContent>

<Typography>
{student.roll_number} - {student.student_name}
</Typography>

<ToggleButtonGroup
exclusive
value={attendance[student.student_id]}
onChange={(e,val)=>handleToggle(student.student_id,val)}
sx={{mt:1}}
>

<ToggleButton value="Present" color="success">
Present
</ToggleButton>

<ToggleButton value="Absent" color="error">
Absent
</ToggleButton>

</ToggleButtonGroup>

</CardContent>

</Card>

))}



{/* UPDATE BUTTON */}

{students.length > 0 && (

<Button
variant="contained"
color="primary"
onClick={saveAttendance}
>
Update Attendance
</Button>

)}

</Container>

);

}

export default EditAttendance;