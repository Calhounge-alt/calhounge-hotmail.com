import React, { useEffect, useRef } from 'react';
import { playSound } from '../utils/soundUtils.ts';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSoundEnabled: boolean;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, onConfirm, isSoundEnabled }) => {
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
        playSound('whoosh', isSoundEnabled);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, isSoundEnabled]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    playSound('success', isSoundEnabled);
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    playSound('click', isSoundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center transform transition-all animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">🌟</div>
        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Submit to the World Changers Gallery?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your creation will be sent to your teacher for review. If selected, it will be featured for the whole community to see! Are you ready to share?
        </p>
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Not Yet
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700"
          >
            Yes, Submit!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;