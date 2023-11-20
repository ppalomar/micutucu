// src/components/StudentList.js
import React from "react";

const StudentList = ({ students, removeStudent }) => {
  const sortedStudents = students.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="list-div">
      {sortedStudents.map((student) => (
        <div className="list-item student" key={student.id}>
          <span class="material-symbols-rounded">person</span>
          <div>{student.name}</div>
          <div className="list-item-delete">
            <span
              title="Delete student"
              class="material-symbols-rounded"
              onClick={() => removeStudent(student.documentId, student.id)}
            >
              delete
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
