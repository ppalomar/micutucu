// src/components/StudentForm.js
import React, { useState } from "react";
import { useStudent, useClassroom } from "../context";

const StudentForm = () => {
  // Get data and functions from context hooks
  const { addStudent } = useStudent();
  const { selectedClassroom } = useClassroom();

  // Local state for the student name input
  const [studentName, setStudentName] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName && selectedClassroom) {
      const student = {
        id: new Date().getTime(), // Generate a unique ID
        name: studentName,
        classroomId: selectedClassroom.id,
      };
      addStudent(student);
      setStudentName(""); // Reset form after submission
    }
  };

  return (
    <div>
      <h2>Students</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 10, marginRight: 20 }}>
            <input
              type="text"
              placeholder="Enter student name"
              name="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div style={{ flex: 2 }}>
            <button type="submit">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
