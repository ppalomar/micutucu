// src/components/BookForm.js
import React, { useState } from "react";

const BookForm = ({ students, selectedClassroom, addBook }) => {
  const [bookName, setBookName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedStudent") {
      // Convert the selectedStudent value to a number
      setSelectedStudent(Number(value));
    } else {
      // Handle other form field changes
      // (e.g., bookName)
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
        prevAssigned: null,
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
        <input
          type="text"
          placeholder="Enter book name"
          name="bookName"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
        />
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
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default BookForm;
