
import { motion } from 'motion/react';

export default function NeonBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020202] overflow-hidden">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #444 1px, transparent 1px),
            linear-gradient(to bottom, #444 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 150, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none" />
    </div>
  );
}
