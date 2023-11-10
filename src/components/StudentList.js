// src/components/StudentList.js
import React from 'react';

const StudentList = ({ students, classrooms }) => {
  return (
    <div>
      <h2>Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{`${student.name} - ${getClassroomName(student.classroomId, classrooms)}`}</li>
        ))}
      </ul>
    </div>
  );
};

// Helper function to get the name of the classroom based on its ID
const getClassroomName = (classroomId, classrooms) => {
  const classroom = classrooms.find((cls) => cls.id === classroomId);
  return classroom ? classroom.name : 'Unknown Classroom';
};

export default StudentList;