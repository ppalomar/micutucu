import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCollection,
  saveCollection,
  updateDocFromCollection,
  removeDocFromCollection,
} from "../services/db";

// Create the context
const BookContext = createContext();

// Provider component
export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all books from Firestore
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const booksSnapshot = await getCollection("books");
      setBooks(booksSnapshot);
      setError(null);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Add a new book
  const addBook = async (book) => {
    setLoading(true);
    try {
      const documentId = await saveCollection("books", book);
      setBooks([...books, { documentId, ...book }]);
      return { success: true, documentId };
    } catch (err) {
      console.error("Error adding book:", err);
      setError("Failed to add book");
      return { success: false, error: "Failed to add book" };
    } finally {
      setLoading(false);
    }
  };

  // Update book(s)
  const updateBooks = async (booksToUpdate) => {
    setLoading(true);
    try {
      const updatedBooks = [];
      const promises = booksToUpdate.map(async (book) => {
        // We don't want to save the documentId in the db
        const { documentId, ...bookData } = book;
        await updateDocFromCollection("books", documentId, bookData);
        updatedBooks.push(book);
      });

      await Promise.all(promises);

      // Update local state
      const updateIds = booksToUpdate.map((b) => b.id);
      const restOfBooks = books.filter((b) => !updateIds.includes(b.id));
      setBooks([...restOfBooks, ...updatedBooks]);

      return { success: true };
    } catch (err) {
      console.error("Error updating books:", err);
      setError("Failed to update books");
      return { success: false, error: "Failed to update books" };
    } finally {
      setLoading(false);
    }
  };

  // Remove a book
  const removeBook = async (documentId) => {
    setLoading(true);
    try {
      await removeDocFromCollection("books", documentId);
      setBooks(books.filter((book) => book.documentId !== documentId));
      return { success: true };
    } catch (err) {
      console.error("Error removing book:", err);
      setError("Failed to remove book");
      return { success: false, error: "Failed to remove book" };
    } finally {
      setLoading(false);
    }
  };

  // Reset books (unassign)
  const resetBooks = async (booksToReset) => {
    const newBooks = booksToReset?.map((b) => ({
      ...b,
      assigned: null,
    }));

    return await updateBooks(newBooks);
  };

  // Get books for a specific classroom
  const getClassroomBooks = (classroomId) => {
    return books.filter((book) => book.classroomId === classroomId);
  };

  // Initial fetch
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        fetchBooks,
        addBook,
        updateBooks,
        removeBook,
        resetBooks,
        getClassroomBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

// Custom hook to use the book context
export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
};
