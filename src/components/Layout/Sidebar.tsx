import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  MessageSquare, 
  HelpCircle, 
  Settings, 
  Shield, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Megaphone
} from 'lucide-react';
import { Tab } from '../../types';
import { motion } from 'motion/react';

interface SidebarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onTabChange,
  isCollapsed,
  setIsCollapsed
}) => {
  const menuItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'channels', label: 'Channels', icon: Radio },
    { id: 'messages', label: 'Team Chat', icon: MessageSquare },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'admin', label: 'Admin Panel', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-zinc-950 border-r border-zinc-900 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 flex items-center justify-between mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Radio size={24} />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-lg tracking-tight">ChurchLink</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-blue-500">Intercom Pro</p>
            </div>
          </div>
        )}
        {isCollapsed && (
           <div className="h-10 w-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/20">
            <Radio size={24} />
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl transition-all group relative ${
              currentTab === item.id 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <item.icon size={22} className={currentTab === item.id ? 'stroke-[2.5px]' : ''} />
            {!isCollapsed && (
              <span className="text-sm font-semibold tracking-wide">
                {item.label}
              </span>
            )}
            
            {currentTab === item.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full"
              />
            )}

            {isCollapsed && (
              <div className="absolute left-16 bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        {!isCollapsed && (
          <div className="bg-zinc-900/50 rounded-2xl p-4 mb-4 border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone size={14} className="text-blue-500" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Update</p>
            </div>
            <p className="text-xs text-zinc-500 leading-normal mb-3">
              Version 2.4 is live with improved audio sync.
            </p>
            <button className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300">
              View Changelog
            </button>
          </div>
        )}

        <button className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut size={22} />
          {!isCollapsed && <span className="text-sm font-semibold">Sign Out</span>}
        </button>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 h-6 w-6 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-blue-400 shadow-xl"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};
