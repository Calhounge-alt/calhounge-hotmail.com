import React from 'react';
import { Vibe, VIBE_OPTIONS } from '../types';

interface VibeSelectorProps {
  selectedVibe: Vibe | null;
  onVibeChange: (vibe: Vibe | null) => void;
}

const VibeSelector: React.FC<VibeSelectorProps> = ({ selectedVibe, onVibeChange }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {VIBE_OPTIONS.map((vibe) => (
        <button
          key={vibe.id}
          onClick={() => onVibeChange(selectedVibe === vibe.id ? null : vibe.id)}
          className={`flex flex-col items-center justify-start p-3 rounded-lg border-2 text-center transition-all duration-200 h-full ${
            selectedVibe === vibe.id ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 scale-105' : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 hover:border-yellow-400'
          }`}
        >
          <span className="text-3xl">{vibe.icon}</span>
          <span className="font-semibold text-sm mt-1 text-gray-700 dark:text-gray-200">{vibe.label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{vibe.description}</span>
        </button>
      ))}
    </div>
  );
};

export default VibeSelector;
