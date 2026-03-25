import React, { useState } from "react";
import {
AppBar,
Toolbar,
Typography,
Button,
Box,
IconButton,
Drawer,
List,
ListItem,
ListItemButton,
ListItemText,
Avatar
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

function FacultyNavbar(){

const navigate = useNavigate();

const username = localStorage.getItem("username");
const facultyName = localStorage.getItem("faculty_name");

const [openMenu,setOpenMenu] = useState(false);

const handleLogout = () => {

localStorage.clear();
navigate("/");

};

const toggleMenu = () => {
setOpenMenu(!openMenu);
};

return(

<>

<AppBar
position="static"
sx={{
background:"#0b3c5d",
boxShadow:"0 2px 6px rgba(0,0,0,0.2)",
borderBottom:"3px solid #ffc107"
}}
>

<Toolbar>

{/* MOBILE MENU ICON */}

<IconButton
color="inherit"
edge="start"
sx={{mr:2, display:{xs:"block", md:"none"}}}
onClick={toggleMenu}
>
<MenuIcon/>
</IconButton>


{/* LOGO + UNIVERSITY */}

<Box
sx={{
display:"flex",
alignItems:"center",
gap:1
}}
>

<img
src="/logo.png"
alt="RU Logo"
style={{height:40}}
/>

<Typography
variant="h6"
sx={{
fontWeight:600,
fontSize:{xs:"15px", md:"20px"}
}}
>
Rayalaseema University
</Typography>

</Box>


{/* SYSTEM TITLE */}

<Typography
sx={{
ml:2,
flexGrow:1,
display:{xs:"none", md:"block"},
fontSize:"14px",
opacity:0.9
}}
>
Attendance Management System
</Typography>


{/* DESKTOP RIGHT SIDE */}

<Box
sx={{
display:{xs:"none", md:"flex"},
alignItems:"center",
gap:3
}}
>

<Box sx={{display:"flex",alignItems:"center",gap:1}}>

<Avatar sx={{width:30,height:30}}>
{(facultyName || username)?.charAt(0)}
</Avatar>

<Typography sx={{fontWeight:"bold"}}>
{facultyName || username}
</Typography>

</Box>

<Button
color="inherit"
onClick={()=>navigate("/attendance-report")}
>
Attendance Report
</Button>
<Button
color="inherit"
onClick={()=>navigate("/change-password")}
>
Change Password
</Button>
<Button
color="inherit"
onClick={()=>navigate("/faculty-dashboard")}
>
faculty dashboard
</Button>

<Button
variant="contained"
sx={{
background:"#d32f2f",
"&:hover":{background:"#b71c1c"}
}}
onClick={handleLogout}
>
Logout
</Button>

</Box>

</Toolbar>

</AppBar>


{/* MOBILE DRAWER */}

<Drawer
anchor="left"
open={openMenu}
onClose={toggleMenu}
>

<Box sx={{width:250}}>

<List>

<ListItem>
<ListItemText
primary={`Welcome ${facultyName || username}`}
secondary="Faculty Portal"
/>
</ListItem>

<ListItem disablePadding>
<ListItemButton onClick={()=>navigate("/faculty-dashboard")}>
<ListItemText primary="Take Attendance"/>
</ListItemButton>
</ListItem>

<ListItem disablePadding>
<ListItemButton onClick={()=>navigate("/edit-attendance")}>
<ListItemText primary="Edit Attendance"/>
</ListItemButton>
</ListItem>

<ListItem disablePadding>
<ListItemButton onClick={()=>navigate("/attendance-report")}>
<ListItemText primary="Attendance Report"/>
</ListItemButton>
</ListItem>

<ListItem disablePadding>
<ListItemButton onClick={handleLogout}>
<ListItemText primary="Logout"/>
</ListItemButton>
</ListItem>

</List>

</Box>

</Drawer>

</>

);

}

export default FacultyNavbar;