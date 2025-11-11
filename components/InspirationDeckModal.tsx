import React, { useState, useEffect, useRef } from 'react';
import { INSPIRATION_PROMPTS } from '../data/inspirationPrompts.ts';
import { playSound } from '../utils/soundUtils.ts';

interface InspirationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prompt: string) => void;
  isSoundEnabled: boolean;
}

const InspirationDeckModal: React.FC<InspirationDeckModalProps> = ({ isOpen, onClose, onSelect, isSoundEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
        playSound('whoosh', isSoundEnabled);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, isSoundEnabled]);

  if (!isOpen) return null;

  const handleNext = () => {
    playSound('click', isSoundEnabled);
    setCurrentIndex((prev) => (prev + 1) % INSPIRATION_PROMPTS.length);
  };

  const handleSelect = () => {
    playSound('click', isSoundEnabled);
    onSelect(INSPIRATION_PROMPTS[currentIndex].prompt);
    onClose();
  };
  
  const currentPrompt = INSPIRATION_PROMPTS[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Need Inspiration?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Draw a card from the inspiration deck to get your creative juices flowing!</p>

        <div className="min-h-[150px] p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg flex flex-col justify-center items-center">
            <span className="font-semibold text-yellow-600 dark:text-yellow-300 text-sm uppercase">{currentPrompt.category}</span>
            <p className="text-xl font-medium text-gray-800 dark:text-gray-100 mt-2">{currentPrompt.prompt}</p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
            <button
                onClick={handleNext}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
            >
                Draw Another
            </button>
            <button
                onClick={handleSelect}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700"
            >
                Use This Idea
            </button>
        </div>
      </div>
    </div>
  );
};

export default InspirationDeckModal;