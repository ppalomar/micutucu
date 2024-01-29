import React from "react";

const MICUTUCU_LOCAL_STORAGE_PREFIX = `Micututu-`;
const STORED_SELECTED_CLASSROOM = `${MICUTUCU_LOCAL_STORAGE_PREFIX}selected-classroom-id`;

const useApp = ({ classrooms, setSelectedClassroom }) => {
  React.useEffect(() => {
    const storedSelectedClassroomId = localStorage.getItem(
      STORED_SELECTED_CLASSROOM
    );
    if (classrooms?.length && storedSelectedClassroomId) {
      setSelectedClassroom(
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
