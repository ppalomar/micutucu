import React from "react";

import { STORED_SELECTED_CLASSROOM } from "../constants";

const useApp = ({ classrooms, setSelectedClassroom }) => {
  React.useEffect(() => {
    const storedSelectedClassroomId = localStorage.getItem(
      STORED_SELECTED_CLASSROOM
    );
    if (classrooms?.length && storedSelectedClassroomId) {
      setSelectedClassroom(
        // eslint-disable-next-line eqeqeq
        classrooms.find((c) => c.id == storedSelectedClassroomId)
      );
    }
    if (classrooms?.length && !storedSelectedClassroomId) {
      setSelectedClassroom(classrooms[0]);
    }
  }, [classrooms, setSelectedClassroom]);

  const storeSelectedClassroom = React.useCallback((selectedClassroomId) => {
    localStorage.setItem(STORED_SELECTED_CLASSROOM, selectedClassroomId);
  }, []);

  return React.useMemo(
    () => ({
      storeSelectedClassroom,
    }),
    [storeSelectedClassroom]
  );
};

export default useApp;
