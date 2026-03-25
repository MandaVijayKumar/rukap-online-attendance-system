import React from "react";
import "./ClerkSidebar.css";

/* React Icons */
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaClipboardList,FaKey } from "react-icons/fa";
import { MdDashboard, MdViewList, MdPlaylistAdd } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";

function ClerkSidebar({ setActiveTab }) {

  return (
    <div className="clerk-sidebar">

      <h3 className="sidebar-title">Department Staff</h3>

      <ul className="sidebar-menu">

        <li onClick={() => setActiveTab("student Registration")}>
          <AiOutlineUserAdd className="menu-icon" />
          Student Registration
        </li>

        <li onClick={() => setActiveTab("student List")}>
          <FaUserGraduate className="menu-icon" />
          Student List
        </li>

        <li onClick={() => setActiveTab("faculty")}>
          <FaChalkboardTeacher className="menu-icon" />
          Faculty Registration
        </li>

        <li onClick={() => setActiveTab("faculty List")}>
          <MdViewList className="menu-icon" />
          Faculty List
        </li>

        <li onClick={() => setActiveTab("subjects")}>
          <FaBook className="menu-icon" />
          Create Subject
        </li>

        <li onClick={() => setActiveTab("attendance")}>
          <FaClipboardList className="menu-icon" />
          Create Attendance
        </li>

        <li onClick={() => setActiveTab("view-mappings")}>
          <MdDashboard className="menu-icon" />
          View Mappings
        </li>
        <li onClick={() => setActiveTab("change-password")}>
          <FaKey className="menu-icon" />
          Change Password
        </li>
        {/* <li onClick={() => setActiveTab("add-students")}>
          <MdPlaylistAdd className="menu-icon" />
          Add Students
        </li> */}

      </ul>

    </div>
  );
}

export default ClerkSidebar;