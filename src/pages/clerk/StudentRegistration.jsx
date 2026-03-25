import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentRegistration.css";

function StudentRegistration() {

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");

const [deptName,setDeptName] = useState("");
const [collegeName,setCollegeName] = useState("");
const [collegeId,setCollegeId] = useState("");
const [courses,setCourses] = useState([]);
const [academicYears,setAcademicYears] = useState([]);
const [student,setStudent] = useState({
roll_number:"",
student_name:"",
gender:"",
academic_year:"",
phone_number:"",
email:"",
course_type:"",
course_id:"",
semester:""
});


/* =========================
   LOAD DEPARTMENT + COLLEGE
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/department/${dept_id}`)
.then(res=>{

setDeptName(res.data.dept_name);
setCollegeName(res.data.college_name);
setCollegeId(res.data.college_id);

});

},[dept_id]);


/* =========================
   LOAD COURSES BY DEPARTMENT
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/courses/${dept_id}`)
.then(res=>{
setCourses(res.data);
});

},[dept_id]);


/* =========================
   HANDLE INPUT CHANGE
========================= */

const handleChange = (e)=>{

const {name,value} = e.target;

let updatedStudent = {
...student,
[name]:value
};

/* GENERATE PROGRAM ACADEMIC YEARS */

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

setStudent(updatedStudent);

};
/* =========================
   SUBMIT STUDENT
========================= */

const handleSubmit = (e)=>{

e.preventDefault();

axios.post(
"https://rukap.edu.in/attendance-api/register-student",
{
...student,
dept_id:dept_id,
college_id:collegeId
},
{
headers:{
Authorization:`Bearer ${token}`
}
}
)
.then(res=>{
alert("Student Registered Successfully");
})
.catch(err=>{
console.log(err);
});

};


/* =========================
   UI
========================= */

return (

<div className="container">

<h2>Student Registration</h2>

<form onSubmit={handleSubmit}>

<label>College</label>
<input type="text" value={collegeName} readOnly />

<label>Department</label>
<input type="text" value={deptName} readOnly />

<label>Roll Number</label>
<input
type="text"
name="roll_number"
onChange={handleChange}
/>

<label>Student Name</label>
<input
type="text"
name="student_name"
onChange={handleChange}
/>

<label>Gender</label>
<select name="gender" onChange={handleChange}>
<option value="">Select</option>
<option value="Male">Male</option>
<option value="Female">Female</option>
<option value="Other">Other</option>
</select>


<label>Phone Number</label>
<input
type="text"
name="phone_number"
onChange={handleChange}
/>

<label>Email</label>
<input
type="email"
name="email"
onChange={handleChange}
/>

<label>Course Type</label>
<select name="course_type" onChange={handleChange}>
<option value="">Select</option>
<option value="UG">UG</option>
<option value="PG">PG</option>
<option value="BTech">BTech</option>
<option value="MTech">MTech</option>

</select>

<label>Course</label>
<select name="course_id" onChange={handleChange}>
<option value="">Select Course</option>

{courses.map(course=>(
<option
key={course.course_id}
value={course.course_id}
>
{course.course_name}
</option>
))}

</select>
<label>Section</label>

<select
name="section"
value={student.section || ""}
onChange={(e)=>{
const value = e.target.value === "" ? null : e.target.value;

setStudent({
...student,
section:value
});
}}
>

<option value="">No Section</option>
<option value="A">Section A</option>
<option value="B">Section B</option>
<option value="C">Section C</option>
<option value="D">Section D</option>

</select>
{/* <label>Semester</label>
<select name="semester" onChange={handleChange}>
<option value="">Select Semester</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
</select> */}
<label>Academic Year</label>

<select name="academic_year" onChange={handleChange}>
<option value="">Select Academic Year</option>

{academicYears.map((year,index)=>(
<option key={index} value={year}>
{year}
</option>
))}

</select>

<button type="submit">
Register Student
</button>

</form>

</div>

);

}

export default StudentRegistration;