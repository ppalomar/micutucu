// src/components/BookList.js
import React, { useState, useEffect, useCallback } from "react";
import { useModal, useBook, useStudent, useClassroom } from "../context";
import RemovePopup from "./RemovePopup";

const BookList = () => {
  // Get state and functions from context hooks
  const { modal } = useModal();
  const { openRemovePopup, toggleRemovePopup } = modal;

  const { books, updateBooks, removeBook, getClassroomBooks } = useBook();
  const { students, getClassroomStudents } = useStudent();
  const { selectedClassroom } = useClassroom();

  // Local state for the book selected for removal
  const [selectedBook, setSelectedBook] = useState(null);

  // Get books and students for the selected classroom
  const classroomBooks = selectedClassroom
    ? getClassroomBooks(selectedClassroom.id)
    : [];
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];

  // Sort books by name
  const sortedBooks = classroomBooks.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Toggle book availability when clicked
  const handleAvailabilityOnClick = (book) => {
    updateBooks([{ ...book, available: !book.available }]);
  };

  // Handle delete button click
  const handleDeleteClick = (event, book) => {
    event.stopPropagation();
    setSelectedBook(book);
    toggleRemovePopup();
  };

  // Clear selected book when popup closes
  useEffect(() => {
    if (!openRemovePopup) {
      setSelectedBook(null);
    }
  }, [openRemovePopup]);

  // Get owner name for a book
  const getOwnerName = useCallback(
    (ownerId) => {
      return (
        classroomStudents?.find((s) => s.id === ownerId)?.name || "Unknown"
      );
    },
    [classroomStudents]
  );

  // Handle book removal
  const handleRemoveBook = () => {
    if (selectedBook) {
      removeBook(selectedBook.documentId);
    }
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
            onClick={() => handleAvailabilityOnClick(book)}
          >
            {!book.available && (
              <div className="book-not-available">
                <div>Not Available</div>

                <span
                  title="The student didn't return the book. She/he will NOT receive book in the next generated round"
                  className="material-symbols-rounded"
                >
                  info
                </span>
              </div>
            )}
            <div className="book-display">
              <span className="material-symbols-rounded">menu_book</span>
              <div className="book-name">{book.name}</div>
            </div>

            <div className="book-owner">
              <span className="material-symbols-rounded">person</span>
              Owner: {getOwnerName(book.owner)}
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
          open={openRemovePopup}
          onClose={toggleRemovePopup}
          onRemove={handleRemoveBook}
          message={`Are you sure you want to remove ${selectedBook.name} from ${selectedClassroom?.name}?`}
        />
      )}
    </div>
  );
};

export default React.memo(BookList);
