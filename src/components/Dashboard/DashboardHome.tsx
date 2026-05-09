import React from 'react';
import { 
  Users, 
  Wifi, 
  Mic, 
  Radio, 
  AlertCircle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  Megaphone
} from 'lucide-react';
import { motion } from 'motion/react';
import { Channel, User, Announcement } from '../../types';

const CHANNELS: Channel[] = [
  { id: '1', name: 'Main Tech', description: 'FOH, Lighting, Media', onlineCount: 12, activeSpeaker: 'Jeff (L1)', icon: 'monitor' },
  { id: '2', name: 'Camera Team', description: 'Ops, Jib, Controller', onlineCount: 6, icon: 'camera' },
  { id: '3', name: 'Livestream', description: 'Stream Monitor, Audio', onlineCount: 4, isEmergency: true, icon: 'globe' },
  { id: '4', name: 'Worship/Stage', description: 'MD, Stage Hands', onlineCount: 15, icon: 'music' },
];

const ONLINE_USERS: User[] = [
  { id: 'u1', name: 'Sarah Miller', role: 'Producer', status: 'online', avatar: 'SM' },
  { id: 'u2', name: 'Mike Ross', role: 'Camera Op', status: 'online', avatar: 'MR' },
  { id: 'u3', name: 'Jason Stat', role: 'Audio Eng', status: 'idle', avatar: 'JS' },
  { id: 'u4', name: 'Emily Chen', role: 'Tech Lead', status: 'online', avatar: 'EC' },
];

const ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Sunday Run-through delayed 15min', author: 'Pryme', date: '10:30 AM', priority: 'high' },
  { id: 'a2', title: 'New Camera 4 calibration settings', author: 'Sarah', date: '08:15 AM', priority: 'normal' },
];

const Waveform = () => {
  return (
    <div className="flex items-center gap-1 h-12">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            height: [10, Math.random() * 40 + 10, 10], 
          }}
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

export const DashboardHome: React.FC = () => {
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
                  <h2 className="text-xl font-bold">Main Tech Channel</h2>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Transmitting</span>
              </div>
            </div>

            <div className="flex items-center gap-8 py-4">
              <Waveform />
              <div className="space-y-1">
                <p className="text-sm font-mono text-zinc-400">Speaker Identified:</p>
                <p className="text-lg font-bold text-emerald-400">Sarah M. (FOH Lead)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            <button className="px-8 py-4 bg-zinc-100 text-zinc-950 rounded-2xl font-bold flex items-center gap-3 hover:bg-white transition-all shadow-xl shadow-white/5 active:scale-95">
              <Mic size={20} />
              Push to Talk
            </button>
            <button className="px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl font-bold flex items-center gap-3 hover:bg-zinc-800 transition-all active:scale-95">
              <Radio size={20} />
              Switch
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
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Active Channels */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold">Priority Channels</h3>
            <button className="text-blue-500 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHANNELS.map((channel) => (
              <motion.div 
                key={channel.id}
                whileHover={{ y: -4 }}
                className={`glass p-6 rounded-[2rem] border-l-4 transition-all ${
                  channel.isEmergency ? 'border-l-red-500 neon-glow-red' : 'border-l-blue-600'
                } group cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center ${channel.isEmergency ? 'text-red-500' : 'text-zinc-400 group-hover:text-blue-500'}`}>
                        {channel.icon === 'camera' && <Activity size={20} />}
                        {channel.icon === 'monitor' && <Users size={20} />}
                        {channel.icon === 'globe' && <AlertCircle size={20} />}
                        {channel.icon === 'music' && <Radio size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100">{channel.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{channel.onlineCount} OPS ONLINE</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                      {channel.description}
                    </p>
                  </div>
                  
                  {channel.activeSpeaker && (
                    <div className="flex flex-col items-end gap-2">
                      <div className="h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/20">
                        <Mic size={12} className="text-white" />
                      </div>
                      <span className="text-[8px] font-bold text-emerald-500 tracking-tighter uppercase whitespace-nowrap">Live speaking</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-800/50">
                   <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-6 w-6 rounded-full border border-zinc-950 bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                          {i + 1}
                        </div>
                      ))}
                      <div className="h-6 w-6 rounded-full border border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-600">
                        +9
                      </div>
                   </div>
                   <button className="text-[10px] font-bold text-zinc-400 group-hover:text-blue-500 transition-colors flex items-center gap-1">
                      JOIN ROOM <ChevronRight size={14} />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Collumn */}
        <div className="space-y-8">
          {/* Active Users */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center justify-between px-1">
              Live Team <span className="text-emerald-500 text-[10px] font-mono">{ONLINE_USERS.length} ACTIVE</span>
            </h3>
            <div className="space-y-2">
              {ONLINE_USERS.map((user) => (
                <div key={user.id} className="glass p-3 rounded-2xl flex items-center gap-3 border-transparent hover:border-zinc-800 transition-all cursor-pointer group">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center font-bold text-zinc-600 group-hover:text-blue-500 transition-colors">
                      {user.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-zinc-950 ${
                      user.status === 'online' ? 'bg-emerald-500' : 'bg-orange-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-100 truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{user.role}</p>
                  </div>
                  <TrendingUp size={12} className="text-zinc-800 transition-colors group-hover:text-blue-500/50" />
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold px-1 flex items-center gap-2">
              <Megaphone size={16} className="text-orange-500" />
              Latest Intel
            </h3>
            <div className="space-y-3">
              {ANNOUNCEMENTS.map((ann) => (
                <div key={ann.id} className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl space-y-2 relative overflow-hidden group">
                  {ann.priority === 'high' && (
                    <div className="absolute top-0 right-0 h-10 w-10 bg-red-500/10 rotate-45 translate-x-5 -translate-y-5" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                      ann.priority === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {ann.priority}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1">
                      <Clock size={10} /> {ann.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 leading-normal">{ann.title}</h4>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    Posted by <span className="text-blue-500 font-bold">{ann.author}</span>
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all uppercase tracking-widest">
              Broadcast System Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
