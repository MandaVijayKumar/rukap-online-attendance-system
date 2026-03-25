import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";

import ClerkDashboard from "./pages/clerk/ClerkDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VCDashboard from "./pages/vc/VCDashboard";
import RegistrarDashboard from "./pages/registrar/RegistrarDashboard";
import HodDashboard from "./pages/hod/HodDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import DepartmentAttendance from "./pages/clerk/DepartmentAttendance";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import EditAttendance from "./pages/faculty/EditAttendance";
import FacultyAttendanceReport from "./pages/faculty/FacultyAttendanceReport";
import HodStudentHistory from "./pages/hod/HodStudentHistory";
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import PrincipalFacultyReport from "./pages/principal/tabs/PrincipalFacultyReport";
import PrincipalStudentHistory from "./pages/principal/tabs/PrincipalStudentHistory";
import RegistrarStudentHistory from "./pages/registrar/RegistrarStudentHistory";
import RegistrarStudents from "./pages/registrar/RegistrarStudents";
import RegistrarFacultyReport from "./pages/registrar/RegistrarFacultyReport";
import ChangePassword from "./pages/faculty/ChangePassword";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/faculty-dashboard"
                    element={
                        <ProtectedRoute role="Faculty">
                            <FacultyAttendance />
                        </ProtectedRoute>
                    }
                />

                <Route path="/edit-attendance"
                    element={
                        <ProtectedRoute role="Faculty">
                            <EditAttendance />
                        </ProtectedRoute>}
                />
                <Route path="/attendance-report"
                    element={
                        <ProtectedRoute role="Faculty">
                            <FacultyAttendanceReport />
                        </ProtectedRoute>}
                />
                <Route path="/change-password"
                    element={
                        <ProtectedRoute role="Faculty">
                            <ChangePassword />
                        </ProtectedRoute>}
                />
                <Route path="/hod-student-history"
                    element={
                        <ProtectedRoute role="HOD">
                            <HodStudentHistory />
                        </ProtectedRoute>}
                />
                <Route
                    path="/university-principal-student-history"
                    element={
                        <ProtectedRoute roles={["University Principal"]}>
                            <PrincipalStudentHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/college-principal-student-history"
                    element={
                        <ProtectedRoute roles={["College Principal"]}>
                            <PrincipalStudentHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clerk-dashboard"
                    element={
                        <ProtectedRoute role="Department Clerk">
                            <ClerkDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/department-attendance"
                    element={
                        <ProtectedRoute role="Department Clerk">
                            <DepartmentAttendance />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute role="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/hod-dashboard"
                    element={
                        <ProtectedRoute role="HOD">
                            <HodDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/university-principal-dashboard"
                    element={
                        <ProtectedRoute role="University Principal">
                            <PrincipalDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/engineering-principal-dashboard"
                    element={
                        <ProtectedRoute role="Engineering Principal">
                            <PrincipalDashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/university-principal-faculty-report"
                    element={
                        <ProtectedRoute role="University Principal">
                            <PrincipalFacultyReport />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/engineering-principal-faculty-report"
                    element={
                        <ProtectedRoute role="Engineering Principal">
                            <PrincipalFacultyReport />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/registrar-dashboard"
                    element={
                        <ProtectedRoute role="Registrar">
                            <RegistrarDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/registrar-students"
                    element={<ProtectedRoute role="Registrar"><RegistrarStudents /></ProtectedRoute>}
                />
                <Route
                    path="/registrar-student-history"
                    element={<ProtectedRoute role="Registrar"><RegistrarStudentHistory /></ProtectedRoute  >}
                />
                <Route
                    path="/registrar-faculty-report"
                    element={<ProtectedRoute role="Registrar"><RegistrarFacultyReport /></ProtectedRoute>}
                />
                <Route
                    path="/vc-dashboard"
                    element={
                        <ProtectedRoute role="Vice Chancellor">
                            <VCDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    )

}

export default App;