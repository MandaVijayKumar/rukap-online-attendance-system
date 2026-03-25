import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubjectStudentMapping.css";

function SubjectStudentMapping() {

  const token = localStorage.getItem("token");
  const dept_id = localStorage.getItem("dept_id");
  const college_id = localStorage.getItem("college_id");

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [mappingStudents, setMappingStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [filters, setFilters] = useState({
    course_id: "",
    course_type: "",
    academic_year: "",
    semester: "",
    section: "",
    subject_id: ""
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD COURSES ================= */

  useEffect(() => {
    axios.get(`https://rukap.edu.in/attendance-api/courses/${dept_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCourses(res.data))
      .catch(() => alert("Error loading courses"));
  }, [dept_id, token]);

  /* ================= LOAD SUBJECTS ================= */

  useEffect(() => {
    if (filters.course_id && filters.course_type && filters.academic_year && filters.semester) {
      axios.get("https://rukap.edu.in/attendance-api/subjects-filter", {
        params: {
          course_id: filters.course_id,
          course_type: filters.course_type,
          academic_year: filters.academic_year,
          semester: filters.semester,
          section: filters.section || null
        },
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setSubjects(res.data))
        .catch(() => setSubjects([]));
    }
  }, [filters, token]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  /* ================= COURSE TYPE ================= */

  const handleCourseTypeChange = (e) => {
    const value = e.target.value;

    setFilters(prev => ({
      ...prev,
      course_type: value,
      academic_year: ""
    }));

    let duration = 0;

    if (value === "UG") duration = 3;
    if (value === "PG") duration = 2;
    if (value === "BTech") duration = 4;
    if (value === "MTech") duration = 2;

    const startYears = [2024, 2025, 2026, 2027, 2028, 2029];
    const years = startYears.map(start => `${start}-${start + duration}`);

    setAcademicYears(years);
  };

  /* ================= LOAD STUDENTS ================= */

  const loadStudents = () => {
    if (!filters.course_id || !filters.academic_year) {
      alert("Please select Course and Academic Year");
      return;
    }

    setLoading(true);

    axios.get("https://rukap.edu.in/attendance-api/students-filter", {
      params: {
        course_id: filters.course_id,
        academic_year: filters.academic_year,
        section: filters.section || undefined
      },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStudents(res.data))
      .catch(() => alert("Error loading students"))
      .finally(() => setLoading(false));
  };

  /* ================= SAVE MAPPING ================= */

  const saveMapping = () => {
    if (!filters.subject_id) {
      alert("Please select a Subject");
      return;
    }

    if (students.length === 0) {
      alert("No students found");
      return;
    }

    const records = students.map(s => ({
      subject_id: filters.subject_id,
      course_id: filters.course_id,
      semester: filters.semester,
      academic_year: filters.academic_year,
      section: filters.section || null,
      student_id: s.student_id,
      dept_id,
      college_id
    }));

    axios.post("https://rukap.edu.in/attendance-api/map-subject-students",
      { records },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        alert(res.data.message);
        setStudents([]);
      })
      .catch(err => {
        alert(err.response?.data?.message || "Mapping failed");
      });
  };

  /* ================= LOAD MAPPING STATUS ================= */

  const loadMappingStudents = () => {
    if (!filters.subject_id) {
      alert("Please select a Subject");
      return;
    }

    axios.get("https://rukap.edu.in/attendance-api/mapping-students-status", {
      params: {
        subject_id: filters.subject_id,
        course_id: filters.course_id,
        semester: filters.semester,
        academic_year: filters.academic_year,
        section: filters.section || null
      },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMappingStudents(res.data))
      .catch(() => alert("Error loading mapping data"));
  };

  /* ================= ADD SINGLE STUDENT ================= */

  const addStudent = (student_id) => {
    axios.post("https://rukap.edu.in/attendance-api/add-single-student-mapping", {
      subject_id: filters.subject_id,
      course_id: filters.course_id,
      semester: filters.semester,
      academic_year: filters.academic_year,
      section: filters.section || null,
      student_id,
      dept_id,
      college_id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        alert(res.data.message);
        loadMappingStudents();
      })
      .catch(err => {
        alert(err.response?.data?.message || "Error");
      });
  };

  /* ================= UI ================= */

  return (
    <div className="mapping-container">

      <h2>Subject to Student Mapping</h2>

      {/* FILTERS */}
      <div className="filters">

        <select name="course_id" value={filters.course_id} onChange={handleChange}>
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>

        <select name="course_type" value={filters.course_type} onChange={handleCourseTypeChange}>
          <option value="">Course Type</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="BTech">BTech</option>
          <option value="MTech">MTech</option>
        </select>

        <select name="academic_year" value={filters.academic_year} onChange={handleChange}>
          <option value="">Academic Year</option>
          {academicYears.map((y, i) => (
            <option key={i}>{y}</option>
          ))}
        </select>

        <select name="semester" value={filters.semester} onChange={handleChange}>
          <option value="">Semester</option>
          {[1, 2, 3, 4, 5, 6].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select name="section" value={filters.section} onChange={handleChange}>
          <option value="">No Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <select name="subject_id" value={filters.subject_id} onChange={handleChange}>
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        <button onClick={loadStudents}>Load Student List</button>
      </div>

      {/* STUDENTS */}
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Student Name</th>
          </tr>
        </thead>

        <tbody>
          {loading && <tr><td colSpan="2">Loading...</td></tr>}

          {!loading && students.length === 0 && (
            <tr><td colSpan="2">No students found</td></tr>
          )}

          {students.map(s => (
            <tr key={s.student_id}>
              <td>{s.roll_number}</td>
              <td>{s.student_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={saveMapping}>Save Mapping</button>

      {/* NEW STUDENTS */}
      <h3>Add Newly Registered Students</h3>

      <button onClick={loadMappingStudents}>Load All Students</button>

      <p>
        Total: {mappingStudents.length} | 
        Mapped: {mappingStudents.filter(s => s.status === "MAPPED").length} | 
        New: {mappingStudents.filter(s => s.status === "NEW").length}
      </p>

      <table>
        <thead>
          <tr>
            <th>Roll</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {mappingStudents.map(st => (
            <tr key={st.student_id}>
              <td>{st.roll_number}</td>
              <td>{st.student_name}</td>

              <td className={st.status === "MAPPED" ? "status-mapped" : "status-new"}>
                {st.status}
              </td>

              <td>
                {st.status === "NEW" && (
                  <button onClick={() => addStudent(st.student_id)}>
                    Add
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default SubjectStudentMapping;