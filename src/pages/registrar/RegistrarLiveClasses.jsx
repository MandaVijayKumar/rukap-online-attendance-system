import React,{useEffect,useState} from "react";
import axios from "axios";

import {
Box,
Typography,
Card,
CardContent,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Paper,
CircularProgress,
Chip
} from "@mui/material";

function RegistrarLiveClasses(){

const token = localStorage.getItem("token");

const [classes,setClasses] = useState([]);
const [loading,setLoading] = useState(true);

/* ================= LOAD DATA ================= */

useEffect(()=>{

axios.get("https://rukap.edu.in/attendance-api/registrar-live-classes",{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>{
setClasses(res.data);
setLoading(false);
})
.catch(()=>{
alert("Error loading live classes");
setLoading(false);
});

},[token]);

/* ================= GROUP BY COURSE + SEM + SECTION ================= */

const grouped = classes.reduce((acc,cls)=>{

const key = `${cls.course_name}-${cls.semester}-${cls.academic_year}-${cls.section || "NA"}`;

if(!acc[key]){
acc[key]=[];
}
acc[key].push(cls);

return acc;

},{});

/* ================= UI ================= */

return(

<Box mt={4}>

<Typography variant="h5" fontWeight="bold" mb={2}>

</Typography>

{loading ? (

<Box textAlign="center" mt={4}>
<CircularProgress/>
</Box>

) : Object.keys(grouped).length === 0 ? (

<Typography>No classes today</Typography>

) : (

Object.keys(grouped).map(key=>{

const group = grouped[key];

group.sort((a,b)=>a.period.localeCompare(b.period));

const first = group[0];

return(

<Card
key={key}
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
justifyContent:"space-between",
alignItems:"center"
}}
>

<Typography fontWeight="bold">
{first.course_name}
</Typography>

<Typography variant="body2">
Sem {first.semester} | {first.academic_year} | Sec {first.section || "—"}
</Typography>

</Box>

<CardContent sx={{p:0}}>

<TableContainer component={Paper} sx={{maxHeight:400}}>

<Table stickyHeader size="small">

{/* ===== TABLE HEADER ===== */}

<TableHead>
<TableRow>

{[
"Course Type",
"Dept",
"Subject",
"Type",
"Faculty",
"Period",
"Section",
"Time",
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
textTransform:"uppercase",
borderBottom:"2px solid #1565c0"
}}
>
{head}
</TableCell>

))}

</TableRow>
</TableHead>


{/* ===== TABLE BODY ===== */}

<TableBody>

{group.map((cls,index)=>{

// const formattedTime = cls.time
// ? new Date(`1970-01-01T${cls.time}`).toLocaleTimeString("en-IN",{
// hour:"2-digit",
// minute:"2-digit"
// })
// : "-";
// const formattedTime = cls.time
//   ? new Date(`1970-01-01T${cls.time}`)
//       .toLocaleTimeString("en-IN", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true
//       })
//   : "-";
  const formattedTime = cls.time
  ? (() => {
      let [hour, minute] = cls.time.split(":").map(Number);

      // ADD 5 hours 30 minutes (IST correction)
      minute += 30;
      if (minute >= 60) {
        minute -= 60;
        hour += 1;
      }

      hour += 5;
      if (hour >= 24) hour -= 24;

      // Convert to 12-hour format
      const ampm = hour >= 12 ? "PM" : "AM";
      let h = hour % 12 || 12;

      return `${h}:${minute.toString().padStart(2, "0")} ${ampm}`;
    })()
  : "-";
return(

<TableRow
key={index}
sx={{
background:index%2===0 ? "#fafafa" : "#fff",
"&:hover":{background:"#eef5ff"}
}}
>

{/* COURSE TYPE */}
<TableCell>
<Chip
label={cls.course_type}
size="small"
sx={{background:"#e3f2fd",color:"#0d47a1"}}
/>
</TableCell>

{/* DEPT */}
<TableCell>{cls.dept_name}</TableCell>

{/* SUBJECT */}
<TableCell>
<Typography fontWeight="500">
{cls.subject_name}
</Typography>
</TableCell>

{/* SUBJECT TYPE */}
<TableCell>
<Chip
label={cls.subject_type}
size="small"
sx={{
background: cls.subject_type==="Lab" ? "#ffebee" : "#e3f2fd",
color: cls.subject_type==="Lab" ? "#c62828" : "#0d47a1"
}}
/>
</TableCell>

{/* FACULTY */}
<TableCell>{cls.faculty_name}</TableCell>

{/* PERIOD */}
<TableCell>
<Chip
label={cls.period}
size="small"
sx={{background:"#f5f5f5"}}
/>
</TableCell>

{/* SECTION */}
<TableCell>{cls.section || "—"}</TableCell>

{/* TIME */}
<TableCell>{formattedTime}</TableCell>

{/* PRESENT */}
<TableCell>
<Chip
label={cls.present}
size="small"
sx={{background:"#e8f5e9",color:"#2e7d32"}}
/>
</TableCell>

{/* ABSENT */}
<TableCell>
<Chip
label={cls.absent}
size="small"
sx={{background:"#ffebee",color:"#c62828"}}
/>
</TableCell>

</TableRow>

);

})}

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

export default RegistrarLiveClasses;
