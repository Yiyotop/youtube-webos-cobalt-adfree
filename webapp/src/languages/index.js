import de from './de.js';
import en from './en.js';
import it from './it.js';

const languages = { de, en, it };
const fallbackLanguage = 'en';

export function getLanguage() {
  const browserLanguages = navigator.languages || [navigator.language || ''];
  const availableLanguages = Object.keys(languages);

  for (const language of browserLanguages) {
    const normalized = String(language).toLowerCase();
    const base = normalized.split('-')[0];
    if (availableLanguages.includes(normalized)) return normalized;
    if (availableLanguages.includes(base)) return base;
  }

  return fallbackLanguage;
}

export function text(section, key) {
  const language = getLanguage();
  const selected = languages[language] || languages[fallbackLanguage];
  const fallback = languages[fallbackLanguage];

  return (
    selected[section]?.[key] ||
    fallback[section]?.[key] ||
    key
  );
}
