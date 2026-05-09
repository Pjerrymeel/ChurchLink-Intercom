import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Wifi, 
  Smartphone, 
  LogIn, 
  Radio, 
  Mic, 
  MicOff, 
  Headphones, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle,
  User,
  Info,
  Phone,
  Mail,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const QUICK_START_STEPS = [
  { id: 1, title: 'Connect to Church WiFi', icon: Wifi, description: 'Ensure your device is on the local sanctuary network.' },
  { id: 2, title: 'Open ChurchLink', icon: Smartphone, description: 'Launch the application from your home screen.' },
  { id: 3, title: 'Login or ID Registration', icon: LogIn, description: 'Enter your assigned team credentials.' },
  { id: 4, title: 'Select Channel', icon: Radio, description: 'Choose your specific team communication line.' },
  { id: 5, title: 'Push-to-Talk', icon: Mic, description: 'Hold the button to speak clearly.' },
  { id: 6, title: 'Listen & Release', icon: MicOff, description: 'Release the button to hear others.' },
  { id: 7, title: 'Use Headset', icon: Headphones, description: 'Recommended for best audio clarity.' },
];

const CHANNELS = [
  { name: 'Main Tech', description: 'Primary technical coordination for the house.', icon: 'monitor' },
  { name: 'Camera Team', description: 'Positioning and shot coordination.', icon: 'camera' },
  { name: 'Livestream', description: 'Online broadcast monitoring and cues.', icon: 'globe' },
  { name: 'Worship Team', description: 'MD cues and stage monitoring talkback.', icon: 'music' },
  { name: 'Stage Team', description: 'Props, sets, and stagehand cues.', icon: 'clipboard' },
  { name: 'Emergency', description: 'Critical bypass for urgent safety matters.', icon: 'alert-circle' },
];

const TROUBLESHOOTING = [
  { 
    problem: 'No Audio Output', 
    solutions: ['Check headset connection', 'Ensure volume is turned up', 'Verify WiFi connection'] 
  },
  { 
    problem: 'Cannot Connect to Server', 
    solutions: ['Reconnect to Church WiFi', 'Verify server IP in settings', 'Ask tech lead for assistance'] 
  },
  { 
    problem: 'Microphone Not Working', 
    solutions: ['Allow microphone permissions', 'Restart the app', 'Try a different headset'] 
  },
  { 
    problem: 'Audio Feedback/Eco', 
    solutions: ['Always use earphones/headset', 'Lower speaker volume', 'Move away from house speakers'] 
  },
];

const FAQS = [
  { question: 'Does this app require internet?', answer: 'No. ChurchLink works over the local Church WiFi network. However, some cloud features like updates might need data.' },
  { question: 'Can I use Bluetooth headsets?', answer: 'Yes! Most Bluetooth headsets are supported. Ensure it is paired before opening the app.' },
  { question: 'How many users can connect?', answer: 'Technically unlimited, though performance depends on your local WiFi capacity.' },
  { question: 'What happens if I lose connection?', answer: 'The app will attempt to automatically reconnect once the signal is restored.' },
];

const VIDEOS = [
  { title: 'Joining a Channel', duration: '2:15', thumbnail: 'https://images.unsplash.com/photo-1543185377-99cd19911180?w=400&h=225&fit=crop' },
  { title: 'PTT Best Practices', duration: '1:45', thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop' },
  { title: 'Admin Setup Guide', duration: '5:30', thumbnail: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400&h=225&fit=crop' },
  { title: 'Troubleshooting Audio', duration: '3:20', thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=225&fit=crop' },
];

export const HelpTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-24 px-4 pt-6 space-y-8 bg-zinc-950 text-zinc-100 min-h-screen">
      {/* Header & Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
            <HelpCircle size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
            <p className="text-zinc-400 text-sm">Everything you need to know</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text"
            placeholder="Search help articles..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Start Guide */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Zap size={20} className="text-yellow-500" />
          <h2 className="text-lg font-semibold">Quick Start Guide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QUICK_START_STEPS.map((step) => (
            <motion.div 
              key={step.id}
              whileHover={{ scale: 1.01 }}
              className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex gap-4"
            >
              <div className="h-10 w-10 shrink-0 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                <step.icon size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Step {step.id}</p>
                <h3 className="font-semibold text-zinc-100">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Push to Talk Guide */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Mic size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">How Push-to-Talk Works</h2>
          </div>
          <ul className="space-y-2 text-blue-50/90 text-sm list-disc pl-5">
            <li><strong>Hold to Speak:</strong> Press and hold the big mic button to broadcast.</li>
            <li><strong>Release to Listen:</strong> release the button immediately after speaking.</li>
            <li><strong>One at a time:</strong> Wait for silence before you start talking.</li>
            <li><strong>Be Concise:</strong> Keep messages short (under 5 seconds).</li>
          </ul>
        </div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -right-4 -bottom-4 opacity-10"
        >
          <Mic size={140} />
        </motion.div>
      </section>

      {/* Channel Guide */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold px-1">Channel Directory</h2>
        <div className="grid grid-cols-2 gap-3">
          {CHANNELS.map((channel) => (
            <div key={channel.name} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2">
              <h3 className="font-bold text-blue-400">{channel.name}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{channel.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Guide */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Smartphone size={20} className="text-emerald-500" />
          <h2 className="text-lg font-semibold">How to Install</h2>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
          <p className="text-sm text-zinc-400">Get the full app experience without the App Store:</p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold shrink-0">iOS</div>
              <p className="text-xs text-zinc-300">Tap <span className="bg-zinc-800 px-1.5 py-0.5 rounded italic">Share</span> then <span className="text-blue-400 font-bold">"Add to Home Screen"</span> in Safari.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold shrink-0">AND</div>
              <p className="text-xs text-zinc-300">Tap <span className="bg-zinc-800 px-1.5 py-0.5 rounded italic">Menu (⋮)</span> then <span className="text-blue-400 font-bold">"Install App"</span> in Chrome.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Free Publishing Guide (For Admins) */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info size={20} className="text-blue-400" />
          <h2 className="text-lg font-semibold">Free Publishing Guide</h2>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          You can host ChurchLink for <strong>100% free</strong> using several cloud providers. Recommended for permanent church use:
        </p>
        <div className="space-y-4 pt-2">
          <div className="border-l-2 border-blue-500 pl-4 space-y-2">
            <h3 className="text-sm font-bold text-zinc-200">1. GitHub Pages</h3>
            <p className="text-xs text-zinc-500">The most reliable version. Export this code to GitHub and enable "Pages" in the repository settings.</p>
          </div>
          <div className="border-l-2 border-emerald-500 pl-4 space-y-2">
            <h3 className="text-sm font-bold text-zinc-200">2. Vercel / Netlify</h3>
            <p className="text-xs text-zinc-500">The easiest way to publish. Simply connect your GitHub account for automatic updates and a free subdomain.</p>
          </div>
          <div className="border-l-2 border-orange-500 pl-4 space-y-2">
            <h3 className="text-sm font-bold text-zinc-200">3. Local Area Network</h3>
            <p className="text-xs text-zinc-500">Host it on a PC within the church sanctuary. Since it works over WiFi, you don't even need a public domain.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <AlertTriangle size={20} className="text-orange-500" />
          <h2 className="text-lg font-semibold">Troubleshooting</h2>
        </div>
        <div className="space-y-3">
          {TROUBLESHOOTING.map((item) => (
            <div key={item.problem} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
              <h3 className="font-semibold text-zinc-100 mb-2 truncate">Problem: "{item.problem}"</h3>
              <div className="space-y-1.5">
                {item.solutions.map((sol, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                    <CheckCircle2 size={14} className="mt-0.5 text-green-500 shrink-0" />
                    <span>{sol}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold px-1">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="border-b border-zinc-800 pb-3">
              <button 
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-2 text-left group"
              >
                <span className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">{faq.question}</span>
                {expandedFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <AnimatePresence>
                {expandedFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-zinc-400 pt-2 pb-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold px-1">Video Tutorials</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x no-scrollbar">
          {VIDEOS.map((video) => (
            <div key={video.title} className="shrink-0 w-64 snap-start space-y-2 group cursor-pointer">
              <div className="aspect-video rounded-2xl overflow-hidden relative border border-zinc-800 bg-zinc-900">
                <img referrerPolicy="no-referrer" src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={40} className="text-white drop-shadow-lg" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                  {video.duration}
                </div>
              </div>
              <h3 className="font-medium text-sm text-zinc-200">{video.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Contact */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Still Need Help?</h2>
          <p className="text-zinc-400 text-sm">Our technical admin is available during services.</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-2xl">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <User size={24} />
            </div>
            <div>
              <p className="text-zinc-100 font-semibold">David Thompson</p>
              <p className="text-zinc-500 text-xs">Head Technical Director</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <a href="tel:5550123" className="flex items-center gap-3 p-3 text-sm text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors">
              <Phone size={18} className="text-blue-500" />
              <span>+1 (555) 012-3456</span>
            </a>
            <a href="mailto:admin@churchhub.com" className="flex items-center gap-3 p-3 text-sm text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors">
              <Mail size={18} className="text-blue-500" />
              <span>support@churchlink.local</span>
            </a>
          </div>

          <button className="w-full bg-zinc-100 text-zinc-950 font-bold py-4 rounded-2xl hover:bg-white active:scale-[0.98] transition-all">
            Report an Issue
          </button>
        </div>
      </section>

      {/* App Info */}
      <div className="text-center space-y-4 py-8 opacity-50">
        <div className="flex items-center justify-center gap-1.5 text-zinc-400">
          <Info size={14} />
          <span className="text-xs uppercase tracking-widest font-bold">ChurchLink v2.4.0</span>
        </div>
        <div className="space-y-1 text-[10px] text-zinc-500">
          <p>Server Status: <span className="text-green-500 font-bold uppercase">Online</span></p>
          <p>Local IP: 192.168.1.104</p>
          <p>© 2026 ChurchLink Media Group. Developed by Pida & Team.</p>
        </div>
      </div>

      {/* Floating Help Button (Optional, as per requirement) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed right-6 bottom-24 h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 z-50 text-white"
      >
        <Phone size={24} />
      </motion.button>
    </div>
  );
};
