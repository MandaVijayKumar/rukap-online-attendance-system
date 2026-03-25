import React,{useEffect,useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function RegistrarStudents(){

const token = localStorage.getItem("token");
const navigate = useNavigate();

const [students,setStudents] = useState([]);

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/students-all`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
setStudents(res.data);
})
.catch(err=>{
console.error(err);
alert("Error loading students");
});

},[token]);


/* =========================
GROUP BY COURSE
========================= */

const courseGroups = {};

students.forEach(st=>{
if(!courseGroups[st.course_name]){
courseGroups[st.course_name]=[];
}
courseGroups[st.course_name].push(st);
});


return(

<div style={{padding:"20px"}}>

<h2>University Students</h2>

{/* =========================
COURSE WISE TABLES
========================= */}

{Object.keys(courseGroups).map(course=>(

<div key={course} style={{
background:"white",
padding:"20px",
marginBottom:"25px",
borderRadius:"8px",
boxShadow:"0 2px 5px rgba(0,0,0,0.1)"
}}>

<h3>{course}</h3>

<table border="1" cellPadding="10" width="100%">

<thead>
<tr>
<th>Roll</th>
<th>Name</th>
<th>Department</th>
<th>College</th>
<th>Semester</th>
<th>Academic Year</th>
<th>Section</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{courseGroups[course].map(st=>(

<tr key={st.student_id}>

<td>{st.roll_number}</td>
<td>{st.student_name}</td>
<td>{st.dept_name}</td>
<td>{st.college_name}</td>

<td>{st.semester || "-"}</td>
<td>{st.academic_year || "-"}</td>
<td>{st.section || "No Section"}</td>

<td>

<button
onClick={()=>{

navigate("/registrar-student-history",{
state:{
student_id:st.student_id,
roll_number:st.roll_number,
student_name:st.student_name,

course_id:st.course_id,
course_name:st.course_name,
course_type:st.course_type,

semester:st.semester,
academic_year:st.academic_year,
section:st.section ? st.section : "NULL",

dept_name:st.dept_name,
college_name:st.college_name
}
});

}}
>
View
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

))}

</div>

);

}

export default RegistrarStudents;