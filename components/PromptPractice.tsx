
import React, { useState, useEffect, useRef } from 'react';
import { analyzePrompt, generateSpeech } from '../services/geminiService.ts';
import { PromptAnalysis } from '../types.ts';
import { decode, decodeAudioData } from '../utils/audioUtils.ts';
import PromptTemplates from './PromptTemplates.tsx';
import { playSound } from '../utils/soundUtils.ts';

interface PromptPracticeProps {
  setNextDisabled: (disabled: boolean) => void;
  isSoundEnabled: boolean;
}

const PromptPractice: React.FC<PromptPracticeProps> = ({ setNextDisabled, isSoundEnabled }) => {
    const [reflection, setReflection] = useState('');
    const [userPrompt, setUserPrompt] = useState('');
    const [analysisResult, setAnalysisResult] = useState<PromptAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
      setNextDisabled(reflection.trim().length < 10);
    }, [reflection, setNextDisabled]);

    useEffect(() => {
        return () => {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(console.error);
            }
        };
    }, []);


    const PromptExample = ({ type, prompt, description, title }: {type: 'Vague' | 'Strong', prompt: string, description: string, title: string}) => (
        <div className={`p-4 rounded-lg border-2 ${type === 'Vague' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'}`}>
            <h5 className="font-bold text-gray-500 dark:text-gray-400 mb-2">{title}</h5>
            <h4 className={`font-bold ${type === 'Vague' ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>{type} Prompt</h4>
            <p className="font-mono text-gray-800 dark:text-gray-200 my-2 bg-white dark:bg-gray-800 p-2 rounded">"{prompt}"</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
    
    const playAudio = async (base64Audio: string) => {
        try {
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
            const audioBytes = decode(base64Audio);
            const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start(0);
            audioSourceRef.current = source;
        } catch (error) {
            console.error("Error playing feedback audio:", error);
        }
    };

    const handleAnalyzePrompt = async () => {
        if (!userPrompt.trim()) return;
        playSound('click', isSoundEnabled);
        setIsAnalyzing(true);
        setAnalysisResult(null);
        const result = await analyzePrompt(userPrompt);
        setAnalysisResult(result);
        setIsAnalyzing(false);
        if (result && result.score > 0) {
            playSound('success', isSoundEnabled);
            // Generate and play audio feedback
            const feedbackText = `${result.title}. Your prompt score is ${result.score} out of 10.`;
            const audioData = await generateSpeech(feedbackText);
            if (audioData) {
                await playAudio(audioData);
            }
        } else {
            playSound('error', isSoundEnabled);
        }
    };


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Prompt Triad Practice</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Let's learn the secret to good AI results: writing clear prompts!</p>
        <p className="text-2xl font-bold mt-4">Idea → Prompt → Creation</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100 mb-4">Vague vs. Strong Prompts</h3>
        <div className="space-y-6">
            <PromptExample 
                title="Goal: Create a Picture"
                type="Vague"
                prompt="a dog"
                description="This is okay, but the AI has to guess what kind of dog to draw."
            />
             <PromptExample 
                title="Goal: Create a Picture"
                type="Strong"
                prompt="A happy, fluffy golden retriever puppy playing with a red ball in a sunny green park."
                description="This gives the AI specific details about the subject (puppy), action (playing), and setting (park), leading to a much better picture!"
            />
            <hr className="dark:border-gray-600" />
             <PromptExample 
                title="Goal: Write a Poem"
                type="Vague"
                prompt="a poem about the moon"
                description="This is too general. The AI doesn't know what kind of poem (happy, sad, funny?) to write."
            />
             <PromptExample 
                title="Goal: Write a Poem"
                type="Strong"
                prompt="Write a short, rhyming poem from the perspective of a curious cat staring at the glowing full moon on a quiet night."
                description="This sets a clear tone (quiet, curious), perspective (a cat), and form (short, rhyming)."
            />
            <hr className="dark:border-gray-600" />
             <PromptExample 
                title="Goal: Describe a Character"
                type="Vague"
                prompt="a space explorer"
                description="We don't know anything about this person's personality or looks."
            />
             <PromptExample 
                title="Goal: Describe a Character"
                type="Strong"
                prompt="Describe a brave but clumsy young space explorer with messy red hair, mismatched socks, and a backpack full of cosmic snacks."
                description="Now we have a clear picture of the character's personality (brave but clumsy) and appearance!"
            />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100 mb-2">Test Your Prompt Skills</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Write your own prompt below and see what the AI Prompt Coach thinks!</p>
        <PromptTemplates onSelect={(p) => setUserPrompt(p)} />
        <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g., A shy octopus who wants to learn how to dance..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg h-24 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700"
            aria-label="User prompt for analysis"
        />
        <button
            onClick={handleAnalyzePrompt}
            disabled={isAnalyzing || !userPrompt.trim()}
            className="mt-2 w-full bg-yellow-400 text-yellow-900 font-bold py-3 rounded-lg hover:bg-yellow-500 disabled:bg-gray-300 transition-colors"
        >
            {isAnalyzing ? 'Analyzing...' : 'Analyze My Prompt'}
        </button>

        {isAnalyzing && <div className="text-center text-gray-600 dark:text-gray-400 mt-4">The Prompt Coach is reading your idea...</div>}

        {analysisResult && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg animate-fade-in-up">
                <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300">{analysisResult.title}</h4>
                <div className="flex items-center gap-2 my-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div 
                            className="bg-blue-600 h-4 rounded-full" 
                            style={{ width: `${analysisResult.score * 10}%` }}
                        ></div>
                    </div>
                    <span className="font-bold text-blue-700 dark:text-blue-300">{analysisResult.score}/10</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    {analysisResult.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100 mb-4">Reflection Journal</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Think about what you learned. How does giving clear instructions help the AI? How is that similar to talking to people?</p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="I learned that being specific is important because..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg h-32 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700"
        />
      </div>

      {reflection.trim().length < 10 && (
        <div className="text-center">
            <p className="text-sm text-gray-500 mt-2">Write a little in your journal to enable the 'Next' button!</p>
        </div>
      )}
    </div>
  );
};

export default PromptPractice;