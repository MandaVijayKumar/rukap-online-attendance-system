import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
   Container,
   Typography,
   Button,
   Grid,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Card,
   CardContent,
   ToggleButtonGroup,
   ToggleButton,
   Box,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   List,
   ListItem,
   ListItemText
} from "@mui/material";

import FacultyNavbar from "./FacultyNavbar";

function FacultyAttendance() {

   const token = localStorage.getItem("token");
   const faculty_id = localStorage.getItem("faculty_id");
   const dept_id = localStorage.getItem("dept_id");
   const college_id = localStorage.getItem("college_id");

   const [subjects, setSubjects] = useState([]);
   const [students, setStudents] = useState([]);
   const [selectedSubject, setSelectedSubject] = useState(null);
   const [period, setPeriod] = useState("");
   const [attendance, setAttendance] = useState({});
   const [openPreview, setOpenPreview] = useState(false);
   const [openInstructions, setOpenInstructions] = useState(false);
   const today = new Date().toISOString().split("T")[0];

   const navigate = useNavigate();

   /* =========================
      LOAD FACULTY SUBJECTS
   ========================= */

   useEffect(() => {

      axios.get(
         `https://rukap.edu.in/attendance-api/faculty-subjects/${faculty_id}`,
         {
            headers: { Authorization: `Bearer ${token}` }
         }
      )
         .then(res => {
            setSubjects(res.data);
         })
         .catch(err => {
            alert(err.response?.data?.message || "Error loading subjects");
         });

   }, [faculty_id]);


   /* =========================
      LOAD STUDENTS
   ========================= */

   const loadStudents = (subject) => {

      setSelectedSubject(subject);

      axios.get(
         `https://rukap.edu.in/attendance-api/subject-students/${subject.subject_id}`,
         {
            params: {
               course_id: subject.course_id,
               semester: subject.semester,
               academic_year: subject.academic_year,
               section: subject.section
            },
            headers: { Authorization: `Bearer ${token}` }
         }
      )
         .then(res => {

            setStudents(res.data);

            const initial = {};

            res.data.forEach(student => {
               initial[student.student_id] = "Present";
            });

            setAttendance(initial);

         })
         .catch(err => {
            alert(err.response?.data?.message || "Error loading students");
         });

   };


   /* =========================
      TOGGLE ATTENDANCE
   ========================= */

   const handleToggle = (studentId, value) => {

      if (!value) return;

      setAttendance(prev => ({
         ...prev,
         [studentId]: value
      }));

   };


   /* =========================
      SUMMARY
   ========================= */

   const totalStudents = students.length;

   const totalPresent = Object.values(attendance)
      .filter(v => v === "Present").length;

   const totalAbsent = totalStudents - totalPresent;


   /* =========================
      OPEN PREVIEW
   ========================= */

   const submitAttendance = () => {

      if (!period) {
         alert("Please select period");
         return;
      }

      if (!selectedSubject) {
         alert("Please select subject");
         return;
      }

      setOpenPreview(true);

   };


   /* =========================
      CONFIRM SUBMIT
   ========================= */

   const confirmSubmit = () => {

      const records = students.map(student => ({

         student_id: student.student_id,
         subject_id: selectedSubject.subject_id,
         faculty_id: faculty_id,

         course_id: selectedSubject.course_id,
         semester: selectedSubject.semester,
         academic_year: selectedSubject.academic_year,
         section: selectedSubject.section,

         dept_id: dept_id,
         college_id: college_id,

         attendance_date: today,
         period: period,

         status: attendance[student.student_id]

      }));

      axios.post(
         "https://rukap.edu.in/attendance-api/submit-attendance",
         { records },
         {
            headers: { Authorization: `Bearer ${token}` }
         }
      )
         .then(res => {
            alert(res.data.message);
            setOpenPreview(false);
         })
         .catch(err => {
            alert(err.response?.data?.message || "Attendance submission failed");
         });

   };


   /* =========================
      LOAD EXISTING ATTENDANCE
   ========================= */

   const loadExistingAttendance = () => {

      if (!selectedSubject || !period) {
         alert("Select subject and period");
         return;
      }

      axios.get(
         `https://rukap.edu.in/attendance-api/attendance/${selectedSubject.subject_id}/${period}`,
         {
            params: {
               course_id: selectedSubject.course_id,
               semester: selectedSubject.semester,
               academic_year: selectedSubject.academic_year,
               section: selectedSubject.section
            },
            headers: { Authorization: `Bearer ${token}` }
         }
      )
         .then(res => {

            const records = res.data;

            setStudents(records);

            const updated = {};

            records.forEach(student => {
               updated[student.student_id] = student.status;
            });

            setAttendance(updated);

         })
         .catch(err => {
            alert(err.response?.data?.message || "No attendance found");
         });

   };


   /* =========================
      LOGOUT
   ========================= */

   const handleLogout = () => {

      localStorage.clear();
      navigate("/");

   };


   return (

      <>
         <FacultyNavbar />

         <Container maxWidth="md" sx={{ mt: 4 }}>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>

               <Typography variant="h4">
                  Faculty Attendance Dashboard
               </Typography>

               <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setOpenInstructions(true)}
               >
                  View Instructions
               </Button>

            </Box>


            {/* =========================
   SUBJECT LIST
========================= */}

            <Typography variant="h6">Your Subjects</Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>

               {subjects.map(subject => (

                  <Grid item xs={12} sm={6} key={subject.subject_id}>

                     <Button
                        fullWidth
                        onClick={() => loadStudents(subject)}
                        sx={{
                           textAlign: "left",
                           p: 2,
                           border: "1px solid #e0e0e0",
                           borderRadius: 2,

                           backgroundColor:
                              selectedSubject?.subject_id === subject.subject_id
                                 ? "#e8f5e9"
                                 : "#fafafa",

                           color: "#333",

                           "&:hover": {
                              backgroundColor:
                                 selectedSubject?.subject_id === subject.subject_id
                                    ? "#dff3e3"
                                    : "#f5f5f5"
                           }
                        }}
                     >

                        <Box>

                           <Typography sx={{ fontWeight: "bold" }}>
                              {subject.subject_name} ({subject.subject_type})
                           </Typography>

                           <Typography variant="body2">
                              Course: {subject.course_name} ({subject.course_type})
                           </Typography>

                           <Typography variant="body2">
                              Semester: {subject.semester}
                           </Typography>

                           <Typography variant="body2">
                              Section: {subject.section || "No Section"}
                           </Typography>

                           <Typography variant="body2">
                              Academic Year: {subject.academic_year}
                           </Typography>

                        </Box>

                     </Button>

                  </Grid>

               ))}

            </Grid>


            {/* =========================
   SUBJECT DETAILS
========================= */}

            {selectedSubject && (

               <Box sx={{ mb: 3, p: 2, background: "#f5f5f5", borderRadius: 2 }}>

                  <Typography><b>Subject:</b> {selectedSubject.subject_name}</Typography>

                  <Typography><b>Course:</b> {selectedSubject.course_name}</Typography>

                  <Typography><b>Semester:</b> {selectedSubject.semester}</Typography>

                  <Typography><b>Section:</b> {selectedSubject.section || "No Section"}</Typography>

                  <Typography><b>Academic Year:</b> {selectedSubject.academic_year}</Typography>

               </Box>

            )}


            {/* =========================
   PERIOD SELECT
========================= */}

            {selectedSubject && (

               <FormControl fullWidth sx={{ mb: 3 }}>

                  <InputLabel>Select Period</InputLabel>

                  <Select
                     value={period}
                     label="Select Period"
                     onChange={(e) => setPeriod(e.target.value)}
                  >

                     <MenuItem value="">Select Period</MenuItem>

                     <MenuItem value="P1">P1 (10:00 - 11:00)</MenuItem>
                     <MenuItem value="P2">P2 (11:00 - 12:00)</MenuItem>
                     <MenuItem value="P3">P3 (12:00 - 01:00)</MenuItem>

                     <MenuItem disabled>
                        Lunch Break
                     </MenuItem>

                     <MenuItem value="P4">P4 (02:00 - 03:00)</MenuItem>
                     <MenuItem value="P5">P5 (03:00 - 04:00)</MenuItem>
                     <MenuItem value="P6">P6 (04:00 - 05:00)</MenuItem>

                  </Select>

               </FormControl>

            )}


            {/* =========================
   STUDENT LIST
========================= */}

            {students.map(student => (

               <Card key={student.student_id} sx={{ mb: 2 }}>

                  <CardContent>

                     <Typography variant="subtitle1">
                        {student.roll_number} - {student.student_name}
                     </Typography>

                     <ToggleButtonGroup
                        exclusive
                        value={attendance[student.student_id]}
                        onChange={(e, val) => handleToggle(student.student_id, val)}
                        sx={{ mt: 1 }}
                     >

                        <ToggleButton value="Present" color="success">
                           Present
                        </ToggleButton>

                        <ToggleButton value="Absent" color="error">
                           Absent
                        </ToggleButton>

                     </ToggleButtonGroup>

                  </CardContent>

               </Card>

            ))}


            {/* =========================
   SUMMARY
========================= */}

            {students.length > 0 && (

               <Box sx={{ mt: 3, p: 2, background: "#e3f2fd", borderRadius: 2 }}>

                  <Typography><b>Total Students:</b> {totalStudents}</Typography>
                  <Typography><b>Present:</b> {totalPresent}</Typography>
                  <Typography><b>Absent:</b> {totalAbsent}</Typography>

               </Box>

            )}


            {/* =========================
   SUBMIT BUTTON
========================= */}

            {students.length > 0 && (

               <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={submitAttendance}
               >

                  Submit Attendance

               </Button>

            )}


            {/* =========================
   PREVIEW MODAL
========================= */}

            <Dialog open={openPreview} maxWidth="sm" fullWidth>

               <DialogTitle>
                  Attendance Preview
               </DialogTitle>

               <DialogContent>

                  <Typography sx={{ mb: 2 }}>
                     <b>Subject:</b> {selectedSubject?.subject_name}
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                     <b>Period:</b> {period}
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                     Total: {totalStudents} | Present: {totalPresent} | Absent: {totalAbsent}
                  </Typography>

                  <List>

                     {students.map(student => (

                        <ListItem key={student.student_id}>

                           <ListItemText
                              primary={`${student.roll_number} - ${student.student_name}`}
                              secondary={
                                 <Typography
                                    sx={{
                                       color: attendance[student.student_id] === "Absent"
                                          ? "error.main"
                                          : "success.main",
                                       fontWeight: "bold"
                                    }}
                                 >
                                    Status: {attendance[student.student_id]}
                                 </Typography>
                              }
                           />

                        </ListItem>

                     ))}

                  </List>

               </DialogContent>

               <DialogActions>

                  <Button
                     onClick={() => setOpenPreview(false)}
                     color="error"
                  >
                     Cancel
                  </Button>

                  <Button
                     variant="contained"
                     onClick={confirmSubmit}
                  >
                     Confirm Submit
                  </Button>

               </DialogActions>

            </Dialog>
            <Dialog open={openInstructions} onClose={() => setOpenInstructions(false)} maxWidth="md" fullWidth>

               <DialogTitle>📘 Attendance System Instructions</DialogTitle>

               <DialogContent dividers>

                  <Typography sx={{ mb: 2 }}>
                     Follow these steps to mark attendance:
                  </Typography>

                  <List>

                     <ListItem>
                        <ListItemText primary="1. After login, your subjects will be displayed as cards." />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="2. Each subject shows subject name, course, semester, academic year, type (Theory/Lab), and section." />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="3. Click on your subject to load student list." />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="4. Select the period (P1–P6):"
                           secondary="P1: 10–11 AM, P2: 11–12 PM, P3: 12–1 PM, Lunch Break, P4: 2–3 PM, P5: 3–4 PM, P6: 4–5 PM" />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="5. Mark attendance for each student:"
                           secondary="Default is Present. Change to Absent if needed." />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="6. Click 'Submit Attendance' after marking all students." />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="7. Preview will open. Verify details and click 'Confirm Submit'." />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="8. To check attendance records:"
                           secondary="Go to 'Attendance Report' from Navbar → Select Subject → Load Register → Export to Excel if needed." />
                     </ListItem>

                     <ListItem>
                        <ListItemText primary="9. Click Logout after completing your work." />
                     </ListItem>

                  </List>

               </DialogContent>

               <DialogActions>

                  <Button onClick={() => setOpenInstructions(false)}>
                     Close
                  </Button>

               </DialogActions>

            </Dialog>
         </Container>
      </>
   );

}

export default FacultyAttendance;