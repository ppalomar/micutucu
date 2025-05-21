// src/components/ClassroomForm.js
import React from "react";
import { useTranslation } from 'react-i18next';

const ClassroomForm = ({ isCollapsed }) => {
  const { t } = useTranslation();
  
  return (
    <div className="classroom-header">
      {!isCollapsed && <h2>{t('classroom.title')}</h2>}
    </div>
  );
};

export default ClassroomForm;
