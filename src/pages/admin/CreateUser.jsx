import React,{useEffect,useState} from "react";
import axios from "axios";

function CreateUser(){

const token = localStorage.getItem("token");

const [colleges,setColleges] = useState([]);
const [roles,setRoles] = useState([]);
const [faculty,setFaculty] = useState([]);
const [departments,setDepartments] = useState([]);

const [form,setForm] = useState({
username:"",
password:"",
role_id:"",
college_id:"",
dept_id:"",
faculty_id:""
});

/* ================= LOAD DATA ================= */

useEffect(()=>{

axios.get("https://rukap.edu.in/attendance-api/colleges")
.then(res=>setColleges(res.data));

axios.get("https://rukap.edu.in/attendance-api/roles")
.then(res=>setRoles(res.data));

axios.get("https://rukap.edu.in/attendance-api/faculty")
.then(res=>setFaculty(res.data));

},[]);


/* ================= HANDLE CHANGE ================= */

const handleChange = (e)=>{

const {name,value} = e.target;

let updated = {...form,[name]:value};

/* LOAD DEPARTMENTS WHEN COLLEGE SELECTED */

if(name === "college_id" && value){

axios.get(`https://rukap.edu.in/attendance-api/departments/${value}`)
.then(res=>setDepartments(res.data));

updated.dept_id = "";
}

/* RESET FIELDS WHEN ROLE CHANGES */

if(name === "role_id"){
updated.dept_id = "";
updated.faculty_id = "";
}

setForm(updated);

};


/* ================= SUBMIT ================= */

const handleSubmit = (e)=>{
e.preventDefault();

axios.post(
"https://rukap.edu.in/attendance-api/create-user",
form,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(()=>{
alert("User Created Successfully");
})
.catch(()=>{
alert("Error creating user");
});

};


/* ================= ROLE CONDITIONS ================= */

const isHOD = form.role_id == 2;
const isDeptStaff = form.role_id == 3;
const isFaculty = form.role_id == 4;

/* ================= UI ================= */

return(

<div style={{
maxWidth:"500px",
margin:"auto",
background:"#fff",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 3px 10px rgba(0,0,0,0.1)"
}}>

<h2>Create User</h2>

<form onSubmit={handleSubmit}>

{/* USERNAME */}
<label>Username</label>
<input
type="text"
name="username"
onChange={handleChange}
required
/>

{/* PASSWORD */}
<label>Password</label>
<input
type="password"
name="password"
onChange={handleChange}
required
/>

{/* ROLE */}
<label>Role</label>
<select name="role_id" onChange={handleChange} required>
<option value="">Select Role</option>
{roles.map(r=>(
<option key={r.role_id} value={r.role_id}>
{r.role_name}
</option>
))}
</select>

{/* 🔥 COLLEGE (ALL EXCEPT ADMIN) */}
{form.role_id && form.role_id != 1 && (
<>
<label>College</label>
<select name="college_id" onChange={handleChange} required>
<option value="">Select College</option>

{colleges.map(c=>(
<option key={c.college_id} value={c.college_id}>
{c.college_name}
</option>
))}

</select>
</>
)}

{/* 🔥 HOD + DEPT STAFF */}
{(isHOD || isDeptStaff) && (

<>
<label>Department</label>
<select name="dept_id" onChange={handleChange} required>
<option value="">Select Department</option>

{departments.map(d=>(
<option key={d.dept_id} value={d.dept_id}>
{d.dept_name}
</option>
))}

</select>
</>
)}

{/* 🔥 FACULTY */}
{isFaculty && (

<>
<label>Faculty</label>
<select name="faculty_id" onChange={handleChange} required>
<option value="">Select Faculty</option>

{faculty.map(f=>(
<option key={f.faculty_id} value={f.faculty_id}>
{f.faculty_name}
</option>
))}

</select>
</>
)}

<button type="submit" style={{
marginTop:"15px",
padding:"10px",
background:"#1a237e",
color:"white",
border:"none",
width:"100%"
}}>
Create User
</button>

</form>

</div>

);

}

export default CreateUser;