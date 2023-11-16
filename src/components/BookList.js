// src/components/BookList.js
import React from "react";

const BookList = ({ books, students, removeBook }) => {
  return (
    <div>
      <div className="list-div">
        {books.map((book) => (
          <div className="list-item" key={book.id}>
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
