import React from 'react';
import { PROMPT_TEMPLATES } from '../data/promptTemplates.ts';

interface PromptTemplatesProps {
  onSelect: (prompt: string) => void;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelect }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrompt = event.target.value;
    if (selectedPrompt) {
      onSelect(selectedPrompt);
      // Reset dropdown to placeholder
      event.target.value = "";
    }
  };

  return (
    <div className="mb-2">
      <label htmlFor="prompt-template" className="block text-sm font-medium text-gray-700">
        Need an idea? Choose a template!
      </label>
      <select
        id="prompt-template"
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        defaultValue=""
      >
        <option value="" disabled>
          Select a story starter...
        </option>
        {PROMPT_TEMPLATES.map((category) => (
          <optgroup label={category.genre} key={category.genre}>
            {category.prompts.map((p) => (
              <option key={p.title} value={p.prompt}>
                {p.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default PromptTemplates;