import React from 'react';
import { VoiceName, VOICE_OPTIONS } from '../types';
import { playSound } from '../utils/soundUtils';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onVoiceChange: (voice: VoiceName) => void;
  isSoundEnabled: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onVoiceChange, isSoundEnabled }) => {
  const handleClick = (voiceId: VoiceName) => {
    playSound('click', isSoundEnabled);
    onVoiceChange(voiceId);
  };
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
      {VOICE_OPTIONS.map((voice) => (
        <button
          key={voice.id}
          onClick={() => handleClick(voice.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-center transition-all duration-200 h-full ${
            selectedVoice === voice.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105' : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 hover:border-indigo-400'
          }`}
        >
          <span className="text-3xl">{voice.icon}</span>
          <span className="font-semibold text-sm mt-1 text-gray-700 dark:text-gray-200">{voice.label}</span>
        </button>
      ))}
    </div>
  );
};

export default VoiceSelector;
