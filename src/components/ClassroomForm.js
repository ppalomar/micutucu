// src/components/ClassroomForm.js
import React from "react";

const ClassroomForm = ({ isCollapsed }) => {
  return (
    <div className="classroom-header">
      {!isCollapsed && <h2>Classrooms</h2>}
    </div>
  );
};

export default ClassroomForm;
