// src/components/ClassroomForm.js
import React, { useState } from "react";
import { useClassroom } from "../context";

const ClassroomForm = () => {
  // Get the addClassroom function from context
  const { addClassroom } = useClassroom();

  // Local state for the classroom name input
  const [className, setClassName] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (className) {
      const classroom = {
        id: new Date().getTime(), // Generate a unique ID
        name: className,
      };
      addClassroom(classroom);
      setClassName(""); // Reset form after submission
    }
  };

  return (
    <div>
      <h2>Classrooms</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", height: "38px" }}>
          {/* Uncomment this if you want to enable adding classrooms */}
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
