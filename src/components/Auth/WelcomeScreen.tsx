import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Mic, ChevronRight, User, Lock, Settings, Globe, Server } from 'lucide-react';

interface WelcomeScreenProps {
  onJoin: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [serverIp, setServerIp] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [localIps, setLocalIps] = useState<string[]>([]);

  useEffect(() => {
    const savedIp = localStorage.getItem('churchlink_server_ip');
    if (savedIp) setServerIp(savedIp);
    
    // Fetch local IPs if available
    const protocol = window.location.protocol.includes('http') ? window.location.protocol : 'http:';
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? window.location.hostname : 'localhost';
    
    fetch(`${protocol}//${host}:3000/api/info`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && data.ips) {
          setLocalIps(data.ips);
        }
      })
      .catch(() => {
        // Fallback or ignore if server not started yet
        if (window.electron && window.electron.getLocalIPs) {
          setLocalIps(window.electron.getLocalIPs());
        }
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      setError('Please enter your name (min 2 chars)');
      triggerShake();
      return;
    }
    
    if (password !== "JCTGBTG") {
      setError('Incorrect password. Access denied.');
      triggerShake();
      return;
    }

    if (!window.electron && serverIp) {
      localStorage.setItem('churchlink_server_ip', serverIp);
    } else if (!window.electron) {
      localStorage.removeItem('churchlink_server_ip');
    }
    
    // If it is host, we enforce clearing any manual IP to ensure it uses localhost
    if (window.electron) {
      localStorage.removeItem('churchlink_server_ip');
    }

    setIsLoading(true);
    // Simulate a small tech sync delay
    setTimeout(() => {
      onJoin(trimmedName);
    }, 800);
  };

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-md w-full relative z-10">
        <motion.div
          animate={shouldShake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[3rem] p-8 md:p-12 space-y-8 shadow-2xl shadow-blue-500/5"
        >
          {/* Logo Section */}
          <div className="text-center space-y-4">
            <div className="h-20 w-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-600/30 relative">
              <Radio size={40} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-white uppercase italic text-center">
                Church<span className="text-blue-500">Link</span>
              </h1>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
                Client Terminal
              </p>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          <div className="bg-zinc-900/40 rounded-3xl p-6 border border-zinc-800/50 space-y-4">
             <div className="flex items-center gap-3 text-blue-400">
               <Globe size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">LAN Connection</span>
             </div>
             <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest">
               Status: <span className="text-zinc-300 italic">Enter Hub IP to Link</span>
             </p>
             
             <div className="space-y-2">
                <label htmlFor="ip" className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-1">
                  Hub PC Address (LAN IP)
                </label>
                <input
                  id="ip"
                  type="text"
                  placeholder="e.g. 192.168.1.15"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-mono"
                  value={serverIp}
                  onChange={(e) => setServerIp(e.target.value)}
                />
                <p className="text-[8px] text-zinc-600 italic px-1">
                  Connect this device to the same WiFi as the Hub PC.
                </p>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Identity Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Your Production Identity
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Angelo (Tech)"
                    autoComplete="off"
                    className={`
                      w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg font-medium
                      ${error && error.includes('name') ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500' : ''}
                    `}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="pass" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Access Key
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    id="pass"
                    type="password"
                    placeholder="Enter Key"
                    autoComplete="current-password"
                    className={`
                      w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg font-medium
                      ${error && error.includes('password') ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500' : ''}
                    `}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                  />
                </div>
              </div>

              {/* Advanced Settings - ONLY for Clients */}
              {!window.electron && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                  >
                    <Settings size={12} />
                    Advanced: Server Settings
                  </button>
                  
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-2 pt-4"
                      >
                        <label htmlFor="ip" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                          Manual Server IP (LAN)
                        </label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                            <Globe size={18} />
                          </div>
                          <input
                            id="ip"
                            type="text"
                            placeholder="e.g. 192.168.1.15"
                            className="w-full bg-zinc-950/30 border border-zinc-800/50 rounded-xl py-3 pl-11 pr-4 text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                            value={serverIp}
                            onChange={(e) => setServerIp(e.target.value)}
                          />
                        </div>
                        <p className="text-[9px] text-zinc-700 italic ml-1">
                          Required for Mobile: Enter the IP shown on your host server's screen.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-100 text-zinc-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white active:scale-95 transition-all text-sm uppercase tracking-[0.2em] shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Linking...</span>
                </div>
              ) : (
                <>
                  Connect to Hub
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-zinc-500 leading-relaxed max-w-[200px] mx-auto">
            Authorized team member access only. All communication is monitored via the central router.
          </p>
        </motion.div>

        {/* Status Indicator */}
        <div className="mt-8 flex items-center justify-center gap-4 text-zinc-600">
          <div className="flex items-center gap-1.5 grayscale opacity-50">
             <Mic size={14} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Mic Ready</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-900" />
          <div className="flex items-center gap-1.5">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Local LAN Server Online</span>
          </div>
        </div>
        
        <p className="mt-6 text-center text-[9px] text-zinc-600 uppercase tracking-widest opacity-40">
          Offline Mode: Active (Local Network Communication Only)
        </p>
      </div>
    </div>
  );
};
