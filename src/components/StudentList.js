// src/components/StudentList.js
import React from "react";

const StudentList = ({ students, removeStudent }) => {
  return (
    <div className="list-div">
      {students.map((student) => (
        <div className="list-item" key={student.id}>
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
