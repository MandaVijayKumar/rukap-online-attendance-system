import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Footer from "../../components/Footer";

function Home() {

const navigate = useNavigate();

return(

<div className="home">

<header className="header">

<div className="header-left">

<img src="/logo.png" alt="logo" className="logo"/>

<div>

<h1>Rayalaseema University</h1>
<p className="subtitle">Attendance Management System</p>

</div>

</div>

</header>


<main className="main">

<div className="vc-card">

<img src="/vc.JPG" alt="VC" className="vc-img"/>

<h3 className="vc-name">Prof. V. Venkata Basava Rao</h3>

<p className="vc-designation">
Hon'ble Vice Chancellor<br/>
Rayalaseema University
</p>

<div className="gold-divider"></div>

<h2 className="message-title">
Message from Hon'ble Vice Chancellor
</h2>

<p className="vc-message">

Rayalaseema University is committed to academic excellence and
quality education. Our mission is to empower students with
knowledge, innovation and responsibility to contribute to society.
Through digital initiatives such as this Attendance Management
System, we aim to strengthen transparency, accountability and
academic discipline across all departments.

</p>

<button
className="vc-login-btn"
onClick={()=>navigate("/login")}
>

Login to Attendance System

</button>

</div>

</main>


<Footer/>

</div>

);

}

export default Home;