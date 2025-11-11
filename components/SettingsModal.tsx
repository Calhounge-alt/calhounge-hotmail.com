import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useLocalization.ts';
import { useApiKey } from '../hooks/useApiKey.tsx';
import { playSound } from '../utils/soundUtils.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  font: 'default' | 'dyslexia-friendly';
  setFont: (font: 'default' | 'dyslexia-friendly') => void;
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  isTeacherMode: boolean;
  setIsTeacherMode: (isTeacher: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, theme, setTheme, font, setFont, language, setLanguage, isSoundEnabled, setIsSoundEnabled, isTeacherMode, setIsTeacherMode
}) => {
  const { t } = useTranslation();
  const { apiKey, setApiKey } = useApiKey();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [keySaved, setKeySaved] = useState(false);
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
        playSound('whoosh', isSoundEnabled);
    }
    prevIsOpen.current = isOpen;
    // Reset local key state when modal opens
    if (isOpen) {
        setLocalApiKey(apiKey || '');
        setKeySaved(false);
    }
  }, [isOpen, isSoundEnabled, apiKey]);


  const handleTeacherModeToggle = () => {
    playSound('click', isSoundEnabled);
    setIsTeacherMode(!isTeacherMode);
  };
  
  const handleSoundToggle = () => {
    playSound('click', !isSoundEnabled); // Play sound based on future state
    setIsSoundEnabled(!isSoundEnabled);
  };

  const handleThemeClick = (newTheme: 'light' | 'dark') => {
    playSound('click', isSoundEnabled);
    setTheme(newTheme);
  };

  const handleFontClick = (newFont: 'default' | 'dyslexia-friendly') => {
    playSound('click', isSoundEnabled);
    setFont(newFont);
  };

  const handleLanguageClick = (newLang: 'en' | 'es') => {
    playSound('click', isSoundEnabled);
    setLanguage(newLang);
  };
  
  const handleApiKeySave = () => {
    playSound('click', isSoundEnabled);
    setApiKey(localApiKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000); // Hide message after 2s
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">{t('appSettings')}</h2>
        
        <div className="space-y-6">
          {/* API Key Setting */}
          <div className="border-b pb-4 border-gray-200 dark:border-gray-600">
             <label className="font-bold text-gray-700 dark:text-gray-200">Google AI API Key</label>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your key is stored only in your browser.</p>
             <div className="flex gap-2 mt-2">
                <input
                    type="password"
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder="Enter your API Key"
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-700"
                />
                 <button onClick={handleApiKeySave} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {keySaved ? '✓' : 'Save'}
                 </button>
             </div>
          </div>
          {/* Theme Setting */}
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200">{t('theme')}</label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleThemeClick('light')} className={`w-full py-2 rounded-lg ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t('light')}</button>
              <button onClick={() => handleThemeClick('dark')} className={`w-full py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t('dark')}</button>
            </div>
          </div>
          {/* Font Setting */}
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200">{t('font')}</label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleFontClick('default')} className={`w-full py-2 rounded-lg ${font === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t('default')}</button>
              <button onClick={() => handleFontClick('dyslexia-friendly')} className={`w-full py-2 rounded-lg ${font === 'dyslexia-friendly' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t('dyslexiaFriendly')}</button>
            </div>
          </div>
          {/* Language Setting */}
          <div>
            <label className="font-bold text-gray-700 dark:text-gray-200">{t('language')}</label>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleLanguageClick('en')} className={`w-full py-2 rounded-lg ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t('english')}</button>
              <button onClick={() => handleLanguageClick('es')} className={`w-full py-2 rounded-lg ${language === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{t('spanish')}</button>
            </div>
          </div>
           {/* Sound Setting */}
           <div>
             <label className="font-bold text-gray-700 dark:text-gray-200">Sound Effects</label>
             <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Enable UI sounds</p>
                <button
                    onClick={handleSoundToggle}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                        isSoundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                    <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            isSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
             </div>
          </div>
          {/* Teacher Mode Setting */}
          <div className="border-t pt-4 border-gray-200 dark:border-gray-600">
             <label className="font-bold text-gray-700 dark:text-gray-200">Teacher Mode</label>
             <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">Access the classroom dashboard.</p>
                <button
                    onClick={handleTeacherModeToggle}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                        isTeacherMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                    <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            isTeacherMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
             </div>
          </div>
        </div>

        <button onClick={onClose} className="mt-8 w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-800 dark:bg-gray-500 dark:hover:bg-gray-400">
          {t('close')}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;