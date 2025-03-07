import React from "react";
import { useClassroom } from "../context";

const ClassroomList = () => {
  const { classrooms, selectedClassroom, setSelectedClassroom } =
    useClassroom();

  const sortedClassrooms = classrooms.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="list-div">
      {sortedClassrooms.map((classroom) => {
        const isActive = selectedClassroom?.id === classroom.id;
        return (
          <div
            className={`list-item classroom ${isActive ? "active" : ""}`}
            key={classroom.id}
            onClick={
              isActive ? () => {} : () => setSelectedClassroom(classroom)
            }
          >
            {classroom.name}
          </div>
        );
      })}
    </div>
  );
};

export default ClassroomList;
