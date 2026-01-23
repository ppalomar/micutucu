// src/Presentational.js
import React from "react";
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useClassroom, useStudent, useBook, useModal } from "./context";

import StudentForm from "./components/StudentForm";
import BookForm from "./components/BookForm";
import StudentList from "./components/StudentList";
import BookList from "./components/BookList";
import AssignmentList from "./components/AssignmentList";
import AssignmentHeader from "./components/AssignmentHeader";
import LanguageSwitcher from "./components/LanguageSwitcher";

const Presentational = () => {
  const { t } = useTranslation();
  const { isDevEnvironment } = useModal();
  const { selectedClassroom, setSelectedClassroom, classrooms } = useClassroom();
  const { getClassroomStudents } = useStudent();
  const { getClassroomBooks } = useBook();

  // Get data for the selected classroom
  const classroomStudents = selectedClassroom
    ? getClassroomStudents(selectedClassroom.id)
    : [];

  const classroomBooks = selectedClassroom
    ? getClassroomBooks(selectedClassroom.id)
    : [];

  // Check if the button should be enabled
  const isButtonEnabled =
    classroomStudents.length > 1 && classroomBooks.length > 1;

  return (
    <div className="container">
      <LanguageSwitcher />

      {isDevEnvironment && (
        <div className="dev-environment-header">DEVELOPMENT ENVIRONMENT</div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="title">{t('app.title')}</div>
        <div className="title-second">{t('app.subtitle')}</div>
      </div>

      {/* Classroom Selector */}
      <div className="classroom-selector">
        <FormControl fullWidth size="small">
          <InputLabel id="classroom-select-label">{t('classroom.title')}</InputLabel>
          <Select
            labelId="classroom-select-label"
            value={selectedClassroom?.id || ''}
            label={t('classroom.title')}
            onChange={(e) => {
              const classroom = classrooms.find(c => c.id === e.target.value);
              setSelectedClassroom(classroom);
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#82589F' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D6A2E8' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#82589F' },
            }}
          >
            {classrooms.map((classroom) => (
              <MenuItem key={classroom.id} value={classroom.id}>
                {classroom.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* 3 columns: Students | Books | Assignments */}
      <div className="main-section">
        <div className="section students">
          <StudentForm />
          <div className="section-separator" />
          <StudentList />
        </div>
        <div className="section books">
          <BookForm />
          <div className="section-separator" />
          <BookList />
        </div>
        <div className="section rounds">
          <AssignmentHeader isButtonEnabled={isButtonEnabled} />
          <div className="section-separator" />
          <AssignmentList />
        </div>
      </div>
    </div>
  );
};

export default Presentational;
