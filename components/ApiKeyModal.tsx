import React, { useState } from 'react';
import { useApiKey } from '../hooks/useApiKey';
import { playSound } from '../utils/soundUtils';

interface ApiKeyModalProps {
  isOpen: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen }) => {
  const [inputValue, setInputValue] = useState('');
  const { setApiKey } = useApiKey();

  const handleSave = () => {
    if (inputValue.trim()) {
      playSound('success', true); // Play sound even if sound setting is off, as this is a critical action
      setApiKey(inputValue.trim());
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all animate-fade-in-up">
        <div className="text-5xl mb-4">🔑</div>
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Welcome, Creator!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To power the AI magic in this app, you'll need a Google AI API Key.
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm text-left text-gray-600 dark:text-gray-400 space-y-2">
            <p>
                <strong>Why is this needed?</strong> This is a public demo, so for security, it asks each user to provide their own key instead of using a shared one.
            </p>
            <p>
                🔒 Your key is saved <strong>only in this browser's local storage</strong> and is never sent to any server except Google's.
            </p>
        </div>
        <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-500 hover:underline font-semibold"
        >
            Get your free key from Google AI Studio →
        </a>
        <div className="mt-6">
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your API Key here"
            className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            aria-label="API Key Input"
          />
          <button
            onClick={handleSave}
            disabled={!inputValue.trim()}
            className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 transition-transform transform hover:scale-105"
          >
            Save and Start Creating
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
