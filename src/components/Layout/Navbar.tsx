import React from 'react';
import { 
  Activity, 
  Bell, 
  Search, 
  Settings, 
  ShieldCheck, 
  Signal,
  Wifi,
  WifiOff
} from 'lucide-react';
import { ServerInfo } from '../../types';

interface NavbarProps {
  username: string;
  onLogout: () => void;
  socketConnected: boolean;
  serverInfo: ServerInfo | null;
}

export const Navbar: React.FC<NavbarProps> = ({ username, onLogout, socketConnected, serverInfo }) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass z-40 px-6 flex items-center justify-between border-b border-zinc-800">
      <div className="flex items-center gap-6">
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border transition-colors ${socketConnected ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className={`h-2 w-2 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${socketConnected ? 'text-emerald-500' : 'text-red-500'}`}>
            {socketConnected ? (!!window.electron ? 'Master Hub Online' : 'Linked to Hub') : (!!window.electron ? 'Core Hub Initializing...' : 'Searching for Hub...')}
          </span>
          {serverInfo && socketConnected && !window.electron && (
            <span className="text-[10px] text-zinc-500 font-mono ml-1">
              ({serverInfo.ips[0] || 'localhost'})
            </span>
          )}
        </div>
        
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search channels or team..."
            className="bg-zinc-950/50 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-4 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-4 mr-4 text-zinc-400">
          <div className="flex items-center gap-1">
            {socketConnected ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-red-500" />}
            <span className="text-[10px] font-mono">{socketConnected ? 'LAN-SYNC' : 'NO-LINK'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity size={14} className="text-blue-500" />
            <span className="text-[10px] font-mono">{socketConnected ? '98.2% UP' : 'OFFLINE'}</span>
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
            <p className="text-[10px] text-zinc-500 font-medium">Internal Comms</p>
          </div>
          <button 
            onClick={!!window.electron ? undefined : onLogout}
            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg border border-white/10 hover:scale-105 transition-transform ${!!window.electron ? 'bg-gradient-to-br from-emerald-500 to-teal-600 cursor-default shadow-emerald-500/10' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}
          >
            {username.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
