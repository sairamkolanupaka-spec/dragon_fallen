
import React from 'react';
import NeonBackground from './components/NeonBackground';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-red-500/30">
      <NeonBackground />

      <header className="mb-12 text-center relative z-10">
        <motion.div
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="space-y-1"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-8 bg-red-600/50" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-mono text-red-500 font-bold">Protocol X-7</p>
            <span className="h-px w-8 bg-red-600/50" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
            Neon <span className="text-red-600 drop-shadow-[0_0_15px_#dc2626]">Dragon</span>
          </h1>
          <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.2em] font-mono mt-4">
            Draconic Strike Protocol / v1.2.0
          </p>
        </motion.div>
      </header>

      <main className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10">
        {/* Left Side Info (Optional, but adds to the dash feel) */}
        <div className="hidden xl:flex flex-col gap-8 w-64 order-first">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-2">Status</h4>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-white/70 font-mono uppercase tracking-wider">System Armed</p>
            </div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-2">Target Data</h4>
            <p className="text-xs text-white/70 font-mono uppercase tracking-wider leading-relaxed">
              Species: R-Temporaria<br/>
              Classification: Predator<br/>
              Mission: Assimilation
            </p>
          </div>
        </div>

        {/* Center Game */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SnakeGame />
        </motion.div>

        {/* Right Music Player */}
        <motion.div
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="lg:self-end"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      <footer className="mt-16 text-white/20 text-[10px] uppercase tracking-[0.3em] font-mono relative z-10">
        &copy; 2026 AI Studio Build / Neural Audio Lab
      </footer>
    </div>
  );
}
