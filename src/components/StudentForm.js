// src/components/StudentForm.js
import React, { useState } from "react";

const StudentForm = ({ students, selectedClassroom, addStudent }) => {
  const [studentName, setStudentName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName && selectedClassroom) {
      const student = {
        id: new Date().getTime(),
        name: studentName,
        classroomId: selectedClassroom?.id,
        position: students.length + 1,
      };
      addStudent(student);
      setStudentName("");
    }
  };

  return (
    <div>
      <h2>Students</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter student name"
          name="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default StudentForm;
