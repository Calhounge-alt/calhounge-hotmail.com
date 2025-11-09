
import React, { useEffect } from 'react';

interface RewardsScreenProps {
  userName: string;
  setNextDisabled: (disabled: boolean) => void;
}

const RewardsScreen: React.FC<RewardsScreenProps> = ({ userName, setNextDisabled }) => {
  useEffect(() => {
    setNextDisabled(false);
  }, [setNextDisabled]);
  
  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
      <div className="text-8xl mb-6">🎉</div>
      <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Congratulations, {userName}!</h2>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
        You've completed the Prompting Workshop and earned your Creator's Badge! You're now ready to build amazing things.
      </p>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg inline-block">
        <div className="text-7xl">🏅</div>
        <h3 className="text-2xl font-bold mt-2 text-yellow-500">Creator's Badge</h3>
      </div>
    </div>
  );
};

export default RewardsScreen;