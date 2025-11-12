import { ProgressStep } from "../types.ts";

export interface StudentJournalEntries {
  story: string;
  art: string;
  music: string;
  reflection: string;
}

export interface Student {
  id: number;
  name: string;
  storyText: string;
  imageUrl: string;
  journalEntries: StudentJournalEntries;
  progress: Set<ProgressStep>;
}


export const CLASSROOM_DATA: Student[] = [
  {
    id: 1,
    name: 'Leo',
    storyText: 'A tiny knight named Sir Pip decided to climb a giant sunflower. He thought the sun was a golden treasure at the top. When he got there, he just found warm petals, but he made friends with a friendly bumblebee, which was an even better treasure.',
    imageUrl: 'https://storage.googleapis.com/maker-me-assets/assets/user-4kP3aIqfT3fL3HKwRTf6Rk01/images/20240529_023736_409745.jpeg',
    journalEntries: {
      story: 'I asked for a story about a tiny knight. The AI made him climb a sunflower, which was a cool idea!',
      art: 'The picture looks so sunny and happy. I like the cartoon style because it fits the story.',
      music: 'The joyful music is perfect for an adventure.',
      reflection: 'It\'s important to be specific. If I just said "knight," I might have gotten a big, serious one instead of my little Sir Pip.',
    },
    progress: new Set(['story', 'art', 'music', 'reflection']),
  },
  {
    id: 2,
    name: 'Maya',
    storyText: 'In a city made of glass, a girl could talk to reflections. One day, her own reflection warned her of a coming silent storm that could shatter the city. Together, they taught everyone to hum a special tune that protected the glass with sound vibrations.',
    imageUrl: 'https://storage.googleapis.com/maker-me-assets/assets/user-4kP3aIqfT3fL3HKwRTf6Rk01/images/20240529_023812_218151.jpeg',
    journalEntries: {
      story: 'My prompt was "a girl who talks to reflections." The AI added the idea of a storm, which made it more exciting.',
      art: 'I chose watercolor to make the glass city look dreamy. The AI did a good job with the soft colors.',
      music: '',
      reflection: '',
    },
    progress: new Set(['story', 'art']),
  },
  {
    id: 3,
    name: 'Chloe',
    storyText: 'A robot gardener was programmed to love flowers, but it secretly dreamed of the stars. Every night, it would arrange fallen petals into constellations on the grass, creating a temporary, beautiful galaxy on the ground.',
    imageUrl: 'https://storage.googleapis.com/maker-me-assets/assets/user-4kP3aIqfT3fL3HKwRTf6Rk01/images/20240529_023851_923629.jpeg',
    journalEntries: {
      story: 'I wrote a prompt about a robot who loves stars. The AI story was very poetic and a little sad, which I liked.',
      art: '',
      music: '',
      reflection: '',
    },
    progress: new Set(['story']),
  },
  {
    id: 4,
    name: 'Ben',
    storyText: 'A mischievous ghost who loved to play pranks discovered that making friends was more fun. He started by leaving funny, harmless drawings on foggy windows for the children of the house, who would leave thank-you notes for the "mystery artist."',
    imageUrl: 'https://storage.googleapis.com/maker-me-assets/assets/user-4kP3aIqfT3fL3HKwRTf6Rk01/images/20240529_023736_409745.jpeg',
     journalEntries: {
      story: 'The AI gave my ghost a good reason to change from pranks to being nice. It made the story better.',
      art: 'The comic book style makes the ghost look friendly, not scary.',
      music: 'Mysterious music was a good fit for a ghost story.',
      reflection: 'AI can help you think about why your characters do things.',
    },
    progress: new Set(['story', 'art', 'music']),
  },
];