import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/soundUtils.ts';

interface OnboardingModalProps {
  isOpen: boolean;
  onNameSet: (name: string) => void;
  isSoundEnabled: boolean;
  onAccessRequestClick: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onNameSet, isSoundEnabled, onAccessRequestClick }) => {
  const [name, setName] = useState('');
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
        playSound('whoosh', isSoundEnabled);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, isSoundEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      playSound('click', isSoundEnabled);
      onNameSet(name.trim());
    }
  };
  
  const handleAccessRequest = () => {
    playSound('click', isSoundEnabled);
    onAccessRequestClick();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center transform transition-all animate-fade-in-up">
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Welcome to Creativity & Code!</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          This is a place where your ideas come to life. To get started, what should we call you?
        </p>
        <form onSubmit={handleSubmit} className="mt-2">
          <label htmlFor="name-input" className="sr-only">
            Your Creator Name
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Captain Creative"
            className="w-full p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
            maxLength={20}
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 transition-transform transform hover:scale-105"
          >
            Let's Begin!
          </button>
        </form>
        <div className="mt-6 text-sm">
            <p className="text-gray-500 dark:text-gray-400">
                Need access for your class or family?{' '}
                <button onClick={handleAccessRequest} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline">
                Request it here.
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
