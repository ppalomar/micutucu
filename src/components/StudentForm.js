// src/components/StudentForm.js
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useStudent, useClassroom } from "../context";

const StudentForm = () => {
  const { t } = useTranslation();
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

  const isAddButtonDisabled = !studentName || !selectedClassroom;

  return (
    <div>
      <h2>{t('student.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 10, marginRight: 20 }}>
            <input
              type="text"
              placeholder={t('student.name')}
              name="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div style={{ flex: 2 }}>
            <button disabled={isAddButtonDisabled} type="submit">
              {t('student.add')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
