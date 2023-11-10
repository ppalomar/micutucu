// src/components/ClassroomForm.js
import React, { useState } from 'react';

const ClassroomForm = ({ addClassroom }) => {
  const [className, setClassName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (className) {
      const classroom = {
        id: new Date().getTime(), // You might want a better way to generate IDs
        name: className,
      };
      addClassroom(classroom);
      setClassName('');
    }
  };

  return (
    <div>
      <h2>Create Classroom</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter classroom name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default ClassroomForm;