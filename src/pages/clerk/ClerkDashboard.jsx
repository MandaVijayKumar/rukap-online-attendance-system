import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ClerkSidebar from "../../components/ClerkSidebar";
import axios from "axios";

import "./ClerkDashboard.css";   // ✅ NEW CLEAN CSS

import StudentRegistration from "./StudentRegistration";
import StudentList from "./StudentList";
import FacultyRegistration from "./FacultyRegistration";
import FacultyList from "./FacultyList";
import SubjectManagement from "./SubjectManagement";
import SubjectStudentMapping from "./SubjectStudentMapping";
import SubjectStudentMappingView from "./SubjectStudentMappingView";
import ChangePassword from "../faculty/ChangePassword";
import ChangePasswordModal from "./ChangePasswordModal";
// import AddStudentsToMapping from "./AddStudentsToMapping";

function ClerkDashboard() {

    const [activeTab, setActiveTab] = useState("home");
    const [department, setDepartment] = useState("");
    const [loading, setLoading] = useState(true);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    useEffect(() => {

        const deptId = localStorage.getItem("dept_id");

        if (deptId) {
            axios
                .get(`https://rukap.edu.in/attendance-api/department/${deptId}`)
                .then(res => {
                    setDepartment(res.data.dept_name);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }

    }, []);

    /* Render Content */

    const renderContent = () => {

        switch (activeTab) {

            case "student Registration":
                return <StudentRegistration />;

            case "student List":
                return <StudentList />;

            case "faculty":
                return <FacultyRegistration />;

            case "faculty List":
                return <FacultyList />;

            case "subjects":
                return <SubjectManagement />;

            case "view-mappings":
                return <SubjectStudentMappingView />;

            case "attendance":
                return <SubjectStudentMapping />;
            case "change-password":
                setOpenPasswordModal(true);
                return null;
            // case "add-students":
            // return <AddStudentsToMapping/>;

            default:
                return (
                    <div className="clerk-home">
                        <h2>Department Staff Dashboard</h2>

                        <p>Welcome to Department Attendance Management System.</p>

                        <h3>📘 How to Use Attendance System</h3>

                        <ol className="instructions-list">

                            <li>
                                <strong>Register Students:</strong>
                                Go to <b>Student Registration</b> and add all student details.
                            </li>

                            <li>
                                <strong>Register Faculty:</strong>
                                Go to <b>Faculty Registration</b> and add all faculty members in the department.
                            </li>

                            <li>
                                <strong>Create Subjects:</strong>
                                <ul>
                                    <li>Select Course, Course Type, Semester</li>
                                    <li>Create Theory and Lab subjects separately</li>
                                    <li>Select Section (A, B, C, D or "No Section")</li>
                                    <li>Assign Faculty to each subject</li>
                                </ul>
                            </li>

                            <li>
                                <strong>Create Attendance & Map Students:</strong>
                                <ul>
                                    <li>Go to <b>Create Attendance</b></li>
                                    <li>Select Course, Course Type, Semester, Academic Year, Section</li>
                                    <li>Select Subject and click <b>Load Students</b></li>
                                    <li>Click <b>Map Subject to Students</b></li>
                                    <li>Repeat for all subjects</li>
                                </ul>
                            </li>

                            <li>
                                <strong>View & Manage Data:</strong>
                                Use <b>Student List</b>, <b>Faculty List</b>, and <b>View Mappings</b> to edit or delete records.
                            </li>

                            <li>
                                <strong>Handle Late Student Entries:</strong>
                                <ul>
                                    <li>Go to <b>Create Attendance</b></li>
                                    <li>Select same Course, Semester, Academic Year, Section</li>
                                    <li>Load students</li>
                                    <li>Click <b>Add</b> for newly registered students</li>
                                    <li>Repeat for all subjects</li>
                                </ul>
                            </li>

                        </ol>

                    </div>
                );

        }

    };

    return (

        <div className="clerk-dashboard">

            <Navbar />

            <div className="clerk-dashboard-body">

                <ClerkSidebar setActiveTab={setActiveTab} />

                <div className="clerk-dashboard-content">

                    {loading ? (
                        <h2>Loading...</h2>
                    ) : (
                        <h2 className="dept-title">
                            Department of {department} - Staff Dashboard
                        </h2>
                    )}

                    {renderContent()}

                </div>

            </div>
            <ChangePasswordModal
                open={openPasswordModal}
                handleClose={() => setOpenPasswordModal(false)}
            />
        </div>

    )

}

export default ClerkDashboard;