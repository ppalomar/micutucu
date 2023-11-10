// src/components/ClassroomList.js
import React from 'react';

const ClassroomList = ({ classrooms }) => {
  return (
    <div>
      <h2>Classrooms</h2>
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom.id}>{classroom.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassroomList;