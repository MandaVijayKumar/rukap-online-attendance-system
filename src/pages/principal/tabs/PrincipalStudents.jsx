import React,{useEffect,useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function PrincipalStudents(){

const token = localStorage.getItem("token");
const college_id = localStorage.getItem("college_id");

const navigate = useNavigate();

const [students,setStudents] = useState([]);

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/students-by-college/${college_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setStudents(res.data))
.catch(()=>alert("Error loading students"));

},[college_id,token]);

return(

<div style={{padding:"20px"}}>

<h2>College Students</h2>

<table border="1" cellPadding="10" width="100%">

<thead>
<tr>
<th>Roll</th>
<th>Name</th>
<th>Course</th>
<th>Department</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{students.map(st=>(

<tr key={st.student_id}>

<td>{st.roll_number}</td>
<td>{st.student_name}</td>
<td>{st.course_name}</td>
<td>{st.dept_name}</td>

<td>

<button
onClick={()=>{

const role = localStorage.getItem("role");

const path =
role === "University Principal"
? "/university-principal-student-history"
: "/college-principal-student-history";

navigate(path,{
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

dept_name:st.dept_name
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

);

}

export default PrincipalStudents;