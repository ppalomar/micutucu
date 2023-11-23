// src/components/ClassroomList.js
import React from "react";

const ClassroomList = ({
  classrooms,
  selectedClassroom,
  handleSelectedClassroom,
}) => {
  const sortedClassrooms = classrooms.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="list-div">
      {sortedClassrooms.map((classroom) => {
        const isActive = selectedClassroom?.id === classroom.id;
        return (
          <div
            title="Select this classroom"
            className={`list-item classroom ${isActive ? "active" : ""}`}
            key={classroom.id}
            onClick={
              isActive ? () => {} : () => handleSelectedClassroom(classroom)
            }
          >
            <span class="material-symbols-rounded">groups</span>
            {classroom.name}
            {isActive && <div className="active-text">(active)</div>}
          </div>
        );
      })}
    </div>
  );
};

export default ClassroomList;
