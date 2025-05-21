// src/components/BookForm.js
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useBook, useStudent, useClassroom } from "../context";

const BookForm = () => {
  const { t } = useTranslation();
  // Get data and functions from context hooks
  const { addBook, getClassroomBooks } = useBook();
  const { getClassroomStudents } = useStudent();
  const { selectedClassroom } = useClassroom();

  // Local state for form
  const [bookName, setBookName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  // Get classroom-specific data
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];
  const classroomBooks = selectedClassroom
    ? getClassroomBooks(selectedClassroom.id)
    : [];

  // Filter students who don't own a book yet
  const studentsAreNotOwnersYet = classroomStudents.filter(
    (s) => !classroomBooks.map((b) => b.owner).includes(s.id)
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedStudent") {
      setSelectedStudent(Number(value));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookName && selectedStudent && selectedClassroom) {
      const book = {
        id: new Date().getTime(),
        name: bookName,
        owner: selectedStudent,
        assigned: null,
        available: true,
        classroomId: selectedClassroom.id,
      };
      addBook(book);
      setBookName("");
      setSelectedStudent("");
    }
  };

  const isAddButtonDisabled = !bookName || !selectedStudent;

  return (
    <div className="book-header">
      <h2>
        {t('book.title')}{" "}
        <span
          className="material-symbols-rounded"
          style={{ cursor: "default" }}
          title={t('book.infoTooltip')}
        >
          info
        </span>
        <span className="book-header-info">
          {t('book.infoTooltip')}
        </span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 7, marginRight: 20 }}>
            <input
              type="text"
              placeholder={t('book.titlePlaceholder')}
              name="bookName"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>
          <div style={{ flex: 4, marginRight: 16 }}>
            <select
              value={selectedStudent}
              onChange={handleChange}
              name="selectedStudent"
            >
              <option value="" disabled>
                {t('book.selectOwner')}
              </option>
              {studentsAreNotOwnersYet.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <button disabled={isAddButtonDisabled} type="submit">
              {t('book.add')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
