import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SubjectStudentMappingView.css";

function SubjectStudentMappingView(){

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");

const [mappings,setMappings] = useState([]);
const [students,setStudents] = useState([]);
const [showModal,setShowModal] = useState(false);

const [loading,setLoading] = useState(false);
const [studentLoading,setStudentLoading] = useState(false);

const [selectedMapping,setSelectedMapping] = useState(null);


/* =========================
   LOAD MAPPINGS
========================= */

const fetchMappings=()=>{

setLoading(true);

axios.get(
`https://rukap.edu.in/attendance-api/subject-student-mapping/${dept_id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{
setMappings(res.data);
})
.catch(err=>{
alert(err.response?.data?.message || "Error loading mappings");
})
.finally(()=>{
setLoading(false);
});

};

useEffect(()=>{
fetchMappings();
},[]);


/* =========================
   VIEW STUDENTS
========================= */

const viewStudents=(m)=>{

setSelectedMapping(m);
setStudentLoading(true);

axios.get("https://rukap.edu.in/attendance-api/mapping-students",{

params:{
subject_id:m.subject_id,
course_id:m.course_id,
semester:m.semester,
academic_year:m.academic_year,
section:m.section
},

headers:{Authorization:`Bearer ${token}`}

})
.then(res=>{

setStudents(res.data);
setShowModal(true);

})
.catch(err=>{
alert(err.response?.data?.message || "Error loading students");
})
.finally(()=>{
setStudentLoading(false);
});

};


/* =========================
   DELETE MAPPING
========================= */

const deleteMapping=(m)=>{

if(!window.confirm("Are you sure you want to delete this mapping?")) return;

axios.delete("https://rukap.edu.in/attendance-api/delete-mapping",{

params:{
subject_id:m.subject_id,
course_id:m.course_id,
semester:m.semester,
academic_year:m.academic_year,
section:m.section
},

headers:{Authorization:`Bearer ${token}`}

})
.then(res=>{

alert(res.data.message);
fetchMappings();

})
.catch(err=>{
alert(err.response?.data?.message || "Delete failed");
});

};


/* =========================
   CLOSE MODAL
========================= */

const closeModal=()=>{
setShowModal(false);
setStudents([]);
setSelectedMapping(null);
};


return(

<div className="mapping-view-container">

<h2>Subject → Student Group Mapping</h2>

<table>

<thead>

<tr>
<th>Subject</th>
<th>Faculty</th>
<th>Course</th>
<th>Semester</th>
<th>Section</th>
<th>Academic Year</th>
<th>Total Students</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{loading && (
<tr>
<td colSpan="8">Loading mappings...</td>
</tr>
)}

{!loading && mappings.length===0 && (
<tr>
<td colSpan="8">No mappings found</td>
</tr>
)}

{mappings.map((m)=>(

<tr key={`${m.subject_id}-${m.course_id}-${m.semester}-${m.section}-${m.academic_year}`}>

<td>{m.subject_name} ({m.subject_type})</td>

<td>{m.faculty_name}</td>

<td>{m.course_name}</td>

<td>{m.semester}</td>

<td>{m.section || "None"}</td>

<td>{m.academic_year}</td>

<td>{m.total_students}</td>

<td>

<button
onClick={()=>viewStudents(m)}
disabled={studentLoading}
>
View
</button>

<button
onClick={()=>deleteMapping(m)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>


{/* =========================
   STUDENT LIST MODAL
========================= */}

{showModal && (

<div className="modal-overlay" onClick={closeModal}>

<div className="modal-content" onClick={(e)=>e.stopPropagation()}>

<h3>
Mapped Students  
<br/>
{selectedMapping && (
<span style={{fontSize:"14px",color:"#666"}}>
{selectedMapping.course_name} | Sem {selectedMapping.semester} | Section {selectedMapping.section || "None"}
</span>
)}
</h3>

<table>

<thead>
<tr>
<th>Roll No</th>
<th>Name</th>
</tr>
</thead>

<tbody>

{studentLoading && (
<tr>
<td colSpan="2">Loading students...</td>
</tr>
)}

{!studentLoading && students.length===0 && (
<tr>
<td colSpan="2">No students found</td>
</tr>
)}

{students.map(s=>(

<tr key={s.student_id}>
<td>{s.roll_number}</td>
<td>{s.student_name}</td>
</tr>

))}

</tbody>

</table>

<button onClick={closeModal}>
Close
</button>

</div>

</div>

)}

</div>

);

}

export default SubjectStudentMappingView;