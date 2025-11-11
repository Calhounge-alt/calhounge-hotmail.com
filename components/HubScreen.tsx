import React from 'react';
import { useTranslation } from '../hooks/useLocalization.ts';
import { playSound } from '../utils/soundUtils.ts';

interface HubScreenProps {
  userName: string;
  onNavigate: (screen: string) => void;
  isSoundEnabled: boolean;
}

const HubCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
  isSoundEnabled: boolean;
}> = ({ icon, title, description, onClick, color, isSoundEnabled }) => {
    const handleClick = () => {
        playSound('click', isSoundEnabled);
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-left w-full h-full flex flex-col transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-t-4 ${color}`}
        >
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex-grow">{description}</p>
        </button>
    );
};


const HubScreen: React.FC<HubScreenProps> = ({ userName, onNavigate, isSoundEnabled }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          {t('welcomeBackUser', { userName })}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">What adventure will you choose today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HubCard
          icon="✨"
          title="Create"
          description="Bring a new story to life with your AI sidekick. Write, illustrate, and add music!"
          onClick={() => onNavigate('create')}
          color="border-blue-500"
          isSoundEnabled={isSoundEnabled}
        />
        <HubCard
          icon="📚"
          title="Learn"
          description="Explore mini-lessons about AI, digital safety, and the history of creativity."
          onClick={() => onNavigate('learn')}
          color="border-green-500"
          isSoundEnabled={isSoundEnabled}
        />
        <HubCard
          icon="🖼️"
          title="Story Hub"
          description="See what other young creators have made and get inspired by their stories."
          onClick={() => onNavigate('storyHub')}
          color="border-purple-500"
          isSoundEnabled={isSoundEnabled}
        />
        <HubCard
          icon="🛡️"
          title="Ethics Zone"
          description="Play a game to learn how to use AI responsibly and make good choices online."
          onClick={() => onNavigate('ethics')}
          color="border-yellow-500"
          isSoundEnabled={isSoundEnabled}
        />
        <HubCard
          icon="🛒"
          title="Avatar Shop"
          description="Spend your coins to customize your profile and AI sidekick with fun accessories."
          onClick={() => onNavigate('shop')}
          color="border-pink-500"
          isSoundEnabled={isSoundEnabled}
        />
        <HubCard
          icon="🦸"
          title="Freedom Fighters"
          description="Join Joshua, Ruby, and Benjamin and learn to use AI as a force for good!"
          onClick={() => onNavigate('freedomFighters')}
          color="border-red-500"
          isSoundEnabled={isSoundEnabled}
        />
      </div>
      <div className="text-center text-gray-500 text-sm">
        Teacher? Access the control panel from the settings menu.
      </div>
    </div>
  );
};

export default HubScreen;