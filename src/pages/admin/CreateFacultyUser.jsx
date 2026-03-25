import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateFacultyUser.css";

function CreateFacultyUser(){

const token = localStorage.getItem("token");

const [facultyList,setFacultyList] = useState([]);

const [form,setForm] = useState({
faculty_id:"",
dept_id:"",
college_id:"",
username:"",
password:""
});


/* LOAD FACULTY */

useEffect(()=>{

axios.get(
"https://rukap.edu.in/attendance-api/faculty-details",
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{
setFacultyList(res.data);
})
.catch(()=>{
alert("Error loading faculty");
});

},[]);


/* HANDLE FACULTY SELECT */

const handleFacultyChange=(e)=>{

const facultyId = parseInt(e.target.value);

const selected = facultyList.find(
f => f.faculty_id === facultyId
);

setForm({
...form,
faculty_id:selected.faculty_id,
dept_id:selected.dept_id,
college_id:selected.college_id
});

};


/* HANDLE INPUT */

const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
});

};


/* SUBMIT */

const handleSubmit=(e)=>{

e.preventDefault();

axios.post(
"https://rukap.edu.in/attendance-api/create-faculty-user",
form,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{

alert(res.data.message);

setForm({
faculty_id:"",
dept_id:"",
college_id:"",
username:"",
password:""
});

})
.catch(err=>{
alert(err.response?.data?.message || "Error creating faculty login");
});

};


return(

<div className="create-user-container">

<h2>Create Faculty Login</h2>

<form onSubmit={handleSubmit}>

<label>Select Faculty</label>

<select
value={form.faculty_id}
onChange={handleFacultyChange}
required
>

<option value="">Select Faculty</option>

{facultyList.map(f=>(

<option key={f.faculty_id} value={f.faculty_id}>
{f.faculty_name}
</option>

))}

</select>


<label>Department</label>

<input
type="text"
value={
facultyList.find(f=>f.faculty_id === form.faculty_id)?.dept_name || ""
}
readOnly
/>


<label>College</label>

<input
type="text"
value={
facultyList.find(f=>f.faculty_id === form.faculty_id)?.college_name || ""
}
readOnly
/>


<label>Email</label>

<input
type="text"
value={
facultyList.find(f=>f.faculty_id === form.faculty_id)?.email || ""
}
readOnly
/>


<label>Username</label>

<input
type="text"
name="username"
value={form.username}
onChange={handleChange}
required
/>


<label>Password</label>

<input
type="password"
name="password"
value={form.password}
onChange={handleChange}
required
/>


<button type="submit">
Create Login
</button>

</form>

</div>

);

}

export default CreateFacultyUser;