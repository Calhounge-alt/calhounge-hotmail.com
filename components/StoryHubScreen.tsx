import React, { useState } from 'react';
import { CommunityStory, ReactionType } from '../types';
import CommunityStoryCard from './CommunityStoryCard';

interface StoryHubScreenProps {
    stories: CommunityStory[];
    onReaction: (storyId: number, reactionType: ReactionType) => void;
}

const StoryHubScreen: React.FC<StoryHubScreenProps> = ({ stories, onReaction }) => {
    const [reactedStories, setReactedStories] = useState(new Set<number>());

    const handleReactionClick = (storyId: number, reactionType: ReactionType) => {
        if (reactedStories.has(storyId)) return;

        onReaction(storyId, reactionType);
        setReactedStories(prev => new Set(prev).add(storyId));
    };
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">Story Hub Gallery</h2>
                <p className="text-lg text-gray-600">See what other creators have made! All stories are moderated for safety.</p>
            </div>

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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoryHubScreen;
