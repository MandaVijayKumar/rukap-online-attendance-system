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
CircularProgress,
Chip
} from "@mui/material";

function RegistrarSubjectSummary(){

const token = localStorage.getItem("token");

const [data,setData] = useState([]);
const [loading,setLoading] = useState(true);

/* ================= LOAD DATA ================= */

useEffect(()=>{

axios.get("https://rukap.edu.in/attendance-api/registrar-subject-summary",{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
setData(res.data);
setLoading(false);
})
.catch(()=>{
alert("Error loading data");
setLoading(false);
});

},[]);


/* ================= GROUP BY COURSE ================= */

const grouped = data.reduce((acc,item)=>{
if(!acc[item.course_name]){
acc[item.course_name]=[];
}
acc[item.course_name].push(item);
return acc;
},{});


/* ================= UI ================= */

return(

<Box p={3}>

<Typography variant="h5" fontWeight="bold" mb={3}>

</Typography>

{loading ? (

<Box textAlign="center" mt={5}>
<CircularProgress/>
</Box>

) : data.length === 0 ? (

<Typography color="error">No data available</Typography>

) : (

Object.keys(grouped).map(course=>{

const records = grouped[course];

return(

<Card
key={course}
sx={{
mb:3,
borderRadius:3,
boxShadow:3
}}
>

{/* ===== HEADER ===== */}

<Box
sx={{
background:"#0d47a1",
color:"#fff",
px:2,
py:1.5,
display:"flex",
justifyContent:"space-between"
}}
>

<Typography fontWeight="bold">
{course}
</Typography>

<Typography variant="body2">
Total Subjects: {records.length}
</Typography>

</Box>

<CardContent sx={{p:0}}>

<TableContainer component={Paper} sx={{maxHeight:400}}>

<Table stickyHeader size="small">

{/* ===== TABLE HEADER ===== */}

<TableHead>
<TableRow>

{[
"Subject",
"Type",
"Faculty",
"Course Type",
"Semester",
"Academic Year",
"Classes",
"Students"
].map((head,index)=>(

<TableCell
key={index}
sx={{
background:"#0d47a1",
color:"#fff",
fontWeight:"bold",
fontSize:"13px",
textTransform:"uppercase"
}}
>
{head}
</TableCell>

))}

</TableRow>
</TableHead>


{/* ===== TABLE BODY ===== */}

<TableBody>

{records.map((r,index)=>(

<TableRow
key={index}
sx={{
background:index%2===0 ? "#fafafa" : "#fff",
"&:hover":{background:"#eef5ff"}
}}
>

{/* SUBJECT */}
<TableCell>
<Typography fontWeight="500">
{r.subject_name}
</Typography>
</TableCell>

{/* SUBJECT TYPE */}
<TableCell>
<Chip
label={r.subject_type}
size="small"
sx={{
background: r.subject_type==="Lab" ? "#ffebee" : "#e3f2fd",
color: r.subject_type==="Lab" ? "#c62828" : "#0d47a1",
fontWeight:"bold"
}}
/>
</TableCell>

{/* FACULTY */}
<TableCell>
<Typography fontWeight="bold">
{r.faculty_name || "Not Assigned"}
</Typography>
</TableCell>

{/* COURSE TYPE */}
<TableCell>
<Chip
label={r.course_type}
size="small"
sx={{background:"#f5f5f5"}}
/>
</TableCell>

{/* SEMESTER */}
<TableCell>{r.semester}</TableCell>

{/* ACADEMIC YEAR */}
<TableCell>{r.academic_year}</TableCell>

{/* TOTAL CLASSES */}
<TableCell>
<Chip
label={r.total_classes}
size="small"
sx={{background:"#e3f2fd",color:"#1565c0"}}
/>
</TableCell>

{/* TOTAL STUDENTS */}
<TableCell>
<Chip
label={r.total_students}
size="small"
sx={{background:"#e8f5e9",color:"#2e7d32"}}
/>
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

export default RegistrarSubjectSummary;