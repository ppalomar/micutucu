// src/components/StudentForm.js
import React, { useState } from 'react';

const StudentForm = ({ students, classrooms, addStudent }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'selectedClassroom') {
      // Convert the selectedClassroom value to a number
      setSelectedClassroom(Number(value));
    } else {
      // Handle other form field changes
      // (e.g., studentName)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentName && selectedClassroom) {
      const student = {
        id: new Date().getTime(),
        name: studentName,
        classroomId: selectedClassroom, // Ensure it's a number
        position: students.length + 1,
      };
      addStudent(student);
      setStudentName('');
      setSelectedClassroom('');
    }
  };

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter student name"
          name="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <select
          value={selectedClassroom}
          onChange={handleChange}
          name="selectedClassroom" // Add the name attribute
        >
          <option value="" disabled>Select Classroom</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
          ))}
        </select>
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default StudentForm;
