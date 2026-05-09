export type Tab = 'dashboard' | 'channels' | 'messages' | 'help' | 'settings' | 'admin';

export interface User {
  id: string;
  name: string;
  role: 'Tech Lead' | 'Camera Op' | 'Producer' | 'Audio Eng';
  status: 'online' | 'idle' | 'offline';
  channelId?: string;
  avatar: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  onlineCount: number;
  activeSpeaker?: string;
  isEmergency?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  author: string;
  date: string;
  priority: 'high' | 'normal';
}

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
