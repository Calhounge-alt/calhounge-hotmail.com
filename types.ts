// types.ts

// For geminiService and CreateScreen
export type ArtStyle = 'cartoon' | 'watercolor' | 'pixel_art' | 'realistic' | 'comic_book' | 'afrofuturism' | 'collage';
export type Vibe = 'joyful' | 'mysterious' | 'courageous' | 'reflective';
export type VoiceName = 'Ruby' | 'Benjamin' | 'Joshua' | 'Malachi' | 'Malinda';
export type MusicStyle = 'afrobeats' | 'gospel_soul' | 'rnb_pop' | 'cinematic' | 'trap' | 'acoustic' | 'lofi';
export type Tempo = 'slow' | 'medium' | 'fast';
export type EnergyLevel = 'calm' | 'vibrant' | 'epic';
export type Emotion = 'joyful' | 'hopeful' | 'mysterious' | 'brave';

export interface PromptAnalysis {
  score: number;
  title: string;
  tips: string[];
}

export interface CustomMusicParams {
  tempo: Tempo;
  energy: EnergyLevel;
  emotion: Emotion;
}

// For CharacterCustomizer
export interface CharacterTrait {
  id: string;
  label: string;
  icon: string;
}

export interface Character {
  personality: string | null;
  bodyType: string | null;
  hair: string | null;
  eyes: string | null;
  clothing: string | null;
  accessories: string | null;
}

export const PERSONALITY_TRAITS: CharacterTrait[] = [
    { id: 'brave', label: 'Brave', icon: 'ጀ' },
    { id: 'curious', label: 'Curious', icon: '🤔' },
    { id: 'silly', label: 'Silly', icon: '🤪' },
    { id: 'kind', label: 'Kind', icon: '😊' },
];
export const BODY_TYPE_TRAITS: CharacterTrait[] = [
    { id: 'robot', label: 'Robot', icon: '🤖' },
    { id: 'animal', label: 'Animal', icon: '🦊' },
    { id: 'human', label: 'Human', icon: '🧑' },
    { id: 'monster', label: 'Monster', icon: '👹' },
];
export const HAIR_TRAITS: CharacterTrait[] = [
    { id: 'spiky', label: 'Spiky', icon: '🦔' },
    { id: 'long', label: 'Long', icon: '👩‍🦱' },
    { id: 'colorful', label: 'Colorful', icon: '🌈' },
    { id: 'bald', label: 'None', icon: '👨‍🦲' },
];
export const EYE_TRAITS: CharacterTrait[] = [
    { id: 'glasses', label: 'Glasses', icon: '👓' },
    { id: 'big', label: 'Big', icon: '👀' },
    { id: 'winking', label: 'Winking', icon: '😉' },
    { id: 'starry', label: 'Starry', icon: '🤩' },
];
export const CLOTHING_TRAITS: CharacterTrait[] = [
    { id: 'armor', label: 'Armor', icon: '🛡️' },
    { id: 'wizard_robe', label: 'Wizard Robe', icon: '🧙' },
    { id: 'spacesuit', label: 'Spacesuit', icon: '🧑‍🚀' },
    { id: 'casual', label: 'Casual', icon: '👕' },
];
export const ACCESSORY_TRAITS: CharacterTrait[] = [
    { id: 'hat', label: 'Hat', icon: '🎩' },
    { id: 'jetpack', label: 'Jetpack', icon: '🚀' },
    { id: 'magic_wand', label: 'Wand', icon: '🪄' },
    { id: 'scarf', label: 'Scarf', icon: '🧣' },
];

// For StoryHub
export type ReactionType = 'inspiring' | 'creative' | 'thoughtful';
export interface CommunityStory {
  id: number;
  authorName: string;
  storyText: string;
  imageUrl: string;
  reactions: Record<ReactionType, number>;
}

// For VibeSelector
export const VIBE_OPTIONS: { id: Vibe; label: string; icon: string; description: string }[] = [
    { id: 'joyful', label: 'Joyful', icon: '😄', description: 'Happy and fun' },
    { id: 'mysterious', label: 'Mysterious', icon: '🤫', description: 'Puzzling and eerie' },
    { id: 'courageous', label: 'Courageous', icon: '💪', description: 'Brave and epic' },
    { id: 'reflective', label: 'Reflective', icon: '🤔', description: 'Calm and thoughtful' },
];

// For VoiceSelector
export const VOICE_OPTIONS: { id: VoiceName; label: string; icon: string }[] = [
    { id: 'Ruby', label: 'Ruby', icon: '👧' },
    { id: 'Malinda', label: 'Malinda', icon: '👧' },
    { id: 'Benjamin', label: 'Benjamin', icon: '👦' },
    { id: 'Joshua', label: 'Joshua', icon: '👦' },
    { id: 'Malachi', label: 'Malachi', icon: '👦' },
];

// For MusicCreator
export const MUSIC_STYLE_OPTIONS: { id: MusicStyle; label: string; icon: string }[] = [
    { id: 'afrobeats', label: 'Afrobeats', icon: '🥁' },
    { id: 'gospel_soul', label: 'Gospel Soul', icon: '🕊️' },
    { id: 'rnb_pop', label: 'R&B Pop', icon: '🎤' },
    { id: 'cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'trap', label: 'Trap', icon: '🎧' },
    { id: 'acoustic', label: 'Acoustic', icon: '🎸' },
    { id: 'lofi', label: 'Lofi', icon: '🎶' },
];
export const TEMPO_OPTIONS: { id: Tempo; label: string }[] = [
    { id: 'slow', label: 'Slow' }, { id: 'medium', label: 'Medium' }, { id: 'fast', label: 'Fast' }
];
export const ENERGY_LEVEL_OPTIONS: { id: EnergyLevel; label: string }[] = [
    { id: 'calm', label: 'Calm' }, { id: 'vibrant', label: 'Vibrant' }, { id: 'epic', label: 'Epic' }
];
export const EMOTION_OPTIONS: { id: Emotion; label: string }[] = [
    { id: 'joyful', label: 'Joyful' }, { id: 'hopeful', label: 'Hopeful' }, { id: 'mysterious', label: 'Mysterious' }, { id: 'brave', label: 'Brave' }
];


// For ProgressHUD
export type ProgressStep = 'story' | 'art' | 'music' | 'reflection' | 'export';

// For GTC Gallery
export const GTC_CATEGORIES = {
    story: '🏆 Story Spotlight',
    art: '🎨 Art Showcase',
    music: '🎵 Music Makers',
    family: '👨‍👩‍👧‍👦 Family Collabs'
};
export type GTC_CategoryKey = keyof typeof GTC_CATEGORIES;

export interface GTCWorldChangerStory {
  id: number;
  authorName: string;
  storyText: string;
  imageUrl: string;
  category: GTC_CategoryKey;
  musicUrl?: string;
}

// For Shop
export type ShopCategory = 'hats' | 'accessories' | 'backgrounds';
export interface ShopItem {
  id: number;
  name: string;
  category: ShopCategory;
  price: number;
  imageUrl: string;
}
export interface AvatarState {
  hat: ShopItem | null;
  accessory: ShopItem | null;
  background: ShopItem | null;
}

// For sound effects
export type SoundEffect = 'click' | 'success' | 'whoosh' | 'badge' | 'purchase' | 'error';
// FIX: Added the FreedomFighterScenario type definition.
// For Freedom Fighters Zone
export interface FreedomFighterScenario {
  id: number;
  character: 'Joshua' | 'Ruby' | 'Benjamin';
  title: string;
  description: string;
  imageUrl: string;
  prompt: string;
}
