import React from 'react';
import { Radio, MessageSquare, HelpCircle } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'channels', label: 'Channels', icon: Radio },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 px-6 flex items-center justify-around z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center gap-1.5 transition-all ${
            currentTab === tab.id ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <tab.icon size={24} strokeWidth={currentTab === tab.id ? 2.5 : 2} />
          <span className={`text-[10px] font-bold uppercase tracking-wider transition-all ${
            currentTab === tab.id ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-0.5'
          }`}>
            {tab.label}
          </span>
          
          {currentTab === tab.id && (
            <div className="absolute -top-3 w-8 h-1 bg-blue-500 rounded-full" />
          )}
        </button>
      ))}
    </nav>
  );
};
