import React, { useState } from 'react';
import { ETHICS_PROMPTS, EthicsPrompt, EthicsPromptCategory } from '../data/ethicsPrompts.ts';
import { playSound } from '../utils/soundUtils.ts';

interface EthicsPlaygroundProps {
  onBackToHub: () => void;
  isSoundEnabled: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const EthicsPlayground: React.FC<EthicsPlaygroundProps> = ({ onBackToHub, isSoundEnabled }) => {
  const [prompts] = useState(() => shuffleArray(ETHICS_PROMPTS));
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [draggedItem, setDraggedItem] = useState<EthicsPrompt | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<EthicsPromptCategory | null>(null);

  const currentPrompt = prompts[currentPromptIndex];
  const isComplete = currentPromptIndex >= prompts.length;

  const handleDragStart = (prompt: EthicsPrompt) => {
    setDraggedItem(prompt);
  };

  const handleDrop = (category: EthicsPromptCategory) => {
    if (!draggedItem) return;

    const isCorrect = draggedItem.category === category;
    if (isCorrect) {
      playSound('success', isSoundEnabled);
      setScore((s) => s + 1);
    } else {
      playSound('error', isSoundEnabled);
    }
    setFeedback({ isCorrect, explanation: draggedItem.explanation });
    setDraggedItem(null);
  };

  const handleNextPrompt = () => {
    playSound('click', isSoundEnabled);
    setFeedback(null);
    const nextIndex = currentPromptIndex + 1;
    setCurrentPromptIndex(nextIndex);
    if (nextIndex >= prompts.length) {
        playSound('badge', isSoundEnabled);
    }
  };

  const handleRestart = () => {
    playSound('click', isSoundEnabled);
    setCurrentPromptIndex(0);
    setScore(0);
    setFeedback(null);
  };
  
  const handleBackToHub = () => {
    playSound('click', isSoundEnabled);
    onBackToHub();
  };

  const DropZone: React.FC<{
    category: EthicsPromptCategory;
    title: string;
    icon: string;
    colorClasses: string;
  }> = ({ category, title, icon, colorClasses }) => (
    <div
      onDrop={(e) => {
        e.preventDefault();
        handleDrop(category);
        setIsDraggingOver(null);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(category);
      }}
      onDragLeave={() => setIsDraggingOver(null)}
      className={`flex-1 p-6 rounded-2xl border-4 border-dashed text-center flex flex-col items-center justify-center transition-all duration-200 ${
        isDraggingOver === category ? 'scale-105 shadow-2xl' : ''
      } ${colorClasses}`}
    >
      <span className="text-5xl mb-2">{icon}</span>
      <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">AI Ethics Playground</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Drag the prompt to the correct category!</p>
      </div>

      {!isComplete ? (
        <>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${((currentPromptIndex) / prompts.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center font-bold text-gray-700 dark:text-gray-200">
            Prompt {currentPromptIndex + 1} of {prompts.length} | Score: {score}
          </div>

          <div
            draggable
            onDragStart={() => handleDragStart(currentPrompt)}
            onDragEnd={() => setDraggedItem(null)}
            className="my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing text-center"
          >
            <p className="text-lg md:text-xl font-mono text-gray-800 dark:text-gray-100">"{currentPrompt.text}"</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <DropZone
              category="safe"
              title="Safe"
              icon="✅"
              colorClasses="border-green-400 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
            />
            <DropZone
              category="needsFixing"
              title="Needs Fixing"
              icon="⚠️"
              colorClasses="border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
            />
            <DropZone
              category="notOk"
              title="Not OK"
              icon="❌"
              colorClasses="border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
            />
          </div>
        </>
      ) : (
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-7xl mb-4">🎉</div>
          <h3 className="text-4xl font-bold text-blue-600 mb-2">Challenge Complete!</h3>
          <p className="text-2xl text-gray-700 dark:text-gray-200">
            Your final score is: {score} / {prompts.length}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-lg mx-auto">
            Great job! The most important rule is to always think before you prompt. Be Kind, Be Safe, Be Creative!
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Play Again
            </button>
            <button
              onClick={handleBackToHub}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700"
            >
              Back to Hub
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={handleNextPrompt}>
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all animate-fade-in-up border-t-8 ${
              feedback.isCorrect ? 'border-green-500' : 'border-red-500'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-3xl font-bold mb-4 ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {feedback.isCorrect ? 'Great Job!' : 'Not Quite!'}
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">{feedback.explanation}</p>
            <button
              onClick={handleNextPrompt}
              className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
            >
              {isComplete ? 'See Results' : 'Next Prompt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EthicsPlayground;