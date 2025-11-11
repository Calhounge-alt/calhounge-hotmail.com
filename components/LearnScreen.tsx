import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { playSound } from '../utils/soundUtils';
import { PlayIcon, PauseIcon, StopIcon } from './Icons';

interface LearnScreenProps {
  onBack: () => void;
  isSoundEnabled: boolean;
}

const learnContent = [
    {
        icon: '🤖',
        title: 'What is Artificial Intelligence (AI)?',
        content: "Think of AI as a computer program that can learn and solve problems, almost like a human brain! It's not alive and doesn't have feelings, but it's very good at recognizing patterns. We train it with lots of information (like books or pictures), and it uses that training to make new things, like the stories and art in this app."
    },
    {
        icon: '🎨',
        title: 'How AI Creates',
        content: "When you give the AI a prompt, it's not 'thinking' like you do. For stories, it predicts the next best word based on all the stories it has read before. For pictures, it starts with digital noise (like TV static) and slowly shapes it into an image that matches your description. It's all about math and patterns, guided by your human idea!"
    },
    {
        icon: '💡',
        title: 'How AI Can Help with Reading & Writing',
        content: "AI can be your personal reading and writing assistant! Stuck on a word? Ask AI to define it for you. Need an idea? Use AI to brainstorm topics for a story. Want to improve a sentence? Ask AI for suggestions to make it stronger. Don't understand a paragraph? Ask AI to explain it simply. Remember, AI is a tool to help *you* think, not to do the thinking for you!"
    },
    {
        icon: '🛡️',
        title: 'Being a Responsible Digital Citizen',
        content: "Using AI is a superpower, and with great power comes great responsibility! Always remember the rules from our Safety Kit: protect your personal information, think critically about what the AI tells you, and always use your own voice and creativity. You are in charge of the technology, not the other way around."
    },
    {
        icon: '📜',
        title: 'A Brief History of Storytelling',
        content: "Humans have always told stories, from painting on cave walls thousands of years ago to writing books and making movies. AI is just the newest tool in our storytelling toolkit. It's like getting a brand new pencil or a magical paintbrush. The tool changes, but the most important part—the human heart and imagination—stays the same."
    },
    {
        icon: '📖',
        title: 'Glossary of Creative Terms',
        content: "Prompt: An instruction you give to an AI. The clearer the prompt, the better the result! | Algorithm: A set of rules a computer follows to complete a task. AI uses very complex algorithms. | Digital Literacy: The skills you need to live, learn, and work in a society where communication and access to information is increasingly through digital technologies like the internet."
    }
];

type NarrationStatus = 'idle' | 'loading' | 'playing' | 'paused';

const AccordionItem = ({ 
    icon, 
    title, 
    content, 
    isOpen, 
    onClick, 
    narrationStatus, 
    onNarrateClick, 
    onPlayPauseClick, 
    onStopClick,
    isSoundEnabled,
}: { 
    icon: string, 
    title: string, 
    content: string, 
    isOpen: boolean, 
    onClick: () => void,
    narrationStatus: NarrationStatus,
    onNarrateClick: () => void,
    onPlayPauseClick: () => void,
    onStopClick: () => void,
    isSoundEnabled: boolean,
}) => {
    const handleNarrate = () => {
        playSound('click', isSoundEnabled);
        onNarrateClick();
    };
    const handlePlayPause = () => {
        playSound('click', isSoundEnabled);
        onPlayPauseClick();
    };
    const handleStop = () => {
        playSound('click', isSoundEnabled);
        onStopClick();
    };

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-left">{title}</h3>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
            >
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                    <p>{content}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {narrationStatus === 'loading' && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Generating audio...</span>
                            </div>
                        )}
                        {narrationStatus === 'idle' && (
                            <button onClick={handleNarrate} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                Read Aloud
                            </button>
                        )}
                        {(narrationStatus === 'playing' || narrationStatus === 'paused') && (
                            <div className="flex items-center gap-2">
                                <button onClick={handlePlayPause} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors" aria-label={narrationStatus === 'playing' ? 'Pause read-aloud' : 'Play read-aloud'}>
                                    {narrationStatus === 'playing' ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                                    <span>{narrationStatus === 'playing' ? 'Pause' : 'Resume'}</span>
                                </button>
                                <button onClick={handleStop} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Stop read-aloud">
                                    <StopIcon className="h-5 w-5" />
                                    <span>Stop</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const LearnScreen: React.FC<LearnScreenProps> = ({ onBack, isSoundEnabled }) => {
    const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
    const [narrationState, setNarrationState] = useState<{ index: number; status: NarrationStatus }>({ index: -1, status: 'idle' });
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferCacheRef = useRef<Map<number, AudioBuffer>>(new Map());
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        return () => {
          if (audioSourceRef.current) audioSourceRef.current.stop();
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
          }
        };
    }, []);

    const resetAudio = (clearState: boolean = true) => {
        if (audioSourceRef.current) {
            audioSourceRef.current.onended = null;
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
        }
        if (clearState) {
            setNarrationState({ index: -1, status: 'idle' });
        }
    };
    
    const playAudio = (index: number) => {
        const audioBuffer = audioBufferCacheRef.current.get(index);
        if (!audioBuffer) return;
    
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
            return;
        }
    
        resetAudio(false);
    
        const source = audioContextRef.current!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current!.destination);
        source.start(0);
        source.onended = () => {
             setNarrationState(current => (current.index === index ? { ...current, status: 'idle' } : current));
        };
        audioSourceRef.current = source;
        setNarrationState({ index, status: 'playing' });
    };

    const handlePlayPause = () => {
        if (!audioContextRef.current) return;
        if (narrationState.status === 'playing') {
          audioContextRef.current.suspend();
          setNarrationState(prev => ({...prev, status: 'paused' }));
        } else if (narrationState.status === 'paused') {
          audioContextRef.current.resume();
          setNarrationState(prev => ({...prev, status: 'playing' }));
        }
    };

    const handleStop = () => {
        resetAudio(true);
    };

    const handleNarrate = async (index: number, text: string) => {
        // If it's already the current track, just play/pause
        if (narrationState.index === index && narrationState.status !== 'idle' && narrationState.status !== 'loading') {
            handlePlayPause();
            return;
        }
        
        resetAudio(false);
        
        // If we have a cached buffer, play it directly
        if (audioBufferCacheRef.current.has(index)) {
            playAudio(index);
            return;
        }

        setNarrationState({ index, status: 'loading' });
        const base64Audio = await generateSpeech(text);
        
        if (base64Audio) {
            try {
                if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const audioBytes = decode(base64Audio);
                const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
                audioBufferCacheRef.current.set(index, buffer);
                playAudio(index);
            } catch (error) {
                console.error("Error processing audio:", error);
                resetAudio(true);
                alert("Sorry, an error occurred while trying to play the audio.");
            }
        } else {
            resetAudio(true);
            alert("Sorry, we couldn't generate audio right now.");
        }
    };

    const handleItemClick = (index: number) => {
        playSound('click', isSoundEnabled);
        setOpenItemIndex(openItemIndex === index ? null : index);
    };

    const handleBackClick = () => {
        playSound('click', isSoundEnabled);
        onBack();
    };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">Learn More About Creativity & Code</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Expand your knowledge and become an AI expert!</p>
      </div>

      <div className="space-y-4">
        {learnContent.map((item, index) => (
            <AccordionItem 
                key={index}
                icon={item.icon}
                title={item.title}
                content={item.content}
                isOpen={openItemIndex === index}
                onClick={() => handleItemClick(index)}
                narrationStatus={narrationState.index === index ? narrationState.status : 'idle'}
                onNarrateClick={() => handleNarrate(index, item.content)}
                onPlayPauseClick={handlePlayPause}
                onStopClick={handleStop}
                isSoundEnabled={isSoundEnabled}
            />
        ))}
      </div>

      <div className="text-center">
        <button 
            onClick={handleBackClick}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
            Back to Workshop
        </button>
      </div>
    </div>
  );
};

export default LearnScreen;
