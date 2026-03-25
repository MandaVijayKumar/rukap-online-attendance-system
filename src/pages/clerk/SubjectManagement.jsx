import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SubjectManagement.css";

function SubjectManagement(){

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");

const [courses,setCourses] = useState([]);
const [faculty,setFaculty] = useState([]);
const [subjects,setSubjects] = useState([]);
const [collegeId,setCollegeId] = useState("");

const [academicYears,setAcademicYears] = useState([]);

const [subject,setSubject] = useState({
subject_name:"",
subject_type:"",
course_type:"",
academic_year:"",
semester:"",
course_id:"",
faculty_id:"",
section:""
});


/* =========================
   HANDLE INPUT CHANGE
========================= */

const handleChange = (e)=>{

const {name,value} = e.target;

let updated = {
...subject,
[name]:value
};

/* Generate Academic Years */

if(name === "course_type"){

let duration = 0;

if(value === "UG") duration = 3;
if(value === "PG") duration = 2;
if(value === "BTech") duration = 4;
if(value === "MTech") duration = 2;

const startYears = [2024,2025,2026,2027,2028,2029];

const years = startYears.map(start=>{
const end = start + duration;
return `${start}-${end}`;
});

setAcademicYears(years);

}

setSubject(updated);

};


/* =========================
   LOAD COLLEGE
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/department/${dept_id}`)
.then(res=>{
setCollegeId(res.data.college_id);
})
.catch(err=>console.log(err));

},[dept_id]);


/* =========================
   LOAD COURSES
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/courses/${dept_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setCourses(res.data))
.catch(err=>console.log(err));

},[dept_id]);


/* =========================
   LOAD FACULTY
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/faculty-list/${dept_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setFaculty(res.data))
.catch(err=>console.log(err));

},[dept_id]);


/* =========================
   LOAD SUBJECTS
========================= */

const fetchSubjects = ()=>{

axios.get(`https://rukap.edu.in/attendance-api/subjects/${dept_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setSubjects(res.data))
.catch(err=>console.log(err));

};

useEffect(()=>{
fetchSubjects();
},[]);


/* =========================
   SUBMIT SUBJECT
========================= */

const handleSubmit = (e)=>{

e.preventDefault();

axios.post(
"https://rukap.edu.in/attendance-api/register-subject",
{
...subject,
dept_id: dept_id,
college_id: collegeId
},
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{
alert(res.data.message);
fetchSubjects();

setSubject({
subject_name:"",
subject_type:"",
course_type:"",
academic_year:"",
semester:"",
course_id:"",
faculty_id:"",
section:""
});

})
.catch(err=>{
alert(err.response?.data?.message || "Error creating subject");
});

};


/* =========================
   DELETE SUBJECT
========================= */

const deleteSubject = (id)=>{

if(!window.confirm("Delete subject?")) return;

axios.delete(
`https://rukap.edu.in/attendance-api/subjects/${id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(()=>{
fetchSubjects();
})
.catch(err=>console.log(err));

};


return(

<div className="subject-container">

<h2>Subject Management</h2>

<form onSubmit={handleSubmit}>

<input
name="subject_name"
placeholder="Subject Name"
value={subject.subject_name}
onChange={handleChange}
/>


<label>Subject Type</label>
<select
name="subject_type"
value={subject.subject_type}
onChange={handleChange}
>
<option value="">Select Type</option>
<option value="Theory">Theory</option>
<option value="Lab">Lab</option>
</select>


<label>Course Type</label>
<select
name="course_type"
value={subject.course_type}
onChange={handleChange}
>
<option value="">Select Course Type</option>
<option value="UG">UG</option>
<option value="PG">PG</option>
<option value="BTech">BTech</option>
<option value="MTech">MTech</option>
</select>


<label>Academic Year</label>
<select
name="academic_year"
value={subject.academic_year}
onChange={handleChange}
>
<option value="">Select Academic Year</option>

{academicYears.map((year,index)=>(
<option key={index} value={year}>
{year}
</option>
))}

</select>


<label>Course</label>
<select
name="course_id"
value={subject.course_id}
onChange={handleChange}
>
<option value="">Select Course</option>

{courses.map(c=>(
<option key={c.course_id} value={c.course_id}>
{c.course_name}
</option>
))}

</select>


<label>Semester</label>
<select
name="semester"
value={subject.semester}
onChange={handleChange}
>
<option value="">Select Semester</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>
<option value="8">8</option>
</select>


<label>Section</label>
<select
name="section"
value={subject.section}
onChange={handleChange}
>
<option value="">No Section</option>
<option value="A">Section A</option>
<option value="B">Section B</option>
<option value="C">Section C</option>
<option value="D">Section D</option>
</select>


<label>Faculty</label>
<select
name="faculty_id"
value={subject.faculty_id}
onChange={handleChange}
>
<option value="">Select Faculty</option>

{faculty.map(f=>(
<option key={f.faculty_id} value={f.faculty_id}>
{f.faculty_name}
</option>
))}

</select>


<button type="submit">
Add Subject
</button>

</form>


<table>

<thead>

<tr>
<th>Subject</th>
<th>Type</th>
<th>Course Type</th>
<th>Academic Year</th>
<th>Semester</th>
<th>Section</th>
<th>Course</th>
<th>Faculty</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{subjects.map(s=>(

<tr key={s.subject_id}>

<td>{s.subject_name}</td>
<td>{s.subject_type}</td>
<td>{s.course_type}</td>
<td>{s.academic_year}</td>
<td>{s.semester}</td>
<td>{s.section || "No Section"}</td>
<td>{s.course_name}</td>
<td>{s.faculty_name}</td>

<td>

<button
onClick={()=>deleteSubject(s.subject_id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default SubjectManagement;