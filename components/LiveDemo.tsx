
import React, { useState, useEffect } from 'react';

interface LiveDemoProps {
  setNextDisabled: (disabled: boolean) => void;
}

const LiveDemo: React.FC<LiveDemoProps> = ({ setNextDisabled }) => {
    const [prompt, setPrompt] = useState('');
    const [story, setStory] = useState('');
    const fullPrompt = 'A brave little knight who is afraid of the dark, but their best friend is a glowing firefly.';
    const fullStory = 'Sir Reginald, the bravest knight in the land by day, had a secret: he was terrified of the dark. Every night, his castle room felt like a giant, shadowy monster. But he was never truly alone. His best friend, a tiny firefly named Flicker, would glow brightly, casting gentle light on the walls. "With you here, I can be brave even at night," Reginald would whisper. Flicker would dance in the air, a tiny, sparkling star chasing away the scary shadows.';

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i <= fullPrompt.length) {
                setPrompt(fullPrompt.substring(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [fullPrompt]);

    useEffect(() => {
        if (prompt === fullPrompt) {
            let i = 0;
            const interval = setInterval(() => {
                if (i <= fullStory.length) {
                    setStory(fullStory.substring(0, i));
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [prompt, fullPrompt, fullStory]);

    useEffect(() => {
      setNextDisabled(story.length < fullStory.length);
    }, [story, fullStory.length, setNextDisabled]);


    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Live Demo: Prompt in Action</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">Watch how a detailed prompt turns into a story!</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                <div>
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-1">PROMPT:</h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-gray-800 dark:text-gray-200 min-h-[6rem]">
                        {prompt}{prompt.length < fullPrompt.length && <span className="animate-pulse">|</span>}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-1">AI CREATION:</h3>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-gray-700 dark:text-gray-300 min-h-[12rem]">
                        {story}{story.length > 0 && story.length < fullStory.length && <span className="animate-pulse">|</span>}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LiveDemo;