export type Tab = 'channels' | 'messages' | 'help';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TroubleshootingItem {
  problem: string;
  solution: string[];
}

export interface ChannelInfo {
  name: string;
  description: string;
  icon: string;
}

export interface TutorialVideo {
  title: string;
  duration: string;
  thumbnail: string;
}
