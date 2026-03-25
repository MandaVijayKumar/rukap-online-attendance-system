import React,{useEffect,useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PrincipalFaculty(){

const token = localStorage.getItem("token");
const college_id = localStorage.getItem("college_id");

const navigate = useNavigate();

const [faculty,setFaculty] = useState([]);

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/faculty-by-college/${college_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setFaculty(res.data));

},[]);

return(

<div>

<h2>Faculty List</h2>

<table border="1" cellPadding="10" width="100%">

<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Department</th>

<th>Designation</th>
<th>College Name</th>

<th>Action</th>
</tr>
</thead>

<tbody>

{faculty.map(f=>(
<tr key={f.faculty_id}>

<td>{f.faculty_id}</td>
<td>{f.faculty_name}</td>
<td>{f.dept_name}</td>
<td>{f.designation}</td>
<td>{f.college_name}</td>

<td>

<button
onClick={() => {

const path =
college_id == 1
? "/university-principal-faculty-report"
: "/engineering-principal-faculty-report";

navigate(path,{
state:{
faculty_id: f.faculty_id,
faculty_name: f.faculty_name,
dept_name: f.dept_name,
designation: f.designation,
college_name: f.college_name
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

export default PrincipalFaculty;