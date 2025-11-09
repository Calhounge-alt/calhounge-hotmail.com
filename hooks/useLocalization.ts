import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../translations';

type Language = 'en' | 'es';
type TranslationKey = keyof (typeof translations)['en'];

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text: string = (translations[language] && translations[language][key]) || translations['en'][key];
    if (params) {
        Object.keys(params).forEach(pKey => {
            const value = params[pKey];
            text = text.replace(new RegExp(`{{${pKey}}}`, 'g'), String(value));
        });
    }
    return text;
  };

  // FIX: Replaced JSX with React.createElement to avoid JSX parsing issues in a .ts file.
  // This resolves errors related to incorrect parsing of JSX syntax.
  return React.createElement(LocalizationContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }
  return context;
};
