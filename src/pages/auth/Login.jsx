import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(){

const navigate = useNavigate();

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const handleLogin = async (e) => {

e.preventDefault();

try{

const res = await axios.post("https://rukap.edu.in/attendance-api/login",{
 username,
 password
});

localStorage.setItem("token",res.data.token);
localStorage.setItem("role",res.data.role);
localStorage.setItem("username",res.data.username);
localStorage.setItem("dept_id",res.data.dept_id);
localStorage.setItem("faculty_id",res.data.faculty_id);
localStorage.setItem("college_id",res.data.college_id);

/* Role based navigation */

const role = res.data.role;

if(role === "Faculty"){
 navigate("/faculty-dashboard");
}

else if(role === "Department Clerk"){
 navigate("/clerk-dashboard");
}

else if(role === "Admin"){
 navigate("/admin-dashboard");
}

else if(role === "HOD"){
 navigate("/hod-dashboard");
}

else if(role === "University Principal"){
 navigate("/university-principal-dashboard");
}

else if(role === "Engineering Principal"){
 navigate("/engineering-principal-dashboard");
}

else if(role === "Registrar"){
 navigate("/registrar-dashboard");
}

else if(role === "Vice Chancellor"){
 navigate("/vc-dashboard");
}

else{
 navigate("/dashboard");
}

}catch(err){

alert("Invalid username or password");

}

};

return(

<div className="login-page">

<header className="login-header">

<img src="/logo.png" alt="RU Logo" className="login-logo"/>

<div>
<h1>Rayalaseema University</h1>
<p>Attendance Management System</p>
</div>

</header>

<div className="login-container">

<div className="login-card">

<h2>Authorized Login Portal</h2>

<p className="login-note">
For Higher Authorities, Faculty, Department Staff.
</p>

<form onSubmit={handleLogin}>

<div className="form-group">
<label>Username</label>
<input
type="text"
value={username}
onChange={(e)=>setUsername(e.target.value)}
placeholder="Enter Username"
required
/>
</div>

<div className="form-group">
<label>Password</label>
<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Enter Password"
required
/>
</div>

<button className="login-btn">Login</button>

</form>

</div>

</div>

<footer className="login-footer">
© 2026 Rayalaseema University
</footer>

</div>

)

}

export default Login;