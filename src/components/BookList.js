// src/components/BookList.js
import React from "react";

const BookList = ({ books, students, updateBook, removeBook }) => {
  const handleOnClick = (b) => {
    const { documentId, ...book } = b;
    updateBook(documentId, { ...book, available: !b.available });
  };

  const sortedBooks = books.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="list-div">
        {sortedBooks.map((book) => (
          <div
            className={`list-item book ${
              book.available ? "available" : "not-available"
            }`}
            key={book.id}
            onClick={() => handleOnClick(book)}
          >
            <div>
              {`${book.name} - Owner: ${getOwnerName(book.owner, students)}`}{" "}
            </div>
            <div className="list-item-delete">
              <span
                title="Delete book"
                class="material-symbols-rounded"
                onClick={() => removeBook({ documentId: book.documentId })}
              >
                delete
              </span>
            </div>
          </div>
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
