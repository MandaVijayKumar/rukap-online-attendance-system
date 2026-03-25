import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentList.css";

function StudentList() {

const [students,setStudents] = useState([]);
const [editStudent,setEditStudent] = useState(null);

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");


/* LOAD STUDENTS */

const fetchStudents = () => {

axios.get(
`https://rukap.edu.in/attendance-api/students/${dept_id}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
)
.then(res=>{
setStudents(res.data);
})
.catch(()=>{
alert("Error loading students");
});

};

useEffect(()=>{
fetchStudents();
},[]);


/* DELETE STUDENT */

const deleteStudent=(id)=>{

if(!window.confirm("Delete this student?")) return;

axios.delete(
`https://rukap.edu.in/attendance-api/students/${id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{
alert(res.data.message);
fetchStudents();
})
.catch(()=>{
alert("Delete failed");
});

};


/* EDIT CHANGE */

const handleEditChange=(e)=>{

setEditStudent({
...editStudent,
[e.target.name]:e.target.value
});

};


/* UPDATE STUDENT */

const updateStudent=()=>{

axios.put(
`https://rukap.edu.in/attendance-api/students/${editStudent.student_id}`,
editStudent,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{
alert(res.data.message);
setEditStudent(null);
fetchStudents();
})
.catch(()=>{
alert("Update failed");
});

};


return(

<div className="student-container">

<h2>Department Students</h2>

<table>

<thead>

<tr>
<th>Roll</th>
<th>Name</th>
<th>Course</th>
<th>Section</th>
<th>Course Type</th>
<th>Academic Year</th>
<th>Gender</th>
<th>Phone</th>
<th>Email</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{students.map(student=>(

<tr key={student.student_id}>

<td>{student.roll_number}</td>
<td>{student.student_name}</td>
<td>{student.course_name}</td>
<td>{student.section || "No Section"}</td>
<td>{student.course_type}</td>
<td>{student.academic_year}</td>
<td>{student.gender}</td>
<td>{student.phone_number}</td>
<td>{student.email}</td>

<td>

<button
className="edit-btn"
onClick={()=>setEditStudent(student)}
>
Edit
</button>

<button
className="delete-btn"
onClick={()=>deleteStudent(student.student_id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>


{/* EDIT MODAL */}

{editStudent &&(

<div className="modal-overlay">

<div className="modal-content">

<h3>Edit Student</h3>

<label>Name</label>
<input
name="student_name"
value={editStudent.student_name}
onChange={handleEditChange}
/>

<label>Gender</label>
<select
name="gender"
value={editStudent.gender}
onChange={handleEditChange}
>
<option value="Male">Male</option>
<option value="Female">Female</option>
<option value="Other">Other</option>
</select>

<label>Section</label>
<select
name="section"
value={editStudent.section || ""}
onChange={handleEditChange}
>
<option value="">No Section</option>
<option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
<option value="D">D</option>
</select>

<label>Academic Year</label>
<input
name="academic_year"
value={editStudent.academic_year}
onChange={handleEditChange}
/>

<label>Phone</label>
<input
name="phone_number"
value={editStudent.phone_number}
onChange={handleEditChange}
/>

<label>Email</label>
<input
name="email"
value={editStudent.email}
onChange={handleEditChange}
/>

<label>Course Type</label>
<select
name="course_type"
value={editStudent.course_type}
onChange={handleEditChange}
>
<option value="UG">UG</option>
<option value="PG">PG</option>
<option value="BTech">BTech</option>
<option value="MTech">MTech</option>
<option value="PhD">PhD</option>
</select>

<div className="modal-buttons">

<button className="update-btn" onClick={updateStudent}>
Update
</button>

<button className="cancel-btn" onClick={()=>setEditStudent(null)}>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

);

}

export default StudentList;