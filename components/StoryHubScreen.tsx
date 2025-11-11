

import React, { useState } from 'react';
import { CommunityStory, ReactionType } from '../types';
import CommunityStoryCard from './CommunityStoryCard';
import { playSound } from '../utils/soundUtils';

interface StoryHubScreenProps {
    stories: CommunityStory[];
    onReaction: (storyId: number, reactionType: ReactionType) => void;
    onNavigateToCreate: () => void;
    isSoundEnabled: boolean;
}

const StoryHubScreen: React.FC<StoryHubScreenProps> = ({ stories, onReaction, onNavigateToCreate, isSoundEnabled }) => {
    const [reactedStories, setReactedStories] = useState(new Set<number>());

    const handleReactionClick = (storyId: number, reactionType: ReactionType) => {
        if (reactedStories.has(storyId)) return;
        playSound('click', isSoundEnabled);
        onReaction(storyId, reactionType);
        setReactedStories(prev => new Set(prev).add(storyId));
    };

    const handleCreateClick = () => {
        playSound('click', isSoundEnabled);
        onNavigateToCreate();
    };
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">Story Hub Gallery</h2>
                <p className="text-lg text-gray-600">See what other creators have made! All stories are moderated for safety.</p>
            </div>

            <div className="text-center">
                <button
                    onClick={handleCreateClick}
                    className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                    ✨ Create Your Own Story
                </button>
            </div>

            <div className="mt-8">
                {stories.length === 0 ? (
                    <p className="text-center text-gray-500">The gallery is empty. Be the first to publish a story!</p>
                ) : (
                    <div className="space-y-6">
                        {stories.map(story => (
                            <CommunityStoryCard
                                key={story.id}
                                story={story}
                                onReaction={handleReactionClick}
                                hasReacted={reactedStories.has(story.id)}
                                isSoundEnabled={isSoundEnabled}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryHubScreen;
