import React,{useEffect,useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegistrarFaculty(){

const token = localStorage.getItem("token");
const navigate = useNavigate();

const [faculty,setFaculty] = useState([]);

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/faculty-all`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setFaculty(res.data))
.catch(()=>alert("Error loading faculty"));

},[]);

return(

<div style={{padding:"20px"}}>

<h2>All Faculty (University)</h2>

<table border="1" cellPadding="10" width="100%">

<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Department</th>
<th>Designation</th>
<th>College</th>
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
onClick={()=>{

navigate("/registrar-faculty-report",{
state:{
faculty_id:f.faculty_id,
faculty_name:f.faculty_name,
dept_name:f.dept_name,
designation:f.designation,
college_name:f.college_name
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

export default RegistrarFaculty;