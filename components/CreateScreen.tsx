import React, { useState, useEffect, useRef } from 'react';
import { ArtStyle, Vibe, VoiceName, Character, ProgressStep } from '../types.ts';
import { generateStory, generateImage, generateSpeech } from '../services/geminiService.ts';
import { decode, decodeAudioData } from '../utils/audioUtils.ts';
import { playSound } from '../utils/soundUtils.ts';
import VibeSelector from './VibeSelector.tsx';
import VoiceSelector from './VoiceSelector.tsx';
import CharacterCustomizer from './CharacterCustomizer.tsx';
import MusicCreator from './MusicCreator.tsx';
import LabJournal from './LabJournal.tsx';
import { PlayIcon, PauseIcon, StopIcon } from './Icons.tsx';
import InspirationDeckModal from './InspirationDeckModal.tsx';
import SubmissionModal from './SubmissionModal.tsx';
import ProgressHUD from './ProgressHUD.tsx';
import CreativityMeterModal from './CreativityMeterModal.tsx';
import StructuredPromptBuilder from './StructuredPromptBuilder.tsx';

interface CreateScreenProps {
  onBackToHub: () => void;
  onSubmitToGallery: (creation: { storyText: string; imageUrl: string }) => void;
  isSoundEnabled: boolean;
}

const CreateScreen: React.FC<CreateScreenProps> = ({ onBackToHub, onSubmitToGallery, isSoundEnabled }) => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    story: false, image: false, audio: false
  });

  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [selectedArtStyle, setSelectedArtStyle] = useState<ArtStyle>('cartoon');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Ruby');

  const [uploadedImage, setUploadedImage] = useState<{data: string, mimeType: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [character, setCharacter] = useState<Character>({
    personality: null, bodyType: null, hair: null, eyes: null, clothing: null, accessories: null
  });

  const [journal, setJournal] = useState({ story: '', art: '', music: '', reflection: '' });

  const [narrationStatus, setNarrationStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const musicRef = useRef<HTMLAudioElement>(null);

  const [isInspirationOpen, setIsInspirationOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isCreativityMeterOpen, setIsCreativityMeterOpen] = useState(false);

  const [completedSteps, setCompletedSteps] = useState(new Set<ProgressStep>());
  const [imaginationPower, setImaginationPower] = useState(50);

  useEffect(() => {
    const promptFromStorage = localStorage.getItem('initialPrompt');
    if (promptFromStorage) {
      setInitialPrompt(promptFromStorage);
      localStorage.removeItem('initialPrompt');
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (audioSourceRef.current) audioSourceRef.current.stop();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);


  useEffect(() => {
    if (story) setCompletedSteps(prev => new Set(prev).add('story'));
    if (imageUrl) setCompletedSteps(prev => new Set(prev).add('art'));
    if (musicUrl) setCompletedSteps(prev => new Set(prev).add('music'));
    if (journal.reflection.length > 10) setCompletedSteps(prev => new Set(prev).add('reflection'));
  }, [story, imageUrl, musicUrl, journal.reflection]);

  const setLoading = (key: string, value: boolean) => setIsLoading(prev => ({ ...prev, [key]: value }));

  const handleGenerateStory = async () => {
    if (!prompt) return;
    playSound('click', isSoundEnabled);
    setLoading('story', true);
    setStory('');
    const fullPrompt = `${prompt}${characterPrompt()}`;
    const newStory = await generateStory(fullPrompt, selectedVibe || undefined);
    setStory(newStory);
    setLoading('story', false);
    playSound('success', isSoundEnabled);
    setIsCreativityMeterOpen(true);
  };

  const handleGenerateImage = async () => {
    if (!story && !prompt) return;
    playSound('click', isSoundEnabled);
    setLoading('image', true);
    setImageUrl('');
    const imagePrompt = story || prompt;
    const result = await generateImage(imagePrompt, selectedArtStyle, uploadedImage || undefined);
    if (result) {
        setImageUrl(result);
        playSound('success', isSoundEnabled);
    }
    setLoading('image', false);
  };

  const resetNarrationAudio = (clearState: boolean = true) => {
    if (audioSourceRef.current) {
        audioSourceRef.current.onended = null;
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
    }
    if (clearState) {
      audioBufferRef.current = null;
      setNarrationStatus('idle');
    }
  };

  const playNarrationAudio = () => {
      const audioBuffer = audioBufferRef.current;
      if (!audioBuffer) return;
  
      if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume().then(() => setNarrationStatus('playing'));
          return;
      }
  
      resetNarrationAudio(false);
  
      const source = audioContextRef.current!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current!.destination);
      source.start(0);
      source.onended = () => {
           setNarrationStatus(current => (current === 'playing' ? 'idle' : current));
      };
      audioSourceRef.current = source;
      setNarrationStatus('playing');
  };

  const handlePlayPauseNarration = () => {
      playSound('click', isSoundEnabled);
      if (!audioContextRef.current || !audioBufferRef.current) return;
      if (narrationStatus === 'playing') {
        audioContextRef.current.suspend().then(() => setNarrationStatus('paused'));
      } else {
        playNarrationAudio();
      }
  };

  const handleStopNarration = () => {
      playSound('click', isSoundEnabled);
      resetNarrationAudio(true);
  };

  const handleGenerateAudio = async () => {
    if (!story) return;
    playSound('click', isSoundEnabled);
    resetNarrationAudio(true);

    setLoading('audio', true);
    setNarrationStatus('loading');
    const base64Audio = await generateSpeech(story, selectedVoice);
    
    if (base64Audio) {
        try {
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioBytes = decode(base64Audio);
            const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            audioBufferRef.current = buffer;
            playNarrationAudio();
            playSound('success', isSoundEnabled);
        } catch (error) {
            console.error("Error processing audio:", error);
            resetNarrationAudio(true);
            alert("Sorry, an error occurred while trying to play the audio.");
        }
    } else {
        resetNarrationAudio(true);
        alert("Sorry, we couldn't generate audio right now.");
    }
    setLoading('audio', false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          setUploadedImage({ data: base64String, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const characterPrompt = () => {
    const parts = [
      character.personality && `with a ${character.personality} personality`,
      character.bodyType && `who is a ${character.bodyType}`,
      character.hair && `with ${character.hair} hair`,
      character.eyes && `and ${character.eyes} eyes`,
      character.clothing && `wearing ${character.clothing}`,
      character.accessories && `with a ${character.accessories}`
    ].filter(Boolean).join(', ');
    return parts ? ` The main character is ${parts}.` : '';
  };

  const handleJournalChange = (key: keyof typeof journal, value: string) => {
    setJournal(prev => ({ ...prev, [key]: value }));
  };

  const toggleMusic = () => {
    playSound('click', isSoundEnabled);
    if (musicRef.current) {
        if(isMusicPlaying) {
            musicRef.current.pause();
        } else {
            musicRef.current.play();
        }
        setIsMusicPlaying(!isMusicPlaying);
    }
  };
  
  const handleSubmission = () => {
    if (story && imageUrl) {
      onSubmitToGallery({ storyText: story, imageUrl });
      alert("Your creation has been submitted to your teacher for review!");
    }
  };

  const handleArtStyleClick = (style: ArtStyle) => {
    playSound('click', isSoundEnabled);
    setSelectedArtStyle(style);
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 px-4">
      <ProgressHUD completedSteps={completedSteps} imaginationPower={imaginationPower}/>
      <CreativityMeterModal isOpen={isCreativityMeterOpen} onClose={() => setIsCreativityMeterOpen(false)} isSoundEnabled={isSoundEnabled} />
      <InspirationDeckModal isOpen={isInspirationOpen} onClose={() => setIsInspirationOpen(false)} onSelect={p => setPrompt(p)} isSoundEnabled={isSoundEnabled} />
      <SubmissionModal isOpen={isSubmissionOpen} onClose={() => setIsSubmissionOpen(false)} onConfirm={handleSubmission} isSoundEnabled={isSoundEnabled} />

      {/* Left Column: Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">1. Start with an Idea</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Build your story piece by piece. Use the 💡 for help!</p>
          <StructuredPromptBuilder
            initialPrompt={initialPrompt}
            onChange={setPrompt}
            isSoundEnabled={isSoundEnabled}
          />
          <div className="flex gap-2 mt-4">
            <button onClick={() => { playSound('click', isSoundEnabled); setIsInspirationOpen(true); }} className="w-full bg-yellow-400 text-yellow-900 text-sm font-bold py-2 rounded-lg hover:bg-yellow-500">
              Draw a Card for a Full Idea
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">2. Customize Character (Optional)</h3>
          <CharacterCustomizer character={character} onCharacterChange={setCharacter} isSoundEnabled={isSoundEnabled} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">3. Set the Vibe</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose a feeling for your story. This will help the AI write in the right tone!</p>
          <VibeSelector selectedVibe={selectedVibe} onVibeChange={setSelectedVibe} isSoundEnabled={isSoundEnabled} />
        </div>
        
        <button onClick={handleGenerateStory} disabled={isLoading.story || !prompt} className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 transition-transform transform hover:scale-105">
          {isLoading.story ? 'Writing...' : 'Generate Story'}
        </button>
      </div>

      {/* Right Column: Creation */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">4. Your Story</h3>
          {story ? (
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{story}</p>
          ) : (
            <p className="text-gray-500 italic">Your generated story will appear here.</p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">5. Create an Illustration</h3>
          <div className="flex flex-wrap gap-2">
            {(['cartoon', 'watercolor', 'pixel_art', 'realistic', 'comic_book', 'afrofuturism', 'collage'] as ArtStyle[]).map(style => (
              <button key={style} onClick={() => handleArtStyleClick(style)} className={`px-3 py-1 text-sm font-semibold rounded-full ${selectedArtStyle === style ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{style.replace('_', ' ')}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { playSound('click', isSoundEnabled); fileInputRef.current?.click(); }} className="w-full bg-gray-200 dark:bg-gray-600 font-bold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
              {uploadedImage ? 'Image Uploaded!' : 'Upload Image'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            <button onClick={handleGenerateImage} disabled={isLoading.image || (!story && !prompt)} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-500">
              {isLoading.image ? 'Drawing...' : 'Generate Image'}
            </button>
          </div>
          {imageUrl ? (
            <img src={imageUrl} alt="Generated art" className="rounded-lg w-full" />
          ) : (
             <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">Your generated image will appear here.</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">6. Narrate Your Story</h3>
          <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} isSoundEnabled={isSoundEnabled} />
          <button onClick={handleGenerateAudio} disabled={isLoading.audio || !story} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-500">
            {isLoading.audio ? 'Recording...' : 'Generate Narration'}
          </button>
          {/* FIX: Replaced <audio> tag with AudioContext-based controls. */}
          {(narrationStatus === 'playing' || narrationStatus === 'paused') && (
            <div className="flex items-center gap-2">
              <button onClick={handlePlayPauseNarration} aria-label={narrationStatus === 'playing' ? 'Pause narration' : 'Play narration'}>
                {narrationStatus === 'playing' ? <PauseIcon className="h-8 w-8 text-indigo-600" /> : <PlayIcon className="h-8 w-8 text-indigo-600" />}
              </button>
               <button onClick={handleStopNarration} aria-label="Stop narration">
                <StopIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </button>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Listen to your story!</p>
            </div>
          )}
        </div>
        
        {story && <MusicCreator story={story} onMusicGenerated={url => setMusicUrl(url)} isSoundEnabled={isSoundEnabled} />}

        {musicUrl && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center gap-4">
                <audio ref={musicRef} src={musicUrl} loop onPlay={() => setIsMusicPlaying(true)} onPause={() => setIsMusicPlaying(false)} />
                <button onClick={toggleMusic}>
                    {isMusicPlaying ? <PauseIcon className="h-8 w-8 text-green-600" /> : <PlayIcon className="h-8 w-8 text-green-600" />}
                </button>
                <p className="font-semibold text-gray-700 dark:text-gray-200">Background music added!</p>
            </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-100">9. AI Lab Journal</h3>
            <LabJournal icon="📓" title="Story Reflection" question="How did the AI help you with the story? What was your favorite part?" value={journal.story} onChange={v => handleJournalChange('story', v)} placeholder="The AI came with..." />
            <LabJournal icon="🎨" title="Art Reflection" question="How does the art style you chose match the feeling of your story?" value={journal.art} onChange={v => handleJournalChange('art', v)} placeholder="The watercolor style feels..." />
            <LabJournal icon="🎶" title="Music Reflection" question="Why did you choose this music? How does it make the story feel?" value={journal.music} onChange={v => handleJournalChange('music', v)} placeholder="The cinematic music makes it feel..." />
            <LabJournal icon="🤔" title="Final Reflection" question="What did you learn about teamwork between you and the AI today?" value={journal.reflection} onChange={v => handleJournalChange('reflection', v)} placeholder="I learned that..." />
        </div>

        <div className="flex gap-4">
          <button onClick={() => { playSound('click', isSoundEnabled); onBackToHub(); }} className="w-full bg-gray-500 text-white font-bold py-4 rounded-lg text-lg hover:bg-gray-600">
            Back to Hub
          </button>
          {story && imageUrl ? (
            <button 
              onClick={() => { playSound('click', isSoundEnabled); setIsSubmissionOpen(true); }}
              className="w-full bg-yellow-500 text-white font-bold py-4 rounded-lg text-lg hover:bg-yellow-600 animate-fade-in-up"
            >
              Submit to GTC Gallery
            </button>
          ) : (
            <div className="w-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateScreen;