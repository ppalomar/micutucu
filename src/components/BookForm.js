// src/components/BookForm.js
import React, { useState } from "react";

const BookForm = ({ students, selectedClassroom, addBook }) => {
  const [bookName, setBookName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedStudent") {
      setSelectedStudent(Number(value));
    } else {
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookName && selectedStudent) {
      const book = {
        id: new Date().getTime(),
        name: bookName,
        owner: selectedStudent,
        assigned: null,
        classroomId: selectedClassroom?.id,
      };
      addBook(book);
      setBookName("");
      setSelectedStudent("");
    }
  };

  return (
    <div>
      <h2>Books</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 7, marginRight: 20 }}>
            <input
              type="text"
              placeholder="Enter book name"
              name="bookName"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>
          <div style={{ flex: 4, marginRight: 16 }}>
            <select
              value={selectedStudent}
              onChange={handleChange}
              name="selectedStudent" // Add the name attribute
            >
              <option value="" disabled>
                Select Owner
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <button type="submit">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
