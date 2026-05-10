import React from 'react';
import { 
  Activity, 
  Bell, 
  Search, 
  Settings, 
  ShieldCheck, 
  Signal
} from 'lucide-react';

interface NavbarProps {
  username: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass z-40 px-6 flex items-center justify-between border-b border-zinc-800">
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live Server</span>
          <span className="text-[10px] text-zinc-500 font-mono">192.168.1.104</span>
        </div>
        
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Quick command..."
            className="bg-zinc-950/50 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-4 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-4 mr-4 text-zinc-400">
          <div className="flex items-center gap-1">
            <Signal size={14} className="text-emerald-500" />
            <span className="text-[10px] font-mono">14ms</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity size={14} className="text-blue-500" />
            <span className="text-[10px] font-mono">98% UP</span>
          </div>
        </div>

        <button className="p-2 text-zinc-400 hover:text-blue-400 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-zinc-950" />
        </button>
        
        <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
        
        <div className="flex items-center gap-3 pl-2 group">
          <div className="text-right hidden xs:block">
            <p className="text-xs font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">{username}</p>
            <p className="text-[10px] text-zinc-500 font-medium">Production Team</p>
          </div>
          <button 
            onClick={onLogout}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg border border-white/10 hover:scale-105 transition-transform"
          >
            {username.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
