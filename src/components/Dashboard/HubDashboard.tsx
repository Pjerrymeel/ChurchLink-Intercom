import React from 'react';
import { 
  Server, 
  Activity, 
  Wifi, 
  Globe, 
  Users, 
  Radio, 
  Terminal,
  Cpu,
  Monitor
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, ServerInfo } from '../../types';
import { CHANNELS } from '../../constants';

interface HubDashboardProps {
  onlineUsers: User[];
  serverInfo: ServerInfo | null;
  socketConnected: boolean;
}

export const HubDashboard: React.FC<HubDashboardProps> = ({ 
  onlineUsers, 
  serverInfo,
  socketConnected 
}) => {
  const activeRoomsCount = new Set(onlineUsers.map(u => u.channelId)).size;
  
  return (
    <div className="space-y-8 pb-12">
      {/* Header Stat Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-[2rem] border-emerald-500/20 bg-emerald-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-400">
              <Activity size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Hub Status</span>
            </div>
            <div className={`h-2 w-2 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-white">
              {socketConnected ? 'ONLINE' : 'OFFLINE'}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">System Readiness</p>
          </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border-blue-500/20 bg-blue-500/5 space-y-4">
          <div className="flex items-center gap-3 text-blue-400">
            <Users size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Clients</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-white">
              {onlineUsers.length}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Terminals Linked</p>
          </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border-zinc-800/50 space-y-4">
          <div className="flex items-center gap-3 text-purple-400">
            <Radio size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Routing Scope</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-white">
              {activeRoomsCount}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Active Corridors</p>
          </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border-zinc-800/50 space-y-4">
          <div className="flex items-center gap-3 text-zinc-400">
            <Cpu size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Core Port</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-white">
              {serverInfo?.port || 3000}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Socket Listener</p>
          </div>
        </div>
      </div>

      {/* Main Server Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass rounded-[3rem] p-10 border-blue-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <Server size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">LAN NETWORK HOST</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Clients must use the IP addresses below</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serverInfo?.ips.map((ip, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={ip} 
                    className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-[2rem] flex flex-col gap-4 group hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Wifi size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Network Node</span>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black font-mono text-white tracking-widest">{ip}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Target Server IP</p>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`http://${ip}:3000`)}
                      className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all"
                    >
                      Copy Connection URL
                    </button>
                  </motion.div>
                ))}
                
                {(!serverInfo || serverInfo.ips.length === 0) && (
                  <div className="col-span-2 p-10 bg-zinc-900/50 border border-zinc-800 border-dashed rounded-[2rem] text-center space-y-4">
                    <p className="text-zinc-500 italic text-sm">No LAN IPs detected. Ensure this PC is connected to a local WiFi/Router.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Connected Terminals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {onlineUsers.filter(u => u.name !== 'Master Hub').map(user => {
                 const channel = CHANNELS.find(c => c.id === user.channelId);
                 return (
                  <div key={user.id} className="glass p-5 rounded-[2rem] border-zinc-800/50 flex items-center gap-4">
                    <div className="h-12 w-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center font-bold text-zinc-500">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-100 truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest font-bold">
                        {channel?.name || 'Syncing...'} Corridor
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[9px] font-mono text-zinc-600">ID: {user.id.substring(0, 4)}</span>
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>
                 )
               })}
               {onlineUsers.filter(u => u.name !== 'Master Hub').length === 0 && (
                 <div className="col-span-2 p-8 text-center text-zinc-600 border border-zinc-800/30 border-dashed rounded-[2rem]">
                   Waiting for mobile terminals to link...
                 </div>
               )}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
           <div className="glass p-8 rounded-[3rem] border-zinc-800/50 space-y-6">
              <div className="flex items-center gap-3 text-zinc-400">
                <Terminal size={20} />
                <h3 className="text-[10px] font-black uppercase tracking-widest italic">Hub Logs</h3>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 font-mono text-[10px] space-y-2 h-64 overflow-y-auto">
                <p className="text-emerald-500/60">[SYSTEM] Server initialized on port 3000</p>
                <p className="text-blue-500/60">[CORE] Signaling engine active</p>
                <p className="text-zinc-600">[INFO] Monitoring network interfaces...</p>
                {onlineUsers.map((u, i) => (
                  <p key={i} className="text-zinc-500">
                    <span className="text-zinc-700">[{new Date(u.connectedAt!).toLocaleTimeString()}]</span> User {u.name} connected
                  </p>
                ))}
              </div>
           </div>

           <div className="glass p-8 rounded-[3rem] border-zinc-800/50 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Gate</h3>
                <span className="text-[10px] font-bold text-emerald-500">ACTIVE</span>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">SSL Relay</span>
                  <span className="text-zinc-300 font-mono">LAN BYPASS</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-medium">Auth Key</span>
                  <span className="text-zinc-300 font-mono italic text-[10px]">JCTGBTG</span>
                </div>
                <div className="pt-4 border-t border-zinc-800/50">
                   <p className="text-[9px] text-zinc-600 leading-relaxed italic">
                     Hub server enforces production password "JCTGBTG" for all link attempts.
                   </p>
                </div>
             </div>
           </div>

           <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[3rem] text-center space-y-4">
              <div className="h-12 w-12 bg-blue-600/20 rounded-2xl mx-auto flex items-center justify-center text-blue-500">
                <Monitor size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-100">Broadcast Mode</p>
                <p className="text-[10px] text-blue-500/70 mt-1 uppercase tracking-widest font-black leading-relaxed">
                  Screen must remain ON for uninterrupted communication.
                </p>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};
