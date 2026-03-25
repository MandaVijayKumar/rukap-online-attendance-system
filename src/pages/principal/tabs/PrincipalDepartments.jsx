import React,{useEffect,useState} from "react";
import axios from "axios";

import {
Box,
Typography,
Card,
CardContent,
Table,
TableHead,
TableRow,
TableCell,
TableBody,
TableContainer,
Paper,
Chip,
CircularProgress
} from "@mui/material";

function PrincipalDepartments(){

const token = localStorage.getItem("token");
const college_id = localStorage.getItem("college_id");

const [records,setRecords] = useState([]);
const [courses,setCourses] = useState([]);
const [academicYears,setAcademicYears] = useState([]);
const [loading,setLoading] = useState(true);

const [filters,setFilters] = useState({
course_id:"",
course_type:"",
semester:"",
academic_year:"",
section:""
});

/* ================= LOAD COURSES ================= */

useEffect(()=>{
axios.get(`https://rukap.edu.in/attendance-api/courses-by-college/${college_id}`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>setCourses(res.data))
.catch(()=>alert("Error loading courses"));
},[]);

/* ================= LOAD DATA ================= */

const loadData = ()=>{

setLoading(true);

axios.get("https://rukap.edu.in/attendance-api/principal-course-summary",{
params:{...filters,college_id},
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
setRecords(res.data);
setLoading(false);
})
.catch(()=>{
alert("Error loading data");
setLoading(false);
});

};

useEffect(()=>{ loadData(); },[]);

/* ================= HANDLE FILTER ================= */

const handleChange = (e)=>{

const {name,value} = e.target;
let updated = {...filters,[name]:value};

if(name==="course_type"){

let duration = value==="UG"?3:value==="PG"?2:value==="BTech"?4:2;

const startYears=[2024,2025,2026,2027,2028,2029];

setAcademicYears(startYears.map(start=>`${start}-${start+duration}`));

updated.academic_year="";
}

setFilters(updated);
};

/* ================= GROUP BY COURSE ================= */

const grouped = records.reduce((acc,r)=>{
if(!acc[r.course_name]) acc[r.course_name]=[];
acc[r.course_name].push(r);
return acc;
},{});

/* ================= UI ================= */

return(

<Box p={3}>

<Typography variant="h5" fontWeight="bold" mb={3}>
 Course Attendance Summary
</Typography>

{/* ================= FILTERS ================= */}

<Box
sx={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:2,
mb:3
}}
>

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
{academicYears.map((y,i)=>(
<option key={i}>{y}</option>
))}
</select>

<select name="section" value={filters.section} onChange={handleChange}>
<option value="">All Sections</option>
<option value="No Section">No Section</option>
<option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
</select>

<button onClick={loadData}>Search</button>

</Box>

{/* ================= DATA ================= */}

{loading ? (

<CircularProgress/>

) : Object.keys(grouped).length===0 ? (

<Typography color="error">No data available</Typography>

) : (

Object.keys(grouped).map(course=>{

const data = grouped[course];
const first = data[0];

return(

<Card key={course} sx={{mb:3,borderRadius:3,boxShadow:3}}>

{/* HEADER */}

<Box sx={{
background:"#0d47a1",
color:"#fff",
px:2,
py:1.5,
display:"flex",
justifyContent:"space-between"
}}>

<Typography fontWeight="bold">{course}</Typography>

<Typography variant="body2">
Sem {first.semester} | {first.academic_year} | Sec {first.section || "—"}
</Typography>

</Box>

<CardContent sx={{p:0}}>

<TableContainer component={Paper} sx={{maxHeight:400}}>

<Table stickyHeader size="small">

<TableHead>
<TableRow>

{[
    "Faculty",

"Subject",
"Type",
"Date",
"Period",
"Present",
"Absent"
].map((h,i)=>(
<TableCell key={i} sx={{
background:"#0d47a1",
color:"#fff",
fontWeight:"bold"
}}>
{h}
</TableCell>
))}

</TableRow>
</TableHead>

<TableBody>

{data.map((r,i)=>(

<TableRow key={i} sx={{
background:i%2===0?"#fafafa":"#fff",
"&:hover":{background:"#eef5ff"}
}}>
<TableCell>
<Typography fontWeight="bold">{r.faculty_name}</Typography>
</TableCell>


<TableCell>{r.subject_name}</TableCell>

<TableCell>
<Chip
label={r.subject_type || "Theory"}
size="small"
sx={{
background:r.subject_type==="Lab"?"#ffebee":"#e3f2fd",
color:r.subject_type==="Lab"?"#c62828":"#0d47a1"
}}
/>
</TableCell>

<TableCell>
{new Date(r.attendance_date).toLocaleDateString()}
</TableCell>

<TableCell>
<Chip label={r.period} size="small"/>
</TableCell>

<TableCell>
<Chip label={r.present} sx={{bgcolor:"#e8f5e9",color:"#2e7d32"}}/>
</TableCell>

<TableCell>
<Chip label={r.absent} sx={{bgcolor:"#ffebee",color:"#c62828"}}/>
</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</TableContainer>

</CardContent>

</Card>

);

})

)}

</Box>

);

}

export default PrincipalDepartments;