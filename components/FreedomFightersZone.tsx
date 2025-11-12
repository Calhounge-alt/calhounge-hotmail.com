import React from 'react';
// FIX: Imported FreedomFighterScenario from types.ts where it is defined, instead of from freedomFightersScenarios.ts.
import { FREEDOM_FIGHTERS_SCENARIOS } from '../data/freedomFightersScenarios.ts';
import { FreedomFighterScenario } from '../types.ts';
import { playSound } from '../utils/soundUtils.ts';

interface FreedomFightersZoneProps {
  onBackToHub: () => void;
  onNavigateToCreate: () => void;
  isSoundEnabled: boolean;
}

const ScenarioCard: React.FC<{
  scenario: FreedomFighterScenario;
  onRemix: (prompt: string) => void;
  isSoundEnabled: boolean;
}> = ({ scenario, onRemix, isSoundEnabled }) => {
    const handleRemixClick = () => {
        playSound('click', isSoundEnabled);
        onRemix(scenario.prompt);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row gap-0 md:gap-6 transform transition-transform hover:scale-105">
            <img
            src={scenario.imageUrl}
            alt={`Illustration for ${scenario.title}`}
            className="w-full md:w-1/3 h-48 md:h-auto object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{scenario.character}</h3>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-1">{scenario.title}</h4>
            <p className="text-gray-600 dark:text-gray-300 my-3 flex-grow">{scenario.description}</p>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Story Spark:</p>
                <p className="font-mono text-sm p-3 bg-gray-100 dark:bg-gray-700 rounded-md">"{scenario.prompt}"</p>
                <button
                    onClick={handleRemixClick}
                    className="w-full bg-yellow-500 text-white font-bold py-2.5 rounded-lg hover:bg-yellow-600 transition-colors text-lg"
                >
                    Remix This Prompt
                </button>
            </div>
            </div>
        </div>
    );
};

const FreedomFightersZone: React.FC<FreedomFightersZoneProps> = ({ onBackToHub, onNavigateToCreate, isSoundEnabled }) => {

  const handleRemixPrompt = (prompt: string) => {
    localStorage.setItem('initialPrompt', prompt);
    onNavigateToCreate();
  };
  
  const handleBackToHub = () => {
    playSound('click', isSoundEnabled);
    onBackToHub();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">
          Freedom Fighters AI Zone
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Join your favorite characters and learn how to use AI as a force for good!
        </p>
      </div>

      <div className="space-y-8">
        {FREEDOM_FIGHTERS_SCENARIOS.map(scenario => (
            <ScenarioCard key={scenario.id} scenario={scenario} onRemix={handleRemixPrompt} isSoundEnabled={isSoundEnabled} />
        ))}
      </div>

      <div className="text-center pt-4">
        <button 
            onClick={handleBackToHub}
            className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-700 transition-all transform hover:scale-105"
        >
            Back to Hub
        </button>
      </div>
    </div>
  );
};

export default FreedomFightersZone;