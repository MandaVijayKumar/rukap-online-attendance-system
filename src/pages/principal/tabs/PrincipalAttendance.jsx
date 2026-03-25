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

function PrincipalAttendance(){

const token = localStorage.getItem("token");
const college_id = localStorage.getItem("college_id");

const [records,setRecords] = useState([]);
const [loading,setLoading] = useState(true);

/* ================= LOAD DATA ================= */

const loadAttendance = () => {

axios.get(
`https://rukap.edu.in/attendance-api/principal-live-attendance/${college_id}`,
{
headers:{Authorization:`Bearer ${token}`}
}
)
.then(res=>{
setRecords(res.data);
setLoading(false);
})
.catch(()=>{
alert("Error loading attendance");
setLoading(false);
});

};

useEffect(()=>{

loadAttendance();

const interval = setInterval(()=>{
loadAttendance();
},5000);

return ()=>clearInterval(interval);

},[]);


/* ================= GROUP BY COURSE ================= */

const grouped = records.reduce((acc,item)=>{

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

) : Object.keys(grouped).length === 0 ? (

<Typography color="error">No attendance data available</Typography>

) : (

Object.keys(grouped).map(course=>{

const courseData = grouped[course];
const first = courseData[0];

return(

<Card key={course} sx={{mb:3,borderRadius:3,boxShadow:3}}>

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
Sem {first.semester} | {first.academic_year} | Sec {first.section || "—"}
</Typography>

</Box>

<CardContent sx={{p:0}}>

<TableContainer component={Paper} sx={{maxHeight:400}}>

<Table stickyHeader size="small">

{/* ===== HEADER ===== */}

<TableHead>
<TableRow>

{[

"Faculty",
"Subject",
"Type",
"Course Type",

"Period",
"Present",
"Absent"
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


{/* ===== BODY ===== */}

<TableBody>

{courseData.map((r,index)=>(

<TableRow
key={index}
sx={{
background:index%2===0 ? "#fafafa" : "#fff",
"&:hover":{background:"#eef5ff"}
}}
>



{/* FACULTY */}
<TableCell>
<Typography fontWeight="bold">
{r.faculty_name}
</Typography>
</TableCell>

{/* SUBJECT */}
<TableCell>{r.subject_name}</TableCell>

{/* SUBJECT TYPE */}
<TableCell>
<Chip
label={r.subject_type || "Theory"}
size="small"
sx={{
background: r.subject_type==="Lab" ? "#ffebee" : "#e3f2fd",
color: r.subject_type==="Lab" ? "#c62828" : "#0d47a1"
}}
/>
</TableCell>

{/* COURSE TYPE */}
<TableCell>
<Chip label={r.course_type} size="small" sx={{background:"#f5f5f5"}}/>
</TableCell>


{/* PERIOD */}
<TableCell>
<Chip label={r.period} size="small"/>
</TableCell>
{/* PRESENT */}
<TableCell>
<Chip
label={r.present}
size="small"
sx={{background:"#e8f5e9",color:"#2e7d32"}}
/>
</TableCell>

{/* ABSENT */}
<TableCell>
<Chip
label={r.absent}
size="small"
sx={{background:"#ffebee",color:"#c62828"}}
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

export default PrincipalAttendance;