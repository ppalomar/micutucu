// src/components/StudentList.js
import React, { useState } from "react";
import { useApp } from "../context";
import RemovePopup from "./RemovePopup";

const StudentList = ({ students, removeStudent }) => {
  const { modal } = useApp();
  const { open, toggle: toggleRemovePopup } = modal;

  const sortedStudents = students.sort((a, b) => a.name.localeCompare(b.name));

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    toggleRemovePopup();
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedStudent(null);
    }
  }, [open]);

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
              onClick={() => handleDeleteClick(student)}
            >
              delete
            </span>
          </div>
        </div>
      ))}
      {selectedStudent && (
        <RemovePopup
          open={open}
          onClose={toggleRemovePopup}
          onRemove={() =>
            removeStudent(selectedStudent.documentId, selectedStudent.id)
          }
          message={`Are you sure you want to remove ${selectedStudent.name} and the owned book?`}
        />
      )}
    </div>
  );
};

export default StudentList;
