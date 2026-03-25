import React from "react";
import { useNavigate } from "react-router-dom";
import "./RuNavbar.css";   // ✅ NEW CSS

function Navbar(){

const navigate = useNavigate();
const role = localStorage.getItem("role");

const handleLogout = ()=>{
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};

return(

<div className="ru-navbar">

  {/* LEFT SECTION */}
  <div className="ru-navbar-left">

    <img
      src="/logo.png"
      alt="RU Logo"
      className="ru-navbar-logo"
    />

    <div className="ru-navbar-title">
      <h3>Rayalaseema University</h3>
      <span className="ru-system-title">
        Attendance Management System
      </span>
    </div>

  </div>

  {/* RIGHT SECTION */}
  <div className="ru-navbar-right">

    <div className="ru-role-box">
      <span className="ru-role-label">Logged in as</span>
      <span className="ru-user-role">{role}</span>
    </div>

    <button
      className="ru-logout-btn"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>

</div>

);

}

export default Navbar;