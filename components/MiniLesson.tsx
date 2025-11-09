
import React, { useEffect } from 'react';

interface MiniLessonProps {
  setNextDisabled: (disabled: boolean) => void;
}

const MiniLesson: React.FC<MiniLessonProps> = ({ setNextDisabled }) => {
  useEffect(() => {
    setNextDisabled(false);
  }, [setNextDisabled]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Mini-Lesson: Talking to AI</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Think of AI as a super-powered helper. To get the best results, you need to give it clear instructions. These instructions are called "prompts."</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">The Power of Details</h3>
            <p className="text-gray-600 dark:text-gray-400">The more details you give the AI, the better it can understand your idea. Instead of just saying "a cat," try "a fluffy orange cat wearing a tiny wizard hat."</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎨</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Setting the Scene</h3>
            <p className="text-gray-600 dark:text-gray-400">Tell the AI where and when your story happens. Is it a "sunny park" or a "spooky, moonlit forest"? This helps create a mood.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎬</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Action Words are Key</h3>
            <p className="text-gray-600 dark:text-gray-400">What is your character doing? Use exciting verbs! "A dragon *sleeping*" is okay, but "a dragon *breathing sparkling bubbles*" is much more interesting!</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MiniLesson;