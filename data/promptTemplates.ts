export interface PromptCategory {
  genre: string;
  prompts: {
    title: string;
    prompt: string;
  }[];
}

export const PROMPT_TEMPLATES: PromptCategory[] = [
  {
    genre: 'Fantasy',
    prompts: [
      { title: 'Talking Animal', prompt: 'A squirrel who can talk discovers a hidden, magical acorn that can grant wishes.' },
      { title: 'Enchanted Forest', prompt: 'A child wanders into a forest where the trees whisper ancient secrets and the rivers flow with liquid starlight.' },
      { title: 'Dragon Companion', prompt: 'A young blacksmith befriends a small, friendly dragon that breathes colorful, harmless bubbles instead of fire.' },
    ],
  },
  {
    genre: 'Sci-Fi',
    prompts: [
      { title: 'Robot Friend', prompt: 'A lonely girl in the year 2099 builds a robot friend out of spare parts, but the robot has a surprising secret.' },
      { title: 'Space Mission', prompt: 'A team of kid astronauts blasts off to explore a newly discovered planet made entirely of candy.' },
      { title: 'Time-Traveling Backpack', prompt: 'A student finds a backpack that allows them to travel five minutes into the past or future.' },
    ],
  },
  {
    genre: 'Mystery',
    prompts: [
        { title: 'Missing Toy', prompt: 'The world\'s most famous toy detective must solve the case of the missing teddy bear before bedtime.' },
        { title: 'Secret Clubhouse', prompt: 'A group of friends discovers a secret message written in invisible ink that leads them to a hidden clubhouse.' },
        { title: 'Strange Footprints', prompt: 'Mysterious, glowing footprints appear in the school hallway overnight, and only one student knows where they came from.' },
    ],
  },
  {
    genre: 'Adventure',
    prompts: [
        { title: 'Jungle Quest', prompt: 'Two siblings find an old map in their attic that leads to a lost city of talking animals in the Amazon rainforest.' },
        { title: 'Mountain Climb', prompt: 'A determined young explorer decides to climb the magical, floating mountain that appears outside their town once every hundred years.' },
        { title: 'Underwater City', prompt: 'A kid who can breathe underwater discovers a secret, glittering city populated by friendly sea creatures.' },
    ],
  }
];
