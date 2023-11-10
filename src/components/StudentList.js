// src/components/StudentList.js
import React from "react";

const StudentList = ({ students }) => {
  return (
    <div className="list-div">
      {students.map((student) => (
        <div className="list-item" key={student.id}>
          {student.name}
        </div>
      ))}
    </div>
  );
};

export default StudentList;
