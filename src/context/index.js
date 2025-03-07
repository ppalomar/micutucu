// src/context/index.js
import React from "react";
import { AppProvider as ModalProvider } from "./ModalContext";
import { BookProvider } from "./BookContext";
import { StudentProvider } from "./StudentContext";
import { ClassroomProvider } from "./ClassroomContext";
import { RoundProvider } from "./RoundContext";
import { AssignmentProvider } from "./AssignmentContext";

// Combine all providers
export const AppProvider = ({ children }) => {
  return (
    <ModalProvider>
      <ClassroomProvider>
        <StudentProvider>
          <BookProvider>
            <RoundProvider>
              <AssignmentProvider>{children}</AssignmentProvider>
            </RoundProvider>
          </BookProvider>
        </StudentProvider>
      </ClassroomProvider>
    </ModalProvider>
  );
};

// Re-export all context hooks
export { useModal } from "./ModalContext";
export { useBook } from "./BookContext";
export { useStudent } from "./StudentContext";
export { useClassroom } from "./ClassroomContext";
export { useRound } from "./RoundContext";
export { useAssignment } from "./AssignmentContext";
