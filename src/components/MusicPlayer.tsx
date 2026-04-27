
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Dragon\'s Breath',
    artist: 'Imperial Synth',
    cover: 'https://picsum.photos/seed/dragon/400/400',
    url: '#',
    duration: 184
  },
  {
    id: '2',
    title: 'Cobra Scale Glaze',
    artist: 'Neon Serpent',
    cover: 'https://picsum.photos/seed/scales/400/400',
    url: '#',
    duration: 212
  },
  {
    id: '3',
    title: 'Mountain Goat Chase',
    artist: 'Glitch Hoof',
    cover: 'https://picsum.photos/seed/goat/400/400',
    url: '#',
    duration: 156
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  React.useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(p => (p + 0.1) % 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex(p => (p + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };
  const handlePrev = () => {
    setCurrentTrackIndex(p => (p - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Music2 className="w-6 h-6 text-white/70" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white font-bold truncate tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-white/40 text-xs truncate uppercase tracking-widest font-mono">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_10px_#ef4444]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 font-mono">
          <span>1:42</span>
          <span>3:04</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button onClick={handlePrev} className="p-2 text-white/40 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
        </button>

        <button onClick={handleNext} className="p-2 text-white/40 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" />
        </button>

        <div className="w-px h-8 bg-white/10" />

        <button className="p-2 text-white/40 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div className="pt-2">
        <p className="text-[9px] uppercase tracking-widest text-white/20 text-center font-mono">
          Now playing AI demo stream
        </p>
      </div>
    </div>
  );
}
