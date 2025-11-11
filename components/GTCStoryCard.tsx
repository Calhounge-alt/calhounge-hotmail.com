import React from 'react';
import { GTCWorldChangerStory } from '../types.ts';
import { BadgeCheckIcon } from './Icons.tsx';

interface GTCStoryCardProps {
  story: GTCWorldChangerStory;
}

const GTCStoryCard: React.FC<GTCStoryCardProps> = ({ story }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-transform hover:scale-105 border-2 border-transparent hover:border-yellow-400">
      <div className="relative">
        <img
          src={story.imageUrl}
          alt={`Artwork for a story by ${story.authorName}`}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <span>GTC World Changer</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-base flex-grow">
          "{story.storyText}"
        </p>
        
        {story.musicUrl && (
          <div className="my-2">
            <audio controls src={story.musicUrl} className="w-full h-10">
              Your browser does not support the audio.
            </audio>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="font-bold text-gray-800 dark:text-gray-100 text-right">
                - {story.authorName}
            </p>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2">
                <BadgeCheckIcon className="w-5 h-5" />
                <p className="text-xs font-bold">
                    GTC World Changer – Creativity & Code 2025
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GTCStoryCard;