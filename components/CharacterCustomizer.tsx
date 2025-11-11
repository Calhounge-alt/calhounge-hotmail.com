import React from 'react';
import { Character, CharacterTrait, PERSONALITY_TRAITS, HAIR_TRAITS, EYE_TRAITS, CLOTHING_TRAITS, BODY_TYPE_TRAITS, ACCESSORY_TRAITS } from '../types';
import { playSound } from '../utils/soundUtils';

interface CharacterCustomizerProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
  isSoundEnabled: boolean;
}

const TraitButton: React.FC<{
  trait: CharacterTrait;
  isSelected: boolean;
  onClick: () => void;
  isSoundEnabled: boolean;
}> = ({ trait, isSelected, onClick, isSoundEnabled }) => {
    const handleClick = () => {
        playSound('click', isSoundEnabled);
        onClick();
    };

    return (
      <button
        onClick={handleClick}
        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border-2 text-center transition-all duration-200 ${
          isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 hover:border-blue-300'
        }`}
      >
        <span className="text-2xl">{trait.icon}</span>
        <span className="font-semibold text-xs mt-1 text-gray-700 dark:text-gray-200">{trait.label}</span>
      </button>
    );
};

const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({ character, onCharacterChange, isSoundEnabled }) => {
  const handleTraitChange = (category: keyof Character, value: string) => {
    onCharacterChange({
      ...character,
      [category]: character[category] === value ? null : value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-bold text-gray-600 dark:text-gray-300 mb-2">Personality & Body</h4>
        <div className="grid grid-cols-4 gap-2">
          {PERSONALITY_TRAITS.map((trait) => (
            <TraitButton
              key={trait.id}
              trait={trait}
              isSelected={character.personality === trait.id}
              onClick={() => handleTraitChange('personality', trait.id)}
              isSoundEnabled={isSoundEnabled}
            />
          ))}
        </div>
         <div className="grid grid-cols-4 gap-2 mt-2">
          {BODY_TYPE_TRAITS.map((trait) => (
            <TraitButton
              key={trait.id}
              trait={trait}
              isSelected={character.bodyType === trait.id}
              onClick={() => handleTraitChange('bodyType', trait.id)}
              isSoundEnabled={isSoundEnabled}
            />
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-bold text-gray-600 dark:text-gray-300 mb-2">Appearance & Gear</h4>
        <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
                 {HAIR_TRAITS.map((trait) => (
                    <TraitButton
                    key={trait.id}
                    trait={trait}
                    isSelected={character.hair === trait.id}
                    onClick={() => handleTraitChange('hair', trait.id)}
                    isSoundEnabled={isSoundEnabled}
                    />
                ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
                {EYE_TRAITS.map((trait) => (
                    <TraitButton
                    key={trait.id}
                    trait={trait}
                    isSelected={character.eyes === trait.id}
                    onClick={() => handleTraitChange('eyes', trait.id)}
                    isSoundEnabled={isSoundEnabled}
                    />
                ))}
            </div>
             <div className="grid grid-cols-4 gap-2">
                {CLOTHING_TRAITS.map((trait) => (
                    <TraitButton
                    key={trait.id}
                    trait={trait}
                    isSelected={character.clothing === trait.id}
                    onClick={() => handleTraitChange('clothing', trait.id)}
                    isSoundEnabled={isSoundEnabled}
                    />
                ))}
            </div>
             <div className="grid grid-cols-4 gap-2">
                {ACCESSORY_TRAITS.map((trait) => (
                    <TraitButton
                    key={trait.id}
                    trait={trait}
                    isSelected={character.accessories === trait.id}
                    onClick={() => handleTraitChange('accessories', trait.id)}
                    isSoundEnabled={isSoundEnabled}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomizer;
