/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Tab } from './types';
import { Sidebar } from './components/Layout/Sidebar';
import { Navbar } from './components/Layout/Navbar';
import { HelpTab } from './components/HelpTab';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { Onboarding } from './components/Onboarding';
import { Navigation } from './components/Navigation';
import { Radio, Users, Mic, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPTTActive, setIsPTTActive] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('churchlink_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('churchlink_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'help':
        return <HelpTab />;
      case 'channels':
        return (
          <div className="p-8 pt-12 space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Channel Manager</h1>
                <p className="text-zinc-500 mt-1">Configure and assign production lines</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
                <Radio size={18} />
                Create Channel
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="glass p-6 rounded-[2rem] border border-zinc-800/50 space-y-6">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      <Radio size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-zinc-100">Production Net {i+1}</h3>
                      <p className="text-sm text-zinc-500">Global team communication line for rehearsal.</p>
                    </div>
                    <button className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                      Configure Settings
                    </button>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="h-[calc(100vh-10rem)] p-8 flex items-center justify-center">
            <div className="max-w-md w-full text-center space-y-6">
              <div className="h-24 w-24 bg-zinc-900 rounded-[2rem] mx-auto flex items-center justify-center text-zinc-800 border border-zinc-800">
                <Users size={48} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Team Chat Encrypted</h2>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Historical message data is currently being synced from the church server. This may take a moment.
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
              </div>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="p-8 space-y-8">
             <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
                <div className="h-20 w-20 shrink-0 bg-red-500/10 rounded-[1.5rem] flex items-center justify-center text-red-500">
                  <ShieldAlert size={40} />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-red-100">Elevated Access Required</h2>
                  <p className="text-red-900/60 text-sm max-w-lg">
                    The admin panel requires a verified ChurchLink hardware key or temporary lead token. Please contact the technical director for credentials.
                  </p>
                  <button className="mt-4 bg-red-500/20 text-red-500 font-bold py-2 px-6 rounded-xl hover:bg-red-500/30 transition-all text-xs border border-red-500/20 uppercase tracking-widest">
                    Request Lead Token
                  </button>
                </div>
             </div>
          </div>
        )
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      </AnimatePresence>
      
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block">
        <Sidebar 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
      </div>

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Navbar />

        <main className="pt-24 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Navigation - Mobile Only */}
      <div className="lg:hidden">
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
      
      {/* Global PTT Professional Control */}
      <motion.div 
        initial={{ y: 150 }}
        animate={{ y: 0 }}
        className="fixed bottom-24 lg:bottom-12 right-0 left-0 lg:left-auto lg:right-12 px-6 lg:px-0 flex justify-center z-50"
      >
        <button 
          onMouseDown={() => setIsPTTActive(true)}
          onMouseUp={() => setIsPTTActive(false)}
          onTouchStart={() => setIsPTTActive(true)}
          onTouchEnd={() => setIsPTTActive(false)}
          className={`
            w-full lg:w-80 glass px-6 py-6 rounded-[2.5rem] flex items-center justify-between gap-6 transition-all active:scale-95 group relative overflow-hidden
            ${isPTTActive ? 'ptt-active border-emerald-400/50' : 'hover:border-blue-500/50 shadow-2xl shadow-blue-500/10'}
          `}
        >
          {isPTTActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              className="absolute inset-0 bg-emerald-400"
            />
          )}

          <div className="flex items-center gap-4 relative z-10">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${isPTTActive ? 'bg-white text-emerald-600' : 'bg-zinc-800 text-zinc-400 group-hover:text-blue-500'}`}>
              <Mic size={24} className={isPTTActive ? 'animate-pulse' : ''} />
            </div>
            <div className="text-left">
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 ${isPTTActive ? 'text-white' : 'text-zinc-500'}`}>
                {isPTTActive ? 'Transmitting' : 'Voice Input'}
              </p>
              <p className={`text-lg font-black tracking-tight ${isPTTActive ? 'text-white' : 'text-zinc-200'}`}>
                {isPTTActive ? 'Sarah, go ahead' : 'HOLD TO TALK'}
              </p>
            </div>
          </div>
          
          <div className="relative z-10">
             <div className={`h-1.5 w-1.5 rounded-full ${isPTTActive ? 'bg-white animate-ping' : 'bg-zinc-700'}`} />
          </div>
        </button>
      </motion.div>

      {/* Emergency Overlay Gradient (Global) */}
      <div className="fixed inset-0 pointer-events-none p-4 opacity-20 bg-[radial-gradient(circle_at_top_right,transparent_70%,rgba(59,130,246,0.1))] border border-white/5" />
    </div>
  );
}
