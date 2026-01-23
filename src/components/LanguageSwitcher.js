import i18n from 'i18next';

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: 'es' },
  { code: 'en', label: 'English', flag: 'gb' },
];

function getButtonStyle(isSelected) {
  return {
    background: 'none',
    border: isSelected ? '2px solid #6d3b9e' : '1px solid #ddd',
    borderRadius: '4px',
    padding: '2px',
    cursor: 'pointer',
    opacity: isSelected ? 1 : 0.7,
    transition: 'all 0.2s ease',
  };
}

const containerStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  zIndex: 1000,
};

function LanguageSwitcher() {
  return (
    <div className="language-switcher" style={containerStyle}>
      {LANGUAGES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          style={getButtonStyle(i18n.language === code)}
          title={label}
        >
          <img
            src={`https://flagcdn.com/w40/${flag}.png`}
            srcSet={`https://flagcdn.com/w80/${flag}.png 2x`}
            width="24"
            alt={label}
          />
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
