// src/components/BookList.js
import React, { useState } from "react";
import { useApp } from "../context";
import RemovePopup from "./RemovePopup";

const BookList = ({
  books,
  // students,
  updateBooks,
  removeBook,
  selectedClassroom,
}) => {
  const { modal } = useApp();
  const { open, toggle: toggleRemovePopup } = modal;

  const sortedBooks = books.sort((a, b) => a.name.localeCompare(b.name));

  // const getStudentName = (id) => {
  //   const student = students.find((std) => std.id === id);
  //   return student ? student.name : "Unknown Owner";
  // };

  const handleAvailabilityOnClick = (book) => {
    updateBooks([{ ...book, available: !book.available }]);
  };

  const [selectedBook, setSelectedBook] = useState(null);

  const handleDeleteClick = (event, book) => {
    event.stopPropagation();
    setSelectedBook(book);
    toggleRemovePopup();
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedBook(null);
    }
  }, [open]);

  return (
    <div>
      <div className="list-div">
        {sortedBooks.map((book) => (
          <div
            className={`list-item book ${
              book.available ? "available" : "not-available"
            }`}
            key={book.id}
            onClick={() => handleAvailabilityOnClick(book)}
          >
            <div className="book-display">
              <span className="material-symbols-rounded">menu_book</span>
              <div className="book-name">{book.name}</div>
              {/* {book.assigned && (
                <>
                  <span title="Assigned" className="material-symbols-rounded">
                    assignment_ind
                  </span>
                  <div className="book-assigned">
                    {getStudentName(book.assigned)}
                  </div>
                </>
              )} */}
            </div>
            <div className="list-item-delete">
              <span
                title="Delete book"
                className="material-symbols-rounded"
                onClick={(event) => handleDeleteClick(event, book)}
              >
                delete
              </span>
            </div>
          </div>
        ))}
      </div>
      {selectedBook && (
        <RemovePopup
          open={open}
          onClose={toggleRemovePopup}
          onRemove={() => removeBook({ documentId: selectedBook.documentId })}
          message={`Are you sure you want to remove ${selectedBook.name} from ${selectedClassroom?.name}?`}
        />
      )}
    </div>
  );
};

export default BookList;
