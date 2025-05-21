import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher" style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <span style={{ fontSize: '14px', color: '#666' }}>{t('language.select')}:</span>
      <button 
        onClick={() => changeLanguage('es')} 
        style={{
          background: 'none',
          border: i18n.language === 'es' ? '2px solid #6d3b9e' : '1px solid #ddd',
          borderRadius: '4px',
          padding: '2px',
          cursor: 'pointer',
          opacity: i18n.language === 'es' ? 1 : 0.7,
          transition: 'all 0.2s ease'
        }}
        title="Español"
      >
        <img 
          src="https://flagcdn.com/w40/es.png" 
          srcSet="https://flagcdn.com/w80/es.png 2x"
          width="24" 
          alt="Español"
        />
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        style={{
          background: 'none',
          border: i18n.language === 'en' ? '2px solid #6d3b9e' : '1px solid #ddd',
          borderRadius: '4px',
          padding: '2px',
          cursor: 'pointer',
          opacity: i18n.language === 'en' ? 1 : 0.7,
          transition: 'all 0.2s ease'
        }}
        title="English"
      >
        <img 
          src="https://flagcdn.com/w40/gb.png" 
          srcSet="https://flagcdn.com/w80/gb.png 2x"
          width="24" 
          alt="English"
        />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
