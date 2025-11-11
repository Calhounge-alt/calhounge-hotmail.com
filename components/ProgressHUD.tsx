import React, { useState } from 'react';
import { ProgressStep } from '../types.ts';

interface ProgressHUDProps {
  completedSteps: Set<ProgressStep>;
  imaginationPower: number; // A value from 0 to 100
}

const ALL_STEPS: ProgressStep[] = ['story', 'art', 'music', 'reflection', 'export'];

const ProgressHUD: React.FC<ProgressHUDProps> = ({ completedSteps, imaginationPower }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const progressPercent = (completedSteps.size / ALL_STEPS.length) * 100;
  
  const circumference = 36 * 2 * Math.PI; // 2 * pi * r
  const strokeDashoffset = circumference - (imaginationPower / 100) * circumference;

  const getRemainingTasks = () => {
    const remaining = ALL_STEPS.filter(step => !completedSteps.has(step));
    if (remaining.length === 0) {
      return 'You\'ve completed all the steps! Time to export your creation.';
    }
    const taskDescriptions: Record<ProgressStep, string> = {
      story: 'write your story',
      art: 'create an image for your story',
      music: 'add some background music',
      reflection: 'reflect on your creation',
      export: 'export your final project',
    };
    return `Next up, you can: ${remaining.map(r => taskDescriptions[r]).join(', or ')}.`;
  };

  return (
    <>
      <div className="fixed top-24 sm:top-28 right-4 z-20 flex flex-col items-end gap-3">
        {/* Progress Bar Container */}
        <div className="group relative w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <button onClick={() => setIsModalOpen(true)} className="w-full text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Creative Journey</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{Math.round(progressPercent)}%</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2 w-full">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </button>
          <div className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            You are this close to finishing your creative journey.
          </div>
        </div>

        {/* Imagination Power Meter */}
        <div className="group relative">
           <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="40"
              cy="40"
            />
            <circle
              className="text-yellow-400"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="40"
              cy="40"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            💡
          </div>
          <div className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Power grows when you lead the creativity.
          </div>
        </div>
      </div>
      
      {/* Tiny Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Your Journey Status</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{getRemainingTasks()}</p>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressHUD;