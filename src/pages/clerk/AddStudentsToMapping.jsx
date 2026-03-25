import React,{useEffect,useState} from "react";
import axios from "axios";

function AddStudentsToMapping(){

const token = localStorage.getItem("token");
const dept_id = localStorage.getItem("dept_id");
const college_id = localStorage.getItem("college_id");

const [courses,setCourses] = useState([]);
const [subjects,setSubjects] = useState([]);
const [students,setStudents] = useState([]);

const [filters,setFilters] = useState({
course_id:"",
course_type:"",
semester:"",
academic_year:"",
section:"",
subject_id:""
});


/* =========================
LOAD COURSES
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/courses/${dept_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setCourses(res.data));

},[dept_id]);


/* =========================
LOAD SUBJECTS
========================= */

useEffect(()=>{

if(
filters.course_id &&
filters.semester &&
filters.academic_year
){

axios.get("https://rukap.edu.in/attendance-api/subjects-filter",{
params:{
course_id:filters.course_id,
semester:filters.semester,
course_type:filters.course_type,
academic_year:filters.academic_year,
section:filters.section || null
},
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setSubjects(res.data));

}

},[filters]);


/* =========================
LOAD MAPPED STUDENTS
========================= */

const loadMappedStudents = ()=>{

axios.get("https://rukap.edu.in/attendance-api/mapping-students",{
params:{
subject_id:filters.subject_id,
course_id:filters.course_id,
semester:filters.semester,
academic_year:filters.academic_year,
section:filters.section || null
},
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setStudents(res.data))
.catch(()=>alert("Error loading mapped students"));

};


/* =========================
ADD NEW STUDENTS
========================= */

const addNewStudents = ()=>{

axios.post("https://rukap.edu.in/attendance-api/add-new-students-to-mapping",{

subject_id:filters.subject_id,
course_id:filters.course_id,
semester:filters.semester,
academic_year:filters.academic_year,
section:filters.section || null,
dept_id:dept_id,
college_id:college_id

},{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
alert(res.data.message);
loadMappedStudents(); // refresh
})
.catch(()=>alert("Error adding new students"));

};


/* =========================
HANDLE CHANGE
========================= */

const handleChange = (e)=>{
const {name,value} = e.target;

setFilters(prev=>({
...prev,
[name]:value
}));
};


return(

<div style={{padding:"20px"}}>

<h2>Add Students to Existing Mapping</h2>

{/* FILTERS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:"10px",
marginBottom:"20px"
}}>

<select name="course_id" onChange={handleChange}>
<option value="">Select Course</option>
{courses.map(c=>(
<option key={c.course_id} value={c.course_id}>
{c.course_name}
</option>
))}
</select>

<select name="course_type" onChange={handleChange}>
<option value="">Course Type</option>
<option value="UG">UG</option>
<option value="PG">PG</option>
<option value="BTech">BTech</option>
<option value="MTech">MTech</option>
</select>

<select name="semester" onChange={handleChange}>
<option value="">Semester</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
</select>

<select name="academic_year" onChange={handleChange}>
<option value="">Academic Year</option>
<option value="2024-2026">2024-2026</option>
<option value="2025-2027">2025-2027</option>
<option value="2026-2028">2026-2028</option>
</select>

<select name="section" onChange={handleChange}>
<option value="">No Section</option>
<option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
<option value="D">D</option>
</select>

<select name="subject_id" onChange={handleChange}>
<option value="">Select Subject</option>
{subjects.map(s=>(
<option key={s.subject_id} value={s.subject_id}>
{s.subject_name}
</option>
))}
</select>

<button onClick={loadMappedStudents}>
Load Mapping
</button>

</div>


{/* BUTTON */}

<button
onClick={addNewStudents}
style={{
marginBottom:"20px",
background:"#28a745",
color:"white",
padding:"10px 20px",
border:"none",
cursor:"pointer"
}}
>
Add Newly Registered Students
</button>


{/* TABLE */}

<table border="1" width="100%" cellPadding="10">

<thead>
<tr>
<th>Roll</th>
<th>Name</th>
</tr>
</thead>

<tbody>

{students.length===0 ? (
<tr>
<td colSpan="2">No mapped students</td>
</tr>
) : (

students.map(s=>(
<tr key={s.student_id}>
<td>{s.roll_number}</td>
<td>{s.student_name}</td>
</tr>
))

)}

</tbody>

</table>

</div>

);

}

export default AddStudentsToMapping;