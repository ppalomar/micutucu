// src/components/ClassroomForm.js
import React, { useState } from "react";

const ClassroomForm = ({ addClassroom }) => {
  const [className, setClassName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (className) {
      const classroom = {
        id: new Date().getTime(), // You might want a better way to generate IDs
        name: className,
      };
      addClassroom(classroom);
      setClassName("");
    }
  };

  return (
    <div>
      <h2>Classrooms</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", height: "38px" }}>
          {/* <div style={{ flex: 10, marginRight: 20 }}>
            <input
              type="text"
              placeholder="Enter classroom name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <div style={{ flex: 2 }}>
            <button type="submit">Add</button>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default ClassroomForm;
