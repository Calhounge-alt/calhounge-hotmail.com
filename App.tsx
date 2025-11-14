

import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from './hooks/useLocalization.ts';
import { CommunityStory, ReactionType, ShopItem, AvatarState, ProgressStep } from './types.ts';
import { INITIAL_COMMUNITY_STORIES } from './data/communityStories.ts';
import { CLASSROOM_DATA } from './data/teacherViewData.ts';
import OnboardingModal from './components/OnboardingModal.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import MiniLesson from './components/MiniLesson.tsx';
import LiveDemo from './components/LiveDemo.tsx';
import PromptPractice from './components/PromptPractice.tsx';
import RewardsScreen from './components/RewardsScreen.tsx';
import HubScreen from './components/HubScreen.tsx';
import CreateScreen from './components/CreateScreen.tsx';
import LearnScreen from './components/LearnScreen.tsx';
import StoryHubScreen from './components/StoryHubScreen.tsx';
import Header from './components/Header.tsx';
import GlobalNav from './components/GlobalNav.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import TeacherControlPanel from './components/TeacherControlPanel.tsx';
import EthicsPlayground from './components/EthicsPlayground.tsx';
import FreedomFightersZone from './components/FreedomFightersZone.tsx';
import ShopScreen from './components/ShopScreen.tsx';
import GTCGalleryScreen from './components/GTCGalleryScreen.tsx';
import { SHOP_ITEMS } from './data/shopItems.ts';
import AccessRequestModal from './components/AccessRequestModal.tsx';

type AppStep = 'welcome' | 'lesson' | 'demo' | 'practice' | 'rewards' | 'hub';
type AppScreen = 'hub' | 'create' | 'learn' | 'storyHub' | 'teacher' | 'ethics' | 'freedomFighters' | 'shop' | 'gtcGallery';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));
  const [appStep, setAppStep] = useState<AppStep>(userName ? 'hub' : 'welcome');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('hub');

  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as any || 'light');
  const [font, setFont] = useState<'default' | 'dyslexia-friendly'>(localStorage.getItem('font') as any || 'default');
  const [language, setLanguage] = useState<'en' | 'es'>(localStorage.getItem('language') as any || 'en');
  const [isSoundEnabled, setIsSoundEnabled] = useState(localStorage.getItem('isSoundEnabled') === 'true' || localStorage.getItem('isSoundEnabled') === null);
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccessRequestOpen, setIsAccessRequestOpen] = useState(false);
  const [isNextDisabled, setNextDisabled] = useState(true);

  const [communityStories, setCommunityStories] = useState<CommunityStory[]>(INITIAL_COMMUNITY_STORIES);

  const [coins, setCoins] = useState<number>(parseInt(localStorage.getItem('coins') || '500'));
  const [avatarState, setAvatarState] = useState<AvatarState>(JSON.parse(localStorage.getItem('avatarState') || 'null') || { hat: null, accessory: null, background: null });
  const [purchasedItems, setPurchasedItems] = useState<Set<number>>(new Set(JSON.parse(localStorage.getItem('purchasedItems') || '[]')));


  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('font', font);
  }, [font]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  useEffect(() => {
    localStorage.setItem('isSoundEnabled', isSoundEnabled.toString());
  }, [isSoundEnabled]);

  const handleNameSet = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setAppStep('lesson');
    setNextDisabled(true); // Reset for the next step
  };

  const handleNext = () => {
    const steps: AppStep[] = ['welcome', 'lesson', 'demo', 'practice', 'rewards', 'hub'];
    const currentIndex = steps.indexOf(appStep);
    if (currentIndex < steps.length - 1) {
      setAppStep(steps[currentIndex + 1]);
      setNextDisabled(true); // Disable by default for next step
    }
  };

  const handleBack = () => {
    const steps: AppStep[] = ['welcome', 'lesson', 'demo', 'practice', 'rewards', 'hub'];
    const currentIndex = steps.indexOf(appStep);
    if (currentIndex > 0) {
      setAppStep(steps[currentIndex - 1]);
      setNextDisabled(false); // Should be enabled going back
    }
  };
  
  const navigateToScreen = (screen: AppScreen) => {
    if (screen === 'teacher' && isTeacherMode) {
      setCurrentScreen('teacher');
    } else if (screen !== 'teacher') {
      setCurrentScreen(screen);
    }
    setAppStep('hub'); // Ensure we are in the main app, not onboarding
  };

  const handleReaction = (storyId: number, reactionType: ReactionType) => {
    setCommunityStories(stories =>
      stories.map(s =>
        s.id === storyId ? { ...s, reactions: { ...s.reactions, [reactionType]: s.reactions[reactionType] + 1 } } : s
      )
    );
  };
  
  const handleSubmitToGallery = (creation: { storyText: string; imageUrl: string }) => {
    // In a real app, this would go to a moderation queue. Here, we just add it to the classroom data for the teacher view.
    const newStudentData = {
        id: CLASSROOM_DATA.length + 1,
        name: userName || 'New Creator',
        storyText: creation.storyText,
        imageUrl: creation.imageUrl,
        journalEntries: { story: '', art: '', music: '', reflection: '' },
        progress: new Set<ProgressStep>(['story', 'art', 'export']),
    };
    // Note: this won't persist, it's just for the demo session.
    CLASSROOM_DATA.push(newStudentData);
    setCoins(c => c + 100); // Reward for submitting
  };

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price) {
        setCoins(c => c - item.price);
        setPurchasedItems(prev => new Set(prev).add(item.id));
    }
  };

  const handleEquip = (item: ShopItem) => {
    let categoryKey: keyof AvatarState;
    switch (item.category) {
      case 'hats':
        categoryKey = 'hat';
        break;
      case 'accessories':
        categoryKey = 'accessory';
        break;
      case 'backgrounds':
        categoryKey = 'background';
        break;
      default:
        console.error('Invalid shop category:', (item as any).category);
        return;
    }
    setAvatarState(prev => ({ ...prev, [categoryKey]: item }));
  };


  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
    localStorage.setItem('avatarState', JSON.stringify(avatarState));
    localStorage.setItem('purchasedItems', JSON.stringify(Array.from(purchasedItems)));
  }, [coins, avatarState, purchasedItems]);

  const renderContent = () => {
    if (appStep !== 'hub') {
      switch (appStep) {
        case 'welcome': return <WelcomeScreen onNameSet={handleNameSet} />;
        case 'lesson': return <MiniLesson setNextDisabled={setNextDisabled} />;
        case 'demo': return <LiveDemo setNextDisabled={setNextDisabled} />;
        case 'practice': return <PromptPractice setNextDisabled={setNextDisabled} isSoundEnabled={isSoundEnabled} />;
        case 'rewards': return <RewardsScreen userName={userName!} setNextDisabled={setNextDisabled} isSoundEnabled={isSoundEnabled} />;
        default: return null;
      }
    } else {
       if (isTeacherMode) return <TeacherControlPanel />;
       
       switch (currentScreen) {
        case 'hub': return <HubScreen userName={userName!} onNavigate={navigateToScreen} isSoundEnabled={isSoundEnabled} />;
        case 'create': return <CreateScreen onBackToHub={() => setCurrentScreen('hub')} onSubmitToGallery={handleSubmitToGallery} isSoundEnabled={isSoundEnabled} />;
        case 'learn': return <LearnScreen onBack={() => setCurrentScreen('hub')} isSoundEnabled={isSoundEnabled} />;
        case 'storyHub': return <StoryHubScreen stories={communityStories} onReaction={handleReaction} onNavigateToCreate={() => navigateToScreen('create')} isSoundEnabled={isSoundEnabled} />;
        case 'ethics': return <EthicsPlayground onBackToHub={() => setCurrentScreen('hub')} isSoundEnabled={isSoundEnabled} />;
        case 'freedomFighters': return <FreedomFightersZone onBackToHub={() => setCurrentScreen('hub')} onNavigateToCreate={() => setCurrentScreen('create')} isSoundEnabled={isSoundEnabled} />;
        case 'shop': return <ShopScreen onBackToHub={() => setCurrentScreen('hub')} avatarState={avatarState} coins={coins} onPurchase={handlePurchase} onEquip={handleEquip} purchasedItems={purchasedItems} isSoundEnabled={isSoundEnabled} />;
        case 'gtcGallery': return <GTCGalleryScreen onBackToHub={() => setCurrentScreen('hub')} isSoundEnabled={isSoundEnabled} />;
        default: return <HubScreen userName={userName!} onNavigate={navigateToScreen} isSoundEnabled={isSoundEnabled} />;
       }
    }
  };

  const showNav = appStep !== 'welcome' && appStep !== 'hub';
  // The Hub button should show everywhere EXCEPT the hub screen itself.
  const showHubButton = !(appStep === 'hub' && currentScreen === 'hub');

  return (
    <LocalizationProvider language={language} setLanguage={setLanguage}>
        <div
            className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${font === 'dyslexia-friendly' ? 'font-dyslexia-friendly' : 'font-default'}`}>
            <Header
                userName={userName || 'Creator'}
                onSettingsClick={() => setIsSettingsOpen(true)}
                onHubClick={() => navigateToScreen('hub')}
                showHubButton={showHubButton}
                avatarState={avatarState}
                coins={coins}
                isSoundEnabled={isSoundEnabled}
            />
            <main className="pt-24 pb-28 px-4">
                {renderContent()}
            </main>
            
            {showNav && <GlobalNav onBack={handleBack} onNext={handleNext} showBack={appStep !== 'lesson'} showNext={appStep !== 'rewards'} isNextDisabled={isNextDisabled} isSoundEnabled={isSoundEnabled} />}
            
            <OnboardingModal 
                isOpen={appStep === 'welcome' && !userName} 
                onNameSet={handleNameSet} 
                isSoundEnabled={isSoundEnabled} 
                onAccessRequestClick={() => setIsAccessRequestOpen(true)}
            />

            <AccessRequestModal
                isOpen={isAccessRequestOpen}
                onClose={() => setIsAccessRequestOpen(false)}
                isSoundEnabled={isSoundEnabled}
            />

            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                theme={theme}
                setTheme={setTheme}
                font={font}
                setFont={setFont}
                language={language}
                setLanguage={setLanguage}
                isSoundEnabled={isSoundEnabled}
                setIsSoundEnabled={setIsSoundEnabled}
                isTeacherMode={isTeacherMode}
                setIsTeacherMode={setIsTeacherMode}
            />
        </div>
    </LocalizationProvider>
  );
};

export default App;
