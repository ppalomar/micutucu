// src/components/BookList.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useModal,
  useBook,
  useStudent,
  useClassroom,
  useRound,
} from "../context";
import RemovePopup from "./RemovePopup";
import NewCyclePopup from "./NewCyclePopup";

const BookList = () => {
  // Get state and functions from context hooks
  const { modal } = useModal();
  const { openRemovePopup, toggleRemovePopup, toggleNewCyclePopup } = modal;

  const { updateBooks, removeBook, getClassroomBooks, removeClassroomBooks } =
    useBook();
  const { getClassroomStudents } = useStudent();
  const { selectedClassroom } = useClassroom();
  const { removeRounds } = useRound();

  // Local state for the book selected for removal
  const [selectedBook, setSelectedBook] = useState(null);

  // Get books and students for the selected classroom
  const classroomBooks = selectedClassroom
    ? getClassroomBooks(selectedClassroom.id)
    : [];
  const classroomStudents = useMemo(
    () => (selectedClassroom ? getClassroomStudents(selectedClassroom.id) : []),
    [getClassroomStudents, selectedClassroom]
  );

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

  // Handler for starting a new book cycle
  const handleStartNewCycle = async () => {
    if (selectedClassroom) {
      // First remove all rounds
      const roundsResult = await removeRounds();
      if (!roundsResult.success) {
        console.error("Failed to remove rounds:", roundsResult.error);
        return;
      }

      // Then remove all books for the classroom
      const booksResult = await removeClassroomBooks(selectedClassroom.id);
      if (!booksResult.success) {
        console.error("Failed to remove books:", booksResult.error);
      }
    }
  };

  // Clear selected book when popup closes
  useEffect(() => {
    if (!openRemovePopup) {
      setSelectedBook(null);
    }
  }, [openRemovePopup]);

  // Get owner name for a book
  const { t } = useTranslation();
  
  const getOwnerName = useCallback(
    (ownerId) => {
      return (
        classroomStudents?.find((s) => s.id === ownerId)?.name || t('book.unknownOwner')
      );
    },
    [classroomStudents, t]
  );

  // Handle book removal
  const handleRemoveBook = async () => {
    if (selectedBook) {
      if (classroomBooks.length === 1) {
        const roundsResult = await removeRounds();
        if (!roundsResult.success) {
          console.error("Failed to remove rounds:", roundsResult.error);
          return;
        }
      }
      await removeBook(selectedBook.documentId);
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
                <div>{t('book.notAvailable')}</div>
                <span
                  title={t('book.notAvailableTooltip')}
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
              {t('book.owner')}: {getOwnerName(book.owner)}
            </div>
            <div className="list-item-delete">
              <span
                title={t('book.deleteTitle')}
                className="material-symbols-rounded"
                onClick={(event) => handleDeleteClick(event, book)}
              >
                delete
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <button
          onClick={toggleNewCyclePopup}
          disabled={!selectedClassroom || sortedBooks.length === 0}
        >
          {t('book.startNewCycle')}
        </button>
      </div>
      {selectedBook && (
        <RemovePopup
          open={openRemovePopup}
          onClose={toggleRemovePopup}
          onRemove={handleRemoveBook}
          message={t('book.deleteConfirmation', { bookName: selectedBook.name, classroomName: selectedClassroom?.name })}
        />
      )}
      {selectedClassroom && (
        <NewCyclePopup
          onConfirm={handleStartNewCycle}
          message={t('book.newCycleConfirmation', { classroomName: selectedClassroom?.name })}
        />
      )}
    </div>
  );
};

export default React.memo(BookList);
