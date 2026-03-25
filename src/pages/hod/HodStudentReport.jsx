import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HodStudentReport(){

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");

const navigate = useNavigate();

const [courses,setCourses] = useState([]);
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

let updated={...filters,[name]:value};

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


/* LOAD STUDENTS */

const loadStudents=()=>{

if(!filters.course_id || !filters.semester || !filters.academic_year){
alert("Select filters");
return;
}

axios.get("https://rukap.edu.in/attendance-api/students-filter",{
params:{
course_id:filters.course_id,
academic_year:filters.academic_year,
section:filters.section
},
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
setStudents(res.data);
})
.catch(err=>{
alert(err.response?.data?.message || "No students found");
});

};


/* GET COURSE NAME */

const selectedCourse = courses.find(
c=>c.course_id==filters.course_id
);


return(

<div style={{padding:"20px"}}>

<h2>Student Attendance Report</h2>


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


<button onClick={loadStudents}>
Load Students
</button>

</div>



{/* STUDENT TABLE */}

{students.length>0 &&(

<table border="1" width="100%" cellPadding="10">

<thead>

<tr>

<th>Roll</th>
<th>Name</th>
<th>Section</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{students.map(st=>(

<tr key={st.student_id}>

<td>{st.roll_number}</td>

<td>{st.student_name}</td>

<td>{st.section || "No Section"}</td>

<td>

<button
onClick={()=>navigate("/hod-student-history",{
state:{
student_id:st.student_id,
roll_number:st.roll_number,
student_name:st.student_name,

course_id:filters.course_id,
course_name:selectedCourse?.course_name || "",

course_type:filters.course_type,
semester:filters.semester,
academic_year:filters.academic_year,

section:st.section ? st.section : "NULL",

dept_name:deptName,
college_name:collegeName
}
})}
>

View

</button>

</td>

</tr>

))}

</tbody>

</table>

)}

</div>

);

}

export default HodStudentReport;