import React from 'react';
import { 
  Mic, 
  Radio, 
  Activity,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Channel, User } from '../../types';
import { CHANNELS as SHARED_CHANNELS } from '../../constants';

const Waveform = ({ active }: { active?: boolean }) => {
  return (
    <div className={`flex items-center gap-1 h-12 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-20'}`}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={active ? { 
            height: [10, Math.random() * 40 + 10, 10], 
          } : { height: 10 }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.5 + Math.random(),
            ease: "easeInOut"
          }}
          className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-emerald-400/50'}`}
        />
      ))}
    </div>
  );
};

interface DashboardHomeProps {
  username: string;
  onlineUsers: User[];
  onChannelChange: (id: string) => void;
  onOpenChannels: () => void;
  currentChannelId?: string;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ 
  username, 
  onlineUsers, 
  onChannelChange, 
  onOpenChannels,
  currentChannelId = '1' 
}) => {
  // Find active speaker - strictly filtered by current channel
  const activeSpeaker = onlineUsers.find(u => u.isSpeaking && u.channelId === currentChannelId);
  
  // Current active channel object
  const activeChannel = SHARED_CHANNELS.find(c => c.id === currentChannelId) || SHARED_CHANNELS[0];
  
  // Channels can be fetched from server or hardcoded if they don't change often
  // For now we'll keep them but use onlineUsers to count members in each
  const channels: Channel[] = SHARED_CHANNELS.map(c => ({
    ...c,
    onlineCount: onlineUsers.filter(u => u.channelId === c.id).length
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Hero Live Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group border-blue-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Mic size={24} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Communication</p>
                  <h2 className="text-xl font-bold">{activeChannel.name} Channel</h2>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                  {activeSpeaker ? 'Transmitting' : 'Monitoring'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 py-4">
              <Waveform active={!!activeSpeaker} />
              <div className="space-y-1">
                <p className="text-sm font-mono text-zinc-400">Status:</p>
                <p className={`text-lg font-bold transition-colors ${activeSpeaker ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  {activeSpeaker ? `${activeSpeaker.name} speaking...` : 'CHANNEL SILENT'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            <button 
              className="px-8 py-4 bg-zinc-100 text-zinc-950 rounded-2xl font-bold flex items-center gap-3 hover:bg-white transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              <Mic size={20} />
              Push to Talk
            </button>
            <button 
              onClick={onOpenChannels} 
              className="px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl font-bold flex items-center gap-3 hover:bg-zinc-800 transition-all active:scale-95"
            >
              <Radio size={20} />
              Quick Switch
            </button>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 space-y-6 border-blue-500/10">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-100 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Network Health
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">REALTIME</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-3xl space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Latency</p>
                <p className="text-2xl font-bold font-mono">14<span className="text-xs text-zinc-600 ml-1">ms</span></p>
             </div>
             <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-3xl space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Uptime</p>
                <p className="text-2xl font-bold font-mono">99.9<span className="text-xs text-zinc-600 ml-1">%</span></p>
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800/50">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Buffer Usage</span>
              <span className="text-zinc-300 font-mono">12%</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '12%' }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Signal Strength</span>
              <span className="text-zinc-300 font-mono">-42 dBm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Active Users Section - Now taking full width */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold flex items-center gap-3">
              Live Team 
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full border border-emerald-500/20 font-black tracking-widest uppercase">
                {onlineUsers.length} MEMBERS ONLINE
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">All Systems Nominal</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {onlineUsers.map((user) => {
              const isUserSpeakingInCurrentChannel = user.isSpeaking && user.channelId === currentChannelId;
              return (
                <motion.div 
                  key={user.id} 
                  whileHover={{ y: -2 }}
                  className={`glass p-4 rounded-[1.5rem] flex items-center gap-4 border transition-all cursor-pointer group ${
                    isUserSpeakingInCurrentChannel ? 'border-emerald-500/50 bg-emerald-500/5 shadow-xl shadow-emerald-500/10' : 'border-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative">
                    <div className={`h-12 w-12 rounded-2xl bg-zinc-950 border flex items-center justify-center font-bold text-sm transition-colors ${
                      isUserSpeakingInCurrentChannel ? 'border-emerald-500 text-emerald-500' : 'border-zinc-900 text-zinc-600 group-hover:text-blue-500'
                    }`}>
                      {user.avatar}
                    </div>
                    {isUserSpeakingInCurrentChannel && (
                      <div className="absolute -top-1 -right-1 z-20">
                        <div className="bg-emerald-500 rounded-full p-1 shadow-lg">
                          <Mic size={10} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 ${
                      user.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-700'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-zinc-100 truncate">
                        {user.name === username ? `${user.name} (Me)` : user.name}
                      </p>
                      {isUserSpeakingInCurrentChannel && (
                        <span className="flex gap-0.5 items-end h-3">
                          <motion.span animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-emerald-500 rounded-full" />
                          <motion.span animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-0.5 bg-emerald-500 rounded-full" />
                          <motion.span animate={{ height: [5, 9, 5] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-emerald-500 rounded-full" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate mt-0.5">
                      {user.role} • {channels.find(c => c.id === user.channelId)?.name || 'Syncing...'}
                    </p>
                  </div>
                  
                  <div className={`transition-colors ${isUserSpeakingInCurrentChannel ? 'text-emerald-500' : 'text-zinc-800 group-hover:text-zinc-600'}`}>
                    <ChevronRight size={16} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
