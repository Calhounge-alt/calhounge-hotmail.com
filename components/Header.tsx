import React from 'react';
import { useTranslation } from '../hooks/useLocalization.ts';
import AvatarDisplay from './AvatarDisplay.tsx';
import { AvatarState } from '../types.ts';
import { HomeIcon } from './Icons.tsx';
import { playSound } from '../utils/soundUtils.ts';

interface HeaderProps {
    userName: string;
    onSettingsClick: () => void;
    onHubClick: () => void;
    showHubButton: boolean;
    avatarState: AvatarState;
    coins: number;
    isSoundEnabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ userName, onSettingsClick, onHubClick, showHubButton, avatarState, coins, isSoundEnabled }) => {
    const { t } = useTranslation();

    const handleSettingsClick = () => {
        playSound('click', isSoundEnabled);
        onSettingsClick();
    };

    const handleHubClick = () => {
        playSound('click', isSoundEnabled);
        onHubClick();
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 border-b border-gray-200 dark:border-gray-700 z-30">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="text-2xl">🎨</div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block">Creativity & Code</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <span className="font-bold text-gray-700 dark:text-gray-200">{userName}</span>
                        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                            <span>💰</span>
                            <span>{coins}</span>
                        </div>
                    </div>
                    <AvatarDisplay avatarState={avatarState} size="small" />

                    {showHubButton && (
                         <button
                            onClick={handleHubClick}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Go to Hub"
                        >
                            <HomeIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                    <button
                        onClick={handleSettingsClick}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={t('settings')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;