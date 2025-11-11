// utils/soundUtils.ts
import { SoundEffect } from '../types.ts';

const SOUND_MAP: Record<SoundEffect, string> = {
  click: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_23b3719ab2.mp3',
  success: 'https://cdn.pixabay.com/download/audio/2022/03/25/audio_9a079a35a2.mp3',
  whoosh: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_9f2255767c.mp3',
  badge: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_eb22b2713a.mp3',
  purchase: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c848a67124.mp3',
  error: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_1104862f92.mp3',
};

// Audio elements can be reused to reduce memory usage.
const audioCache: Partial<Record<SoundEffect, HTMLAudioElement>> = {};

export const playSound = (sound: SoundEffect, isEnabled: boolean) => {
  if (!isEnabled) {
    return;
  }

  try {
    if (!audioCache[sound]) {
      audioCache[sound] = new Audio(SOUND_MAP[sound]);
    }
    const audio = audioCache[sound]!;
    // Small volume adjustment for subtle UI sounds
    if (sound === 'click' || sound === 'whoosh') {
        audio.volume = 0.5;
    } else {
        audio.volume = 1.0;
    }
    audio.currentTime = 0; // Rewind to start in case it's already playing
    audio.play().catch(error => {
      // Autoplay was prevented. This is a common browser policy.
      // Sounds are non-critical, so we can ignore this error silently.
    });
  } catch (error) {
    console.error(`Error playing sound '${sound}':`, error);
  }
};