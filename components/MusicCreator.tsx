import React, { useState } from 'react';
import { MusicStyle, CustomMusicParams, TEMPO_OPTIONS, ENERGY_LEVEL_OPTIONS, EMOTION_OPTIONS, MUSIC_STYLE_OPTIONS } from '../types';
import { generateMusic } from '../services/geminiService';
import { playSound } from '../utils/soundUtils';

// Reusable Segmented Control for custom music params
const ParamSelector = <T extends string>({
  label,
  options,
  selectedValue,
  onSelect,
  isSoundEnabled,
}: {
  label: string;
  options: { id: T; label: string }[];
  selectedValue: T;
  onSelect: (value: T) => void;
  isSoundEnabled: boolean;
}) => (
  <div>
    <h5 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">{label}</h5>
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 space-x-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => { playSound('click', isSoundEnabled); onSelect(option.id); }}
          className={`w-full text-center text-sm font-semibold py-1.5 rounded-md transition-colors ${
            selectedValue === option.id
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);


interface MusicCreatorProps {
  story: string;
  onMusicGenerated: (url: string) => void;
  isSoundEnabled: boolean;
}

const MusicCreator: React.FC<MusicCreatorProps> = ({ story, onMusicGenerated, isSoundEnabled }) => {
  const [creationMode, setCreationMode] = useState<'style' | 'custom'>('style');
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle | null>(null);
  const [customParams, setCustomParams] = useState<CustomMusicParams>({
    tempo: 'medium',
    energy: 'vibrant',
    emotion: 'joyful',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomParamChange = <K extends keyof CustomMusicParams>(key: K, value: CustomMusicParams[K]) => {
    setCustomParams((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleGenerateMusic = async () => {
    if ((creationMode === 'style' && !selectedStyle) || !story) return;
    playSound('click', isSoundEnabled);
    setIsLoading(true);

    const config = creationMode === 'style'
      ? { style: selectedStyle! }
      : { custom: customParams };
      
    const musicUrl = await generateMusic(story, config);
    setIsLoading(false);
    if (musicUrl) {
      playSound('success', isSoundEnabled);
      onMusicGenerated(musicUrl);
    } else {
      playSound('error', isSoundEnabled);
      alert("Sorry, we couldn't create music right now. Please try again.");
    }
  };
  
  const handleModeChange = (mode: 'style' | 'custom') => {
    playSound('click', isSoundEnabled);
    setCreationMode(mode);
  };
  
  const handleStyleSelect = (style: MusicStyle) => {
    playSound('click', isSoundEnabled);
    setSelectedStyle(style);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4 animate-fade-in-up">
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">8. Add Background Music</h3>
      
      <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        <button onClick={() => handleModeChange('style')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${creationMode === 'style' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Select Music Style</button>
        <button onClick={() => handleModeChange('custom')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${creationMode === 'custom' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Create Custom Track</button>
      </div>

      {creationMode === 'style' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {MUSIC_STYLE_OPTIONS.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedStyle === style.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-105' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-green-400'
              }`}
            >
              <span className="text-3xl">{style.icon}</span>
              <span className="font-semibold text-sm mt-1 text-gray-700 dark:text-gray-200">{style.label}</span>
            </button>
          ))}
        </div>
      )}

      {creationMode === 'custom' && (
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">The AI will use your story's theme and these settings to create a unique track.</p>
          <ParamSelector label="Tempo" options={TEMPO_OPTIONS} selectedValue={customParams.tempo} onSelect={(v) => handleCustomParamChange('tempo', v)} isSoundEnabled={isSoundEnabled} />
          <ParamSelector label="Energy Level" options={ENERGY_LEVEL_OPTIONS} selectedValue={customParams.energy} onSelect={(v) => handleCustomParamChange('energy', v)} isSoundEnabled={isSoundEnabled} />
          <ParamSelector label="Emotion" options={EMOTION_OPTIONS} selectedValue={customParams.emotion} onSelect={(v) => handleCustomParamChange('emotion', v)} isSoundEnabled={isSoundEnabled} />
        </div>
      )}

      <button
        onClick={handleGenerateMusic}
        disabled={isLoading || (creationMode === 'style' && !selectedStyle)}
        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 transition-colors"
      >
        {isLoading ? 'Composing...' : 'Generate Music'}
      </button>
    </div>
  );
};

export default MusicCreator;
