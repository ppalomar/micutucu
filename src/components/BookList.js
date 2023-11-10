// src/components/BookList.js
import React from 'react';

const BookList = ({ books, students }) => {
  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{`${book.name} - Owner: ${getOwnerName(book.owner, students)}`}</li>
        ))}
      </ul>
    </div>
  );
};

// Helper function to get the name of the owner based on the owner's ID
const getOwnerName = (ownerId, students) => {
  const student = students.find((std) => std.id === ownerId);
  return student ? student.name : 'Unknown Owner';
};

export default BookList;