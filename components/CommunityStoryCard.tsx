import React, { useState, useRef, useEffect } from 'react';
import { CommunityStory, ReactionType } from '../types';
import { LightbulbIcon, PaletteIcon, ThoughtBubbleIcon, PlayIcon, PauseIcon, StopIcon } from './Icons';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';

interface CommunityStoryCardProps {
    story: CommunityStory;
    onReaction: (storyId: number, reactionType: ReactionType) => void;
    hasReacted: boolean;
}

type NarrationState = 'idle' | 'playing' | 'paused';

const ReactionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    count: number;
    onClick: () => void;
    disabled: boolean;
}> = ({ icon, label, count, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-blue-100 dark:disabled:bg-blue-900/50 disabled:text-blue-700 dark:disabled:text-blue-300 disabled:cursor-not-allowed"
        aria-label={`React with ${label}`}
    >
        {icon}
        <span className="font-semibold">{count}</span>
    </button>
);

const CommunityStoryCard: React.FC<CommunityStoryCardProps> = ({ story, onReaction, hasReacted }) => {
    const [isNarrationLoading, setIsNarrationLoading] = useState(false);
    const [narrationState, setNarrationState] = useState<NarrationState>('idle');
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        // Cleanup audio context on unmount
        return () => {
          if (audioSourceRef.current) audioSourceRef.current.stop();
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
          }
        };
      }, []);

    const playFromStart = () => {
        if (!audioBufferRef.current || !audioContextRef.current) return;
        if (audioSourceRef.current) audioSourceRef.current.stop();
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        source.onended = () => setNarrationState('idle');
        audioSourceRef.current = source;
        setNarrationState('playing');
    };

    const handlePlayPause = () => {
        if (!audioContextRef.current) return;
        if (narrationState === 'playing') {
          audioContextRef.current.suspend();
          setNarrationState('paused');
        } else if (narrationState === 'paused') {
          audioContextRef.current.resume();
          setNarrationState('playing');
        } else {
          playFromStart();
        }
    };

    const handleStop = () => {
        if (audioSourceRef.current) {
          audioSourceRef.current.stop();
        }
    };

    const handleNarrateStory = async () => {
        if (!story.storyText || isNarrationLoading || audioBufferRef.current) return;
        setIsNarrationLoading(true);
        const base64Audio = await generateSpeech(story.storyText);
        setIsNarrationLoading(false);
        if (base64Audio) {
          try {
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioBytes = decode(base64Audio);
            const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            audioBufferRef.current = buffer;
            playFromStart();
          } catch (error) {
            console.error("Error processing audio:", error);
            alert("Sorry, an error occurred while trying to play the audio.");
          }
        } else {
          alert("Sorry, we couldn't generate audio for this story right now.");
        }
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <img src={story.imageUrl} alt={`Art for a story by ${story.authorName}`} className="rounded-lg w-full object-cover aspect-square" />
                </div>
                <div className="md:col-span-2 flex flex-col">
                    <div className="flex-grow">
                        <p className="text-gray-700 dark:text-gray-300 mb-4 text-base">"{story.storyText}"</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100 text-right">- {story.authorName}</p>
                        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {/* Narration Controls */}
                            <div className="flex items-center gap-2">
                                {isNarrationLoading ? (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>Loading...</span>
                                    </div>
                                ) : !audioBufferRef.current ? (
                                    <button onClick={handleNarrateStory} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-1.5 px-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm">
                                        Read Aloud
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button onClick={handlePlayPause} className="flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full h-8 w-8 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors" aria-label={narrationState === 'playing' ? 'Pause read-aloud' : 'Play read-aloud'}>
                                            {narrationState === 'playing' ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                                        </button>
                                        <button onClick={handleStop} disabled={narrationState === 'idle'} className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Stop read-aloud">
                                            <StopIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Reaction Controls */}
                            <div className="flex items-center justify-end gap-2 sm:gap-3">
                                <p className={`hidden sm:block text-sm font-semibold ${hasReacted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {hasReacted ? 'Thanks!' : 'React:'}
                                </p>
                                <ReactionButton
                                    icon={<LightbulbIcon />}
                                    label="Inspiring"
                                    count={story.reactions.inspiring}
                                    onClick={() => onReaction(story.id, 'inspiring')}
                                    disabled={hasReacted}
                                />
                                <ReactionButton
                                    icon={<PaletteIcon />}
                                    label="Creative"
                                    count={story.reactions.creative}
                                    onClick={() => onReaction(story.id, 'creative')}
                                    disabled={hasReacted}
                                />
                                <ReactionButton
                                    icon={<ThoughtBubbleIcon />}
                                    label="Made Me Think"
                                    count={story.reactions.thoughtful}
                                    onClick={() => onReaction(story.id, 'thoughtful')}
                                    disabled={hasReacted}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityStoryCard;