import React, { useState } from "react";
import { useAppContext } from "../context";
import RemovePopup from "./RemovePopup";

const BookList = ({
  books,
  updateBooks,
  removeBook,
  selectedClassroom,
  students,
}) => {
  const { modal } = useAppContext();
  const { openRemovePopup, toggleRemovePopup } = modal;

  const sortedBooks = books.sort((a, b) => a.name.localeCompare(b.name));

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
    if (!openRemovePopup) {
      setSelectedBook(null);
    }
  }, [openRemovePopup]);

  const getOwnerName = React.useCallback(
    (ownerId) => {
      return students?.find((s) => s.id === ownerId)?.name;
    },
    [students]
  );

  const getStudentBooks = React.useCallback(
    (studentId) => {
      return books.filter((b) => b.owner === studentId);
    },
    [books]
  );

  return (
    <div>
      <div className="list-div">
        {sortedBooks.map((book) => {
          const studentBooks = getStudentBooks(book.owner);
          const booksCount = studentBooks?.length || 0;

          return (
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
                <div className={`book-owner ${booksCount > 1 && "error"}`}>
                  Owner: {getOwnerName(book.owner)}
                </div>
                {!book.available && (
                  <div className="book-not-available">
                    <div>Not Available</div>
                    <div>
                      <span
                        title="The student didn't return the book. She/he will NOT receive book in the next generated round"
                        className="material-symbols-rounded"
                      >
                        info
                      </span>
                    </div>
                  </div>
                )}
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
          );
        })}
      </div>
      {selectedBook && (
        <RemovePopup
          open={openRemovePopup}
          onClose={toggleRemovePopup}
          onRemove={() => removeBook({ documentId: selectedBook.documentId })}
          message={`Are you sure you want to remove ${selectedBook.name} from ${selectedClassroom?.name}?`}
        />
      )}
    </div>
  );
};

export default BookList;
