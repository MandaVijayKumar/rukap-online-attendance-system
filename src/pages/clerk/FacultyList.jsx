import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FacultyList.css";

function FacultyList(){

const [faculty,setFaculty] = useState([]);
const [editFaculty,setEditFaculty] = useState(null);

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");


/* LOAD FACULTY */

const fetchFaculty = ()=>{

axios.get(
`https://rukap.edu.in/attendance-api/faculty/${dept_id}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
)
.then(res=>{
setFaculty(res.data);
})
.catch(()=>{
alert("Error loading faculty");
});

};

useEffect(()=>{
fetchFaculty();
},[]);


/* DELETE FACULTY */

const deleteFaculty = (id)=>{

if(!window.confirm("Delete this faculty?")){
return;
}

axios.delete(
`https://rukap.edu.in/attendance-api/faculty/${id}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
)
.then(res=>{
alert(res.data.message);
fetchFaculty();
})
.catch(()=>{
alert("Delete failed");
});

};


/* EDIT INPUT */

const handleChange = (e)=>{

setEditFaculty({
...editFaculty,
[e.target.name]:e.target.value
});

};


/* UPDATE FACULTY */

const updateFaculty = ()=>{

axios.put(
`https://rukap.edu.in/attendance-api/faculty/${editFaculty.faculty_id}`,
editFaculty,
{
headers:{
Authorization:`Bearer ${token}`
}
}
)
.then(res=>{
alert(res.data.message);
setEditFaculty(null);
fetchFaculty();
})
.catch(()=>{
alert("Update failed");
});

};


return(

<div className="faculty-container">

<h2>Faculty List</h2>

<table>

<thead>

<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Designation</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{faculty.map(f=>(
<tr key={f.faculty_id}>

<td>{f.faculty_name}</td>
<td>{f.email}</td>
<td>{f.phone}</td>
<td>{f.designation}</td>

<td>

<button
className="edit-btn"
onClick={()=>setEditFaculty(f)}
>
Edit
</button>

<button
className="delete-btn"
onClick={()=>deleteFaculty(f.faculty_id)}
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>


{/* EDIT MODAL */}

{editFaculty && (

<div className="modal-overlay">

<div className="modal-content">

<h3>Edit Faculty</h3>

<label>Name</label>
<input
name="faculty_name"
value={editFaculty.faculty_name}
onChange={handleChange}
/>

<label>Email</label>
<input
name="email"
value={editFaculty.email}
onChange={handleChange}
/>

<label>Phone</label>
<input
name="phone"
value={editFaculty.phone}
onChange={handleChange}
/>

<label>Designation</label>
<select
name="designation"
value={editFaculty.designation}
onChange={handleChange}
>
<option>Professor</option>
<option>Associate Professor</option>
<option>Assistant Professor</option>
<option>Lecturer</option>
<option>Lab Instructor</option>
</select>

<div className="modal-buttons">

<button onClick={updateFaculty}>
Update
</button>

<button onClick={()=>setEditFaculty(null)}>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

);

}

export default FacultyList;