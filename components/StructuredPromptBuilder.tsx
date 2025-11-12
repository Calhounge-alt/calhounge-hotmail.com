import React, { useState, useEffect } from 'react';
import { generatePromptPart } from '../services/geminiService.ts';
import { playSound } from '../utils/soundUtils.ts';
import { LightbulbIcon, MicrophoneIcon } from './Icons.tsx';
import { useDictation } from '../hooks/useDictation.ts';
import PromptTemplates from './PromptTemplates.tsx';

interface PromptParts {
  character: string;
  setting: string;
  plot: string;
  conflict: string;
  resolution: string;
  theme: string;
}

interface StructuredPromptBuilderProps {
  initialPrompt?: string;
  onChange: (fullPrompt: string) => void;
  isSoundEnabled: boolean;
}

const partLabels: Record<keyof PromptParts, string> = {
  character: 'Character Name(s) & Details',
  setting: 'Setting (Where/When)',
  plot: 'Plot (What happens?)',
  conflict: 'Conflict (The problem)',
  resolution: 'Resolution (The solution)',
  theme: 'Theme (The message)',
};

const partPlaceholders: Record<keyof PromptParts, string> = {
    character: 'e.g., A brave knight named Sir Reginald and a clever dragon named Sparky...',
    setting: 'e.g., In a castle made of shimmering clouds...',
    plot: 'e.g., They go on a quest to find a missing star...',
    conflict: 'e.g., But a grumpy wizard who collects stars tries to stop them...',
    resolution: 'e.g., They work together and teach the wizard the joy of sharing...',
    theme: 'e.g., The story is about friendship and kindness...',
};

const StructuredPromptBuilder: React.FC<StructuredPromptBuilderProps> = ({ initialPrompt, onChange, isSoundEnabled }) => {
  const [parts, setParts] = useState<PromptParts>({
    character: '',
    setting: '',
    plot: '',
    conflict: '',
    resolution: '',
    theme: '',
  });
  const [loadingPart, setLoadingPart] = useState<keyof PromptParts | null>(null);
  const [activeDictationPart, setActiveDictationPart] = useState<keyof PromptParts | null>(null);

  const handleTranscript = (transcript: string) => {
    if (activeDictationPart) {
      setParts(prev => {
        const oldValue = prev[activeDictationPart];
        return {
          ...prev,
          [activeDictationPart]: (oldValue ? `${oldValue} ${transcript}` : transcript).trim()
        };
      });
    }
  };
  
  const { isListening, startListening, stopListening, isSupported } = useDictation(handleTranscript);

  useEffect(() => {
    // This effect runs only when the initialPrompt prop is first passed.
    if (initialPrompt) {
      setParts(prev => ({ ...prev, plot: initialPrompt }));
    }
  }, [initialPrompt]);

  useEffect(() => {
    // This effect combines the parts into a single string whenever any part changes.
    // FIX: Use Object.keys with a type assertion to iterate over parts. This provides type safety
    // and avoids the 'unknown' type that Object.entries/values can produce.
    const fullPrompt = (Object.keys(parts) as Array<keyof PromptParts>)
      .filter((key) => parts[key].trim() !== '')
      .map((key) => `${partLabels[key]}:\n${parts[key]}`)
      .join('\n\n');
    onChange(fullPrompt);
  }, [parts, onChange]);

  const handlePartChange = (part: keyof PromptParts, value: string) => {
    setParts(prev => ({ ...prev, [part]: value }));
  };

  const handleInspireMe = async (part: keyof PromptParts) => {
    playSound('click', isSoundEnabled);
    setLoadingPart(part);
    
    const currentPrompt = (Object.keys(parts) as Array<keyof PromptParts>)
      .filter(key => parts[key].trim() !== '')
      .map(key => `${partLabels[key]}: ${parts[key]}`)
      .join('. ');

    const suggestion = await generatePromptPart(partLabels[part], currentPrompt);
    // Check if the suggestion is not an error message before setting it
    if (!suggestion.toLowerCase().startsWith('sorry')) {
        setParts(prev => ({ ...prev, [part]: suggestion }));
        playSound('success', isSoundEnabled);
    } else {
        playSound('error', isSoundEnabled);
    }
    setLoadingPart(null);
  };
  
  const toggleListening = (part: keyof PromptParts) => {
    playSound('click', isSoundEnabled);
    if (isListening) {
      stopListening();
      setActiveDictationPart(null);
    } else {
      setActiveDictationPart(part);
      startListening();
    }
  };

  const handleTemplateSelect = (prompt: string) => {
    playSound('click', isSoundEnabled);
    // This fills the 'plot' part, as it's the main story idea.
    // The other fields can be filled in to add more detail.
    setParts(prev => ({ ...prev, plot: prompt }));
  };

  return (
    <div className="space-y-4">
      <PromptTemplates onSelect={handleTemplateSelect} label="Need an idea? Try a story starter!" />
      {(Object.keys(parts) as Array<keyof PromptParts>).map(key => (
          <div key={key}>
            <label htmlFor={`prompt-${key}`} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              {partLabels[key]}
            </label>
            <div className="relative">
              <textarea
                id={`prompt-${key}`}
                value={parts[key]}
                onChange={(e) => handlePartChange(key, e.target.value)}
                placeholder={partPlaceholders[key]}
                className="w-full p-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg h-20 dark:bg-gray-700 resize-y"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                {isSupported && (
                    <button
                        onClick={() => toggleListening(key)}
                        className={`p-1.5 rounded-full text-white transition-colors ${
                            isListening && activeDictationPart === key ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        aria-label={isListening && activeDictationPart === key ? 'Stop dictation' : `Start dictation for ${partLabels[key]}`}
                        title={isListening && activeDictationPart === key ? 'Stop dictation' : `Start dictation`}
                    >
                        <MicrophoneIcon className="h-4 w-4" />
                    </button>
                )}
                <button
                  onClick={() => handleInspireMe(key)}
                  disabled={loadingPart === key}
                  className="p-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label={`Get inspiration for ${partLabels[key]}`}
                  title={`Get inspiration for ${partLabels[key]}`}
                >
                  {loadingPart === key ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <LightbulbIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default StructuredPromptBuilder;