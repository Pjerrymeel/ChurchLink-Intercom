/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Tab, User, ServerInfo } from './types';
import { Sidebar } from './components/Layout/Sidebar';
import { Navbar } from './components/Layout/Navbar';
import { HelpTab } from './components/HelpTab';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { Onboarding } from './components/Onboarding';
import { WelcomeScreen } from './components/Auth/WelcomeScreen';
import { Navigation } from './components/Navigation';
import { Radio, Users, Mic, ShieldAlert, Monitor, Camera, Globe, Music, RefreshCw, Server, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CHANNELS } from './constants';

// Component to handle remote audio playback - DEFINED OUTSIDE to prevent unmounting on re-render
const RemoteAudio = ({ stream, userId }: { stream: MediaStream, userId: string, key?: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
      // High-quality, low-latency playback
      audioRef.current.play().catch(e => console.warn("Autoplay interaction pending:", e));
    }
  }, [stream]);
  return <audio ref={audioRef} autoPlay playsInline id={`audio-${userId}`} style={{ display: 'none' }} />;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPTTActive, setIsPTTActive] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [isChangingServer, setIsChangingServer] = useState(false);
  const [tempIp, setTempIp] = useState(localStorage.getItem('churchlink_server_ip') || '');
  
  const isHost = !!window.electron;
  
  useEffect(() => {
    let timer: any;
    if (!socketConnected && !isHost) {
      // Only show error overlay for CLIENTS (non-EXE)
      timer = setTimeout(() => setShowErrorOverlay(true), 3000);
    } else {
      setShowErrorOverlay(false);
    }
    return () => clearTimeout(timer);
  }, [socketConnected, isHost]);

  const isPTTActiveRef = useRef(false);
  // WebRTC Refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<{ [userId: string]: RTCPeerConnection }>({});
  const remoteStreamsRef = useRef<{ [userId: string]: MediaStream }>({});
  const currentChannelIdRef = useRef<string>("1");
  const socketRef = useRef<Socket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentUser = onlineUsers.find(u => u.name === username);
  const isMainTech = currentUser?.channelId === '1';

  useEffect(() => {
    const initLocalStream = async () => {
      if (localStreamRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: { ideal: true },
            noiseSuppression: { ideal: true },
            autoGainControl: { ideal: true },
            sampleRate: { ideal: 48000 },
            sampleSize: { ideal: 16 },
            channelCount: { ideal: 1 }
          }
        });
        
        // Start muted, PTT will enable the track
        stream.getAudioTracks().forEach(track => {
          track.enabled = false;
        });
        
        localStreamRef.current = stream;
        console.log("Local microphone stream initialized (muted)");
      } catch (err) {
        console.error("Microphone initialization failed:", err);
      }
    };

    const handleUserInteraction = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      initLocalStream();
    };

    document.addEventListener('mousedown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    window.addEventListener('blur', stopTalk);

    const createPeerConnection = (targetId: string) => {
      if (peerConnectionsRef.current[targetId]) return peerConnectionsRef.current[targetId];

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10
      });

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('signal-ice', { to: targetId, candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        console.log(`Received remote track from ${targetId}`);
        remoteStreamsRef.current[targetId] = event.streams[0];
        setOnlineUsers(prev => [...prev]); // Force re-render to attach audio tags
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      peerConnectionsRef.current[targetId] = pc;
      return pc;
    };

    if (username) {
      const manualIp = localStorage.getItem('churchlink_server_ip');
      
      // Determine connection URL
      let connectionUrl: string | undefined = undefined;
      const currentHostname = window.location.hostname;
      const currentProtocol = window.location.protocol;
      
      if (isHost) {
        // High priority: EXE is the HUB itself, MUST use localhost. NEVER search for external.
        connectionUrl = 'http://localhost:3000';
      } else if (manualIp) {
        // Clients can use manual IP
        connectionUrl = (manualIp.startsWith('http') ? manualIp : `http://${manualIp}:3000`);
      } else if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
        // Browser on the same machine
        connectionUrl = 'http://localhost:3000';
      } else if (currentProtocol.includes('http')) {
        // Standard Web Client
        connectionUrl = window.location.origin;
      }
      
      // Special check for mobile environments
      const isMobileEnv = currentProtocol.includes('capacitor') || currentProtocol.includes('file') || currentProtocol.includes('android');
      
      if (!isHost && isMobileEnv && !manualIp) {
         console.warn("Mobile Client detected without Host IP. Showing configuration overlay.");
         setTimeout(() => setShowErrorOverlay(true), 100);
         return; // Don't even try to connect to nothing
      }

      console.log(`📡 Connecting to: ${connectionUrl || 'automatic'} | Role: ${isHost ? 'HOST' : 'CLIENT'}`);
      
      const socket = io(connectionUrl, {
        transports: ['websocket'],
        upgrade: false,
        reconnectionAttempts: 50, // Keep trying!
        reconnectionDelay: 1000,
        timeout: 10000
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Successfully connected to intercom server');
        setSocketConnected(true);
        setReconnectCount(0);
        socket.emit('join-intercom', { username });
        
        // Fetch server info
        const urlToFetch = connectionUrl || window.location.origin;
        fetch(`${urlToFetch}/api/info`)
          .then(res => res.json())
          .then(data => {
            if (data.status === 'ok') {
              setServerInfo(data);
              console.log('Server info synchronized:', data);
            }
          })
          .catch(err => console.warn('Could not fetch server info:', err));
      });

      socket.on('reconnect_attempt', () => {
        setReconnectCount(prev => prev + 1);
      });

      socket.on('active-users-update', (users: User[]) => {
        setOnlineUsers(users);
      });

      socket.on('user-speaking-status', (data: { userId: string; channelId: string; isSpeaking: boolean }) => {
        if (data.channelId !== currentChannelIdRef.current) return;
        setOnlineUsers(prev => prev.map(u => 
          u.id === data.userId ? { ...u, isSpeaking: data.isSpeaking } : u
        ));
      });

      // WebRTC Signaling
      socket.on('request-handshake', async (data: { from: string }) => {
        const pc = createPeerConnection(data.from);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('signal-offer', { to: data.from, offer });
      });

      socket.on('signal-offer', async (data: { from: string, offer: any }) => {
        const pc = createPeerConnection(data.from);
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('signal-answer', { to: data.from, answer });
      });

      socket.on('signal-answer', async (data: { from: string, answer: any }) => {
        const pc = peerConnectionsRef.current[data.from];
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      });

      socket.on('signal-ice', async (data: { from: string, candidate: any }) => {
        const pc = peerConnectionsRef.current[data.from];
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      return () => {
        socket.disconnect();
        window.removeEventListener('blur', stopTalk);
        Object.values(peerConnectionsRef.current).forEach((pc: RTCPeerConnection) => pc.close());
        localStreamRef.current?.getTracks().forEach(t => t.stop());
      };
    }
  }, [username]);

  // Channel monitor
  useEffect(() => {
    if (currentUser?.channelId && socketRef.current) {
      const newChannelId = currentUser.channelId;
      
      // If we actually changed channels
      if (currentChannelIdRef.current !== newChannelId) {
        console.log(`Channel changed from ${currentChannelIdRef.current} to ${newChannelId}. Cleaning up peers...`);
        
        // Close all existing peer connections
        Object.values(peerConnectionsRef.current).forEach((pc: RTCPeerConnection) => pc.close());
        peerConnectionsRef.current = {};
        remoteStreamsRef.current = {};
        
        currentChannelIdRef.current = newChannelId;
      }
      
      // Re-trigger handshakes for new room
      socketRef.current.emit('request-handshake', { channelId: newChannelId });
    }
  }, [currentUser?.channelId, socketConnected]);

  // Handle PTT speaking status
  useEffect(() => {
    isPTTActiveRef.current = isPTTActive;
    
    // WebRTC: Just enable/disable the track
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isPTTActive;
      });
    }

    if (socketRef.current && socketConnected) {
      socketRef.current.emit('speaking-update', { isSpeaking: isPTTActive });
    }
  }, [isPTTActive, socketConnected]);

  useEffect(() => {
    // Check for onboarding
    const hasCompletedOnboarding = localStorage.getItem('churchlink_onboarding_complete');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }

    // Check for username and login status
    const storedUsername = localStorage.getItem('churchlink_username');
    const loginStatus = localStorage.getItem('churchlink_loginStatus');
    if (storedUsername && loginStatus === 'true') {
      setUsername(storedUsername);
    }
    setIsAuthReady(true);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('churchlink_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const handleLogin = (name: string) => {
    localStorage.setItem('churchlink_username', name);
    localStorage.setItem('churchlink_loginStatus', 'true');
    setUsername(name);
  };

  const handleLogout = () => {
    if (socketRef.current) socketRef.current.disconnect();
    localStorage.removeItem('churchlink_username');
    localStorage.removeItem('churchlink_loginStatus');
    setUsername(null);
  };

  const changeChannel = (channelId: string) => {
    console.log("JOINING CHANNEL...", channelId);
    if (socketRef.current && socketConnected) {
      socketRef.current.emit('change-channel', channelId);
      setCurrentTab('dashboard');
      console.log("SOCKET EMIT SENT & UI SWITCH TRIGGERED");
    }
  };

  const startTalk = () => {
    console.log("PTT STARTED");
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } else {
      // Fallback initialization if listeners didn't fire for some reason
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Ensure local stream is active before transmitting
    if (!localStreamRef.current) {
      console.warn("Local stream missing during PTT, attempting to initialize...");
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          localStreamRef.current = stream;
          stream.getAudioTracks().forEach(track => track.enabled = true);
          setIsPTTActive(true);
        })
        .catch(err => console.error("PTT microphone recovery failed:", err));
    } else {
      setIsPTTActive(true);
    }
  };

  const stopTalk = () => {
    console.log("PTT STOPPED");
    setIsPTTActive(false);
  };

  if (!isAuthReady) return null;

  const renderContent = () => {
    // Generate remote audio elements for users in current channel
    const otherUsersInChannel = onlineUsers.filter(u => u.channelId === currentChannelIdRef.current && u.id !== socketRef.current?.id);
    const remoteAudioElements = otherUsersInChannel.map(u => {
      const stream = remoteStreamsRef.current[u.id];
      if (stream) {
        return <RemoteAudio key={u.id} userId={u.id} stream={stream} />;
      }
      return null;
    });

    return (
      <>
        {remoteAudioElements}
        {(() => {
          switch (currentTab) {
            case 'dashboard':
              return <DashboardHome 
                username={username!} 
                onlineUsers={onlineUsers} 
                onChannelChange={changeChannel} 
                onOpenChannels={() => setCurrentTab('channels')}
                currentChannelId={currentUser?.channelId}
                serverInfo={serverInfo}
              />;
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
                    <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 border border-blue-500/20 font-bold py-3 px-6 rounded-2xl transition-all flex items-center gap-2">
                      <Radio size={18} />
                      Create New Channel
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {CHANNELS.map((channel) => {
                       const isJoined = currentUser?.channelId === channel.id;
                       return (
                        <div key={channel.id} className={`glass p-6 rounded-[2rem] border transition-all ${isJoined ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800/50 hover:border-zinc-700'}`}>
                           <div className="flex items-center justify-between mb-6">
                              <div className={`h-14 w-14 rounded-2xl bg-zinc-950 border flex items-center justify-center ${isJoined ? 'text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'text-zinc-500 border-zinc-800'}`}>
                                {channel.icon === 'monitor' && <Monitor size={28} />}
                                {channel.icon === 'camera' && <Camera size={28} />}
                                {channel.icon === 'globe' && <Globe size={28} />}
                                {channel.icon === 'music' && <Music size={28} />}
                              </div>
                              {isJoined && (
                                <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Active</span>
                                </div>
                              )}
                           </div>
                           <div className="space-y-2 mb-8">
                             <h3 className="font-bold text-xl text-zinc-100">{channel.name}</h3>
                             <p className="text-sm text-zinc-500 leading-relaxed">{channel.description}</p>
                           </div>
                           <button 
                              onClick={() => changeChannel(channel.id)}
                              disabled={isJoined}
                              className={`w-full py-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                isJoined 
                                ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed' 
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer active:scale-95'
                              }`}
                            >
                             <Mic size={14} />
                             {isJoined ? 'Already Connected' : 'Join Room'}
                           </button>
                        </div>
                       );
                     })}
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
              return <DashboardHome 
                username={username!} 
                onlineUsers={onlineUsers} 
                onChannelChange={changeChannel}
                onOpenChannels={() => setCurrentTab('channels')}
                currentChannelId={currentUser?.channelId} 
                serverInfo={serverInfo}
              />;
          }
        })()}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!username ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200]"
          >
            <WelcomeScreen onJoin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
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
                onLogout={handleLogout}
              />
            </div>

            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
              <Navbar 
                username={username} 
                onLogout={handleLogout} 
                socketConnected={socketConnected}
                serverInfo={serverInfo}
              />

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
            
            {/* Global Intercom Controls */}
            <AnimatePresence>
              {/* Only show PTT on Clients (non-Host) who are NOT on the Main Tech listen-only channel */}
              {!isHost && !isMainTech && (
                <motion.div 
                  initial={{ y: 150 }}
                  animate={{ y: 0 }}
                  exit={{ y: 150 }}
                  className="fixed bottom-24 lg:bottom-12 right-0 left-0 lg:left-auto lg:right-12 px-6 lg:px-0 flex justify-center z-50"
                >
                  <button 
                    onPointerDown={(e) => {
                      e.preventDefault();
                      startTalk();
                    }}
                    onPointerUp={(e) => {
                      e.preventDefault();
                      stopTalk();
                    }}
                    onPointerLeave={(e) => {
                      e.preventDefault();
                      if (isPTTActive) stopTalk();
                    }}
                    onPointerCancel={(e) => {
                      e.preventDefault();
                      if (isPTTActive) stopTalk();
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`
                      w-full lg:w-80 glass px-6 py-6 rounded-[2.5rem] flex items-center justify-between gap-6 transition-all active:scale-95 group relative overflow-hidden touch-none select-none
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
                          {isPTTActive ? `${username}, go ahead` : 'HOLD TO TALK'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                       <div className={`h-1.5 w-1.5 rounded-full ${isPTTActive ? 'bg-white animate-ping' : 'bg-zinc-700'}`} />
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Show Listen-Only status for Main Tech channel on Clients */}
              {!isHost && isMainTech && (
                <motion.div 
                  initial={{ y: 150 }}
                  animate={{ y: 0 }}
                  exit={{ y: 150 }}
                  className="fixed bottom-24 lg:bottom-12 right-0 left-0 lg:left-auto lg:right-12 px-6 lg:px-0 flex justify-center z-50 pointer-events-none"
                >
                  <div className="w-full lg:w-80 glass px-6 py-4 rounded-2xl flex items-center justify-center gap-3 border-zinc-800/50 bg-blue-500/5">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Listen Only Channel
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Connection Overlay - CLIENT ONLY */}
      <AnimatePresence>
        {!isHost && showErrorOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass p-8 rounded-[2.5rem] border-red-500/20 text-center space-y-6 shadow-2xl">
              <div className="h-16 w-16 bg-red-500/10 rounded-full mx-auto flex items-center justify-center text-red-500">
                <WifiOff size={32} />
              </div>
              
              {!isChangingServer ? (
                <>
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-red-100">
                      Host Server Not Found
                    </h2>
                    
                    <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-left space-y-3">
                      <div className="space-y-3">
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          This <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Client Terminal</span> cannot reach the 
                          <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]"> Hub PC</span>.
                        </p>
                        <ul className="text-[10px] space-y-2 text-zinc-500 font-medium">
                          <li className="flex items-start gap-2">
                            <div className="h-1 w-1 rounded-full bg-blue-500 mt-1" />
                            Ensure the Hub PC (Windows EXE) is running.
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-1 w-1 rounded-full bg-blue-500 mt-1" />
                            Connect both devices to the same WiFi.
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-1 w-1 rounded-full bg-blue-500 mt-1" />
                            Enter the Hub IP address below.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 py-2 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                    <RefreshCw size={14} className="text-blue-500 animate-spin" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {socketConnected ? "Link Established" : `Re-linking (Attempt ${reconnectCount})`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setIsChangingServer(true)}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 py-3 rounded-xl text-[10px] font-bold hover:bg-zinc-800 transition-all uppercase tracking-widest"
                    >
                      Change IP
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-blue-600/20 border border-blue-500/30 text-blue-400 py-3 rounded-xl text-[10px] font-bold hover:bg-blue-600/30 transition-all uppercase tracking-widest"
                    >
                      Refresh
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-blue-100">Configure Hub IP</h2>
                    <p className="text-zinc-500 text-sm">
                      Enter the IP of the Windows Hub PC.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-left space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Hub Address</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={tempIp}
                          onChange={(e) => setTempIp(e.target.value)}
                          placeholder="e.g. 192.168.x.x"
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-zinc-700"
                        />
                        <button 
                          onClick={async () => {
                            const trimmedIp = tempIp.trim();
                            if (!trimmedIp) return;
                            const protocol = trimmedIp.startsWith('http') ? '' : 'http://';
                            const port = trimmedIp.includes(':') ? '' : ':3000';
                            const testUrl = `${protocol}${trimmedIp}${port}/api/ping`;
                            
                            try {
                              const res = await fetch(testUrl, { signal: AbortSignal.timeout(3000) } as any);
                              const text = await res.text();
                              if (text === 'pong') {
                                alert("✅ Success! Hub reached.");
                              } else {
                                alert("⚠️ Connection made, but response was unexpected.");
                              }
                            } catch (e) {
                              alert("❌ Failed: Could not reach Hub at this IP.");
                            }
                          }}
                          className="px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-[10px] font-bold transition-all text-zinc-400 uppercase tracking-widest"
                        >
                          Ping
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => setIsChangingServer(false)}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-300 py-3 rounded-xl text-[10px] font-bold hover:bg-zinc-800 transition-all uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem('churchlink_server_ip', tempIp);
                          window.location.reload();
                        }}
                        className="bg-blue-600 text-white py-3 rounded-xl text-[10px] font-bold hover:bg-blue-500 transition-all uppercase tracking-widest"
                      >
                        Save & Link
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
