import React, { useState } from 'react';
import { GTC_WORLD_CHANGERS_STORIES } from '../data/gtcWorldChangers';
import { GTC_CATEGORIES, GTC_CategoryKey } from '../types';
import GTCStoryCard from './GTCStoryCard';

interface GTCGalleryScreenProps {
  onBackToHub: () => void;
}

const GTCGalleryScreen: React.FC<GTCGalleryScreenProps> = ({ onBackToHub }) => {
  const [activeTab, setActiveTab] = useState<GTC_CategoryKey>('story');

  const filteredStories = GTC_WORLD_CHANGERS_STORIES.filter(story => story.category === activeTab);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">
            GTC World Changers Gallery
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Celebrating the most inspiring creations from our community!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md sticky top-[80px] z-10">
        <div className="flex justify-center flex-wrap gap-2">
          {Object.keys(GTC_CATEGORIES).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as GTC_CategoryKey)}
              className={`px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors ${
                activeTab === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {GTC_CATEGORIES[key as GTC_CategoryKey]}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map(story => (
              <GTCStoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400 dark:text-gray-500">🏆</p>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              The next selection for "{GTC_CATEGORIES[activeTab]}" is underway. Check back soon!
            </p>
          </div>
        )}
      </div>

      <div className="text-center">
        <button 
            onClick={onBackToHub}
            className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-700 transition-all transform hover:scale-105"
        >
            Back to Hub
        </button>
      </div>
    </div>
  );
};

export default GTCGalleryScreen;
