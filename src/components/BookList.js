// src/components/BookList.js
import React from "react";

const BookList = ({ books, students }) => {
  return (
    <div>
      <div className="list-div">
        {books.map((book) => (
          <div className="list-item" key={book.id}>{`${
            book.name
          } - Owner: ${getOwnerName(book.owner, students)}`}</div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get the name of the owner based on the owner's ID
const getOwnerName = (ownerId, students) => {
  const student = students.find((std) => std.id === ownerId);
  return student ? student.name : "Unknown Owner";
};

export default BookList;
