import React, { useState } from 'react';
import { useTranslation } from '../hooks/useLocalization';

interface CreativityMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreativityMeterModal: React.FC<CreativityMeterModalProps> = ({ isOpen, onClose }) => {
  const [value, setValue] = useState(50);
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center transform transition-all animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">🙌</div>
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{t('creativityMeterTitle')}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('creativityMeterQuestion')}
        </p>
        
        <div className="w-full my-4">
          <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-300 px-1">
            <span>🤖 {t('aiHelper')} ({100 - value}%)</span>
            <span>🧑‍🎨 {t('myIdea')} ({value}%)</span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-1 overflow-hidden flex">
            <div 
              className="bg-purple-500 transition-all duration-150" 
              style={{ width: `${100 - value}%` }}
              aria-hidden="true"
            ></div>
            <div 
              className="bg-yellow-400 transition-all duration-150" 
              style={{ width: `${value}%` }}
              aria-hidden="true"
            ></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-transparent cursor-pointer appearance-none focus:outline-none [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-300 dark:[&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
            aria-label={t('creativityMeterLabel')}
          />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-6">
          {t('creativityMeterMessage')}
        </p>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          {t('gotIt')}
        </button>
      </div>
    </div>
  );
};

export default CreativityMeterModal;
