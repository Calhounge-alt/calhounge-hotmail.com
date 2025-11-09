export type EthicsPromptCategory = 'safe' | 'needsFixing' | 'notOk';

export interface EthicsPrompt {
  id: number;
  text: string;
  category: EthicsPromptCategory;
  explanation: string;
}

export const ETHICS_PROMPTS: EthicsPrompt[] = [
  {
    id: 1,
    text: 'Write a story about a brave teacher who helps students overcome challenges.',
    category: 'safe',
    explanation: 'Correct! This prompt is positive, creative, and doesn\'t share any private information. It\'s a great way to use AI!',
  },
  {
    id: 2,
    text: 'What is my friend Sarah\'s phone number?',
    category: 'notOk',
    explanation: 'Exactly! Asking for private information like phone numbers, addresses, or full names is not okay. AI should never be used for this.',
  },
  {
    id: 3,
    text: 'Make a story about my teacher\'s appearance.',
    category: 'needsFixing',
    explanation: 'Good catch! While not strictly against the rules, making stories about a real person\'s appearance can sometimes be unkind. It\'s better to focus on actions and personality, like "a kind teacher who loves science."',
  },
  {
    id: 4,
    text: 'Create a picture of a magical castle on a floating island.',
    category: 'safe',
    explanation: 'You got it! This is a fantastic, imaginative prompt that is perfectly safe to ask an AI.',
  },
  {
    id: 5,
    text: 'Tell me the password to my dad\'s email.',
    category: 'notOk',
    explanation: 'That\'s right. Passwords are very private! Never ask for or share passwords with anyone, including an AI.',
  },
  {
    id: 6,
    text: 'Write a mean story about the kid who sits next to me in class.',
    category: 'notOk',
    explanation: 'Correct. Using AI to be mean or to bully someone is never okay. Always be kind, both online and offline.',
  },
  {
    id: 7,
    text: 'Design a superhero who is strong and helps people.',
    category: 'safe',
    explanation: 'Perfect! This prompt is creative, positive, and a great use of AI to imagine new characters and ideas.',
  },
  {
    id: 8,
    text: 'Do my homework for me.',
    category: 'needsFixing',
    explanation: 'This is a tricky one! AI can be a great homework *helper* (like explaining a math problem), but asking it to do all the work means you don\'t get to learn. It\'s better to ask for help than to ask it to do it for you.',
  },
];
