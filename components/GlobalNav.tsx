import React from 'react';
import { playSound } from '../utils/soundUtils.ts';

interface GlobalNavProps {
  onBack: () => void;
  onNext: () => void;
  showBack: boolean;
  showNext: boolean;
  nextText?: string;
  isNextDisabled?: boolean;
  isSoundEnabled: boolean;
}

const GlobalNav: React.FC<GlobalNavProps> = ({
  onBack,
  onNext,
  showBack,
  showNext,
  nextText = 'Next',
  isNextDisabled = false,
  isSoundEnabled,
}) => {
  const handleBack = () => {
    playSound('click', isSoundEnabled);
    onBack();
  };

  const handleNext = () => {
    playSound('click', isSoundEnabled);
    onNext();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {showBack ? (
          <button
            onClick={handleBack}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Back
          </button>
        ) : (
          <div /> // Placeholder to keep "Next" on the right
        )}

        {showNext && (
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {nextText}
          </button>
        )}
      </div>
    </div>
  );
};

export default GlobalNav;