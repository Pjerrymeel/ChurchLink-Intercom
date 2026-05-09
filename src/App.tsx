/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Tab } from './types';
import { Navigation } from './components/Navigation';
import { HelpTab } from './components/HelpTab';
import { Onboarding } from './components/Onboarding';
import { Radio, Mic, Users, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('help');
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  const renderTab = () => {
    switch (currentTab) {
      case 'help':
        return <HelpTab />;
      case 'channels':
        return (
          <div className="min-h-screen bg-zinc-950 p-6 pt-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800 shadow-2xl">
               <Radio size={64} className="text-blue-500 mx-auto animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Channel Manager</h2>
              <p className="text-zinc-400 mt-2">Active session placeholder for demo</p>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="min-h-screen bg-zinc-950 p-6 pt-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800 shadow-2xl">
               <Users size={64} className="text-emerald-500 mx-auto" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Team Chat</h2>
              <p className="text-zinc-400 mt-2">Message history placeholder</p>
            </div>
          </div>
        );
      default:
        return <HelpTab />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-blue-500/30">
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      
      <main className="max-w-2xl mx-auto shadow-2xl shadow-blue-900/5 min-h-screen border-x border-zinc-900">
        {renderTab()}
      </main>

      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      
      {/* Global PTT Mock Indicator */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2"
      >
        <button className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-3 text-zinc-100 shadow-xl group hover:border-blue-500/50 transition-all">
          <Mic size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Hold to Talk</span>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </button>
      </motion.div>
    </div>
  );
}
