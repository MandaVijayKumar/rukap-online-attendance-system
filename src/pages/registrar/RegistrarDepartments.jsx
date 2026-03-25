import React,{useEffect,useState} from "react";
import axios from "axios";

function RegistrarDepartments(){

const token = localStorage.getItem("token");

const [records,setRecords] = useState([]);
const [courses,setCourses] = useState([]);
const [academicYears,setAcademicYears] = useState([]);

const [filters,setFilters] = useState({
course_id:"",
course_type:"",
semester:"",
academic_year:"",
section:""
});


/* =========================
LOAD ALL COURSES
========================= */

useEffect(()=>{

axios.get(`https://rukap.edu.in/attendance-api/courses-all`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setCourses(res.data))
.catch(()=>alert("Error loading courses"));

},[token]);


/* =========================
LOAD DATA (DEFAULT ALL)
========================= */

const loadData = ()=>{

const cleanParams = Object.fromEntries(
Object.entries(filters).filter(([_,v]) => v !== "")
);

axios.get("https://rukap.edu.in/attendance-api/registrar-course-summary",{
params: cleanParams,
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setRecords(res.data))
.catch(()=>alert("Error loading data"));

};

useEffect(()=>{
loadData();
},[]);


/* =========================
HANDLE CHANGE
========================= */

const handleChange = (e)=>{

const {name,value} = e.target;

let updated = {...filters,[name]:value};

if(name==="course_type"){

let duration = 0;

if(value==="UG") duration=3;
if(value==="PG") duration=2;
if(value==="BTech") duration=4;
if(value==="MTech") duration=2;

const startYears = [2024,2025,2026,2027,2028,2029];

let years = startYears.map(start=>`${start}-${start+duration}`);

setAcademicYears(years);

updated.academic_year="";
}

setFilters(updated);

};


/* =========================
GROUP BY COURSE
========================= */

const courseGroups = records.reduce((acc,r)=>{
if(!acc[r.course_name]){
acc[r.course_name]=[];
}
acc[r.course_name].push(r);
return acc;
},{});


/* =========================
UI
========================= */

return(

<div style={{padding:"20px"}}>

<h2>University Course Attendance Summary</h2>


{/* ========================= FILTERS ========================= */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:"10px",
marginBottom:"20px"
}}>

<select name="course_id" value={filters.course_id} onChange={handleChange}>
<option value="">All Courses</option>

{courses
.filter(c=>!filters.course_type || c.course_type===filters.course_type)
.map(c=>(
<option key={c.course_id} value={c.course_id}>
{c.course_name}
</option>
))}

</select>


<select name="course_type" value={filters.course_type} onChange={handleChange}>
<option value="">Course Type</option>
<option value="UG">UG</option>
<option value="PG">PG</option>
<option value="BTech">BTech</option>
<option value="MTech">MTech</option>
</select>


<select name="semester" value={filters.semester} onChange={handleChange}>
<option value="">All Semester</option>
{[1,2,3,4,5,6].map(s=>(
<option key={s} value={s}>{s}</option>
))}
</select>


<select name="academic_year" value={filters.academic_year} onChange={handleChange}>
<option value="">Academic Year</option>

{academicYears.map((year,i)=>(
<option key={i} value={year}>{year}</option>
))}

</select>


<select name="section" value={filters.section} onChange={handleChange}>
<option value="">All Sections</option>
<option value="NULL">No Section</option>
<option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
<option value="D">D</option>
</select>


<button onClick={loadData}>
Search
</button>

</div>


{/* ========================= EMPTY STATE ========================= */}

{records.length === 0 && (
<p style={{color:"red"}}>No data available</p>
)}




{Object.keys(courseGroups).map(course=>(

<div key={course} style={{
background:"white",
padding:"20px",
marginBottom:"20px",
borderRadius:"10px",
boxShadow:"0 3px 8px rgba(0,0,0,0.1)"
}}>

<h3 style={{marginBottom:"10px"}}>{course}</h3>

<div style={{overflowX:"auto"}}>

<table border="1" width="100%" cellPadding="8">

<thead style={{background:"#1976d2",color:"white"}}>
<tr>
<th>Course</th>
<th>Type</th>
<th>College</th>
<th>Department</th>
<th>Semester</th>
<th>Academic Year</th>
<th>Section</th>
<th>Date</th>
<th>Subject</th>
<th>Faculty</th>
<th>Period</th>
<th>Present</th>
<th>Absent</th>
</tr>
</thead>

<tbody>

{courseGroups[course].map((r,index)=>(

<tr key={index}>

<td>{r.course_name}</td>
<td>{r.course_type}</td>
<td>{r.college_name}</td>
<td>{r.dept_name}</td>

<td>{r.semester}</td>
<td>{r.academic_year}</td>
<td>{r.section || "No Section"}</td>

<td>
{new Date(r.attendance_date).toLocaleDateString("en-IN")}
</td>

<td>{r.subject_name}</td>

<td style={{fontWeight:"bold"}}>
{r.faculty_name}
</td>

<td>{r.period}</td>

<td style={{color:"green",fontWeight:"bold"}}>
{r.present}
</td>

<td style={{color:"red",fontWeight:"bold"}}>
{r.absent}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

))}

</div>

);

}

export default RegistrarDepartments;