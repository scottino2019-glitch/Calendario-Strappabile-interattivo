import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface TearOffAnimationProps {
  onComplete: () => void;
}

export const triggerTearConfetti = () => {
  try {
    // Fire confetti with paper-like colors
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FAF7F0', '#E8D2B5', '#FEF9DA', '#D96B43', '#E06D82'],
      shapes: ['square'],
      scalar: 1.2,
    });
  } catch (e) {
    console.warn('Confetti error', e);
  }
};

export const TearOffAnimationOverlay: React.FC<TearOffAnimationProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
      animate={{
        y: [0, 50, 600],
        rotate: [0, -8, 25],
        opacity: [1, 0.9, 0],
        scale: [1, 0.98, 0.85],
      }}
      transition={{ duration: 0.85, ease: 'easeIn' }}
      onAnimationComplete={onComplete}
      className="absolute inset-0 z-50 pointer-events-none rounded-xl bg-amber-50/20 backdrop-blur-xs border border-amber-300/30 shadow-2xl overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-4 bg-red-500/30 blur-xs" />
    </motion.div>
  );
};
