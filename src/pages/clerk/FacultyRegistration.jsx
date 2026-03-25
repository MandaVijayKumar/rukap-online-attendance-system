import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FacultyRegistration.css";

function FacultyRegistration(){

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");

const [deptName,setDeptName] = useState("");
const [collegeName,setCollegeName] = useState("");
const [collegeId,setCollegeId] = useState("");

const [faculty,setFaculty] = useState({
faculty_name:"",
email:"",
phone:"",
designation:""
});


/* LOAD DEPARTMENT + COLLEGE */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/department/${dept_id}`)
.then(res=>{

setDeptName(res.data.dept_name);
setCollegeName(res.data.college_name);
setCollegeId(res.data.college_id);

});

},[dept_id]);


/* INPUT CHANGE */

const handleChange = (e)=>{

setFaculty({
...faculty,
[e.target.name]:e.target.value
});

};


/* SUBMIT */

const handleSubmit = (e)=>{

e.preventDefault();

axios.post(
"https://rukap.edu.in/attendance-api/register-faculty",
{
...faculty,
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
alert(res.data.message);
})
.catch(err=>{
alert(err.response?.data?.message || "Error occurred");
});

};


return(

<div className="faculty-container">

<h2>Faculty Registration</h2>

<form onSubmit={handleSubmit}>

<label>College</label>
<input type="text" value={collegeName} readOnly />

<label>Department</label>
<input type="text" value={deptName} readOnly />

<label>Faculty Name</label>
<input
type="text"
name="faculty_name"
onChange={handleChange}
/>

<label>Email</label>
<input
type="email"
name="email"
onChange={handleChange}
/>

<label>Phone</label>
<input
type="text"
name="phone"
onChange={handleChange}
/>

<label>Designation</label>
<select
name="designation"
onChange={handleChange}
>
<option value="">Select Designation</option>
<option value="Professor">Professor</option>
<option value="Associate Professor">Associate Professor</option>
<option value="Assistant Professor">Assistant Professor</option>
<option value="Assistant Professor(mts)">Assistant Professor(MTS)</option>
<option value="Assistant Professor(contract faculty)">Assistant Professor(Contract Faculty)</option>
<option value="Assistant Professor(ad hoc)">Assistant Professor(AD HOC)</option>
<option value="Teaching Assistant">Teaching Assistant</option>
<option value="Guest Lecturer">Guest Lecturer</option>
</select>

<button type="submit">
Register Faculty
</button>

</form>

</div>

);

}

export default FacultyRegistration;