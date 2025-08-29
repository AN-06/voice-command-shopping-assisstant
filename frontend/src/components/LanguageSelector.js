import React from "react";

function LanguageSelector({ language, setLanguage }) {
  return (
    <div>
      <label>Select Language: </label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English</option>
        <option value="hi-IN">हिन्दी (Hindi)</option>
        <option value="es-ES">Español (Spanish)</option>
        <option value="fr-FR">Français (French)</option>
      </select>
    </div>
  );
}

export default LanguageSelector;
