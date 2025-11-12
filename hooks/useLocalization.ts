

import React, { createContext, useContext, ReactNode } from 'react';
import { translations } from '../translations/index.ts';

type Language = 'en' | 'es';
type TranslationKey = keyof (typeof translations)['en'];

export interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
    children: ReactNode;
    language: Language;
    setLanguage: (language: Language) => void;
}

// FIX: Explicitly type LocalizationProvider as a React.FC to ensure correct type inference for JSX children in .tsx files.
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children, language, setLanguage }) => {
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

  // FIX: Using React.createElement instead of JSX because this is a .ts file, not a .tsx file.
  // JSX is not valid in .ts files by default and was causing parsing errors.
  return React.createElement(LocalizationContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }
  return context;
};
