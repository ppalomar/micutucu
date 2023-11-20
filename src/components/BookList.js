// src/components/BookList.js
import React from "react";

const BookList = ({ books, students, updateBooks, removeBook }) => {
  const handleOnClick = (book) => {
    updateBooks([{ ...book, available: !book.available }]);
  };

  const sortedBooks = books.sort((a, b) => a.name.localeCompare(b.name));

  const getStudentName = (id) => {
    const student = students.find((std) => std.id === id);
    return student ? student.name : "Unknown Owner";
  };

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
            <div className="book-display">
              <div className="book-name">{book.name}</div>
              {book.assigned && (
                <div className="book-assigned">
                  Assigned: {getStudentName(book.assigned)}
                </div>
              )}
              <div className="book-owner">
                Owner: {getStudentName(book.owner)}
              </div>
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

export default BookList;
