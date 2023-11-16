// src/components/ClassroomList.js
import React from "react";

const ClassroomList = ({
  classrooms,
  selectedClassroom,
  handleSelectedClassroom,
}) => {
  return (
    <div className="list-div">
      {classrooms.map((classroom) => {
        const isActive = selectedClassroom?.id === classroom.id;
        return (
          <div
            title="Select this classroom"
            className={`list-item ${isActive ? "active" : ""}`}
            key={classroom.id}
            onClick={
              isActive ? () => {} : () => handleSelectedClassroom(classroom)
            }
          >
            {classroom.name}
            {isActive && <div className="active-text">(active)</div>}
          </div>
        );
      })}
    </div>
  );
};

export default ClassroomList;
