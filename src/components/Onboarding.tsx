import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, 
  Users, 
  Mic, 
  ShieldCheck, 
  ChevronRight,
  Wifi
} from 'lucide-react';

interface OnboardingSlide {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    title: 'Welcome to ChurchLink',
    description: 'High-performance local intercom for your whole ministry team.',
    icon: Radio,
    color: 'bg-blue-600'
  },
  {
    title: 'Zero Latency Communication',
    description: 'Connect directly over your church WiFi. No internet required for voice.',
    icon: Wifi,
    color: 'bg-indigo-600'
  },
  {
    title: 'Team-Specific Channels',
    description: 'Join Camera, Tech, or Music teams instantly and stay in the loop.',
    icon: Users,
    color: 'bg-emerald-600'
  },
  {
    title: 'Push-to-Talk Power',
    description: 'Tap and hold to broadcast your voice clearly across the system.',
    icon: Mic,
    color: 'bg-orange-600'
  },
  {
    title: 'Ready to Serve?',
    description: 'Stay connected with your ministry team and excel in your role.',
    icon: ShieldCheck,
    color: 'bg-zinc-100'
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide === SLIDES.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const skip = () => onComplete();

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
      <div className="absolute top-8 right-8">
        <button 
          onClick={skip}
          className="text-zinc-500 font-semibold hover:text-zinc-300 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center text-center space-y-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className={`h-32 w-32 rounded-[2.5rem] flex items-center justify-center ${SLIDES[currentSlide].color} ${currentSlide === 4 ? 'text-zinc-950' : 'text-white'} shadow-2xl shadow-blue-500/10`}>
              {React.createElement(SLIDES[currentSlide].icon, { size: 56 })}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                {SLIDES[currentSlide].title}
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                {SLIDES[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex gap-2.5">
          {SLIDES.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-blue-500' : 'w-1.5 bg-zinc-800'}`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm pt-12">
        <button 
          onClick={nextSlide}
          className="w-full bg-zinc-100 text-zinc-950 font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white active:scale-95 transition-all text-lg"
        >
          {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next Step'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
