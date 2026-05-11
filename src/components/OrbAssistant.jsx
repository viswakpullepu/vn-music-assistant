import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OrbAssistant.css';

const ORBS_IDLE = [
  'rgba(168,85,247,0.6)',
  'rgba(0,245,255,0.5)',
  'rgba(59,130,246,0.4)',
];

export default function OrbAssistant({ mood, isListening, isSpeaking, moodData }) {
  const [tick, setTick] = useState(0);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Generate particles on mood change
  useEffect(() => {
    if (!mood) return;
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: `${mood}-${i}-${Date.now()}`,
      angle: (i / 16) * 360,
      dist: 60 + Math.random() * 40,
      size: 2 + Math.random() * 4,
      opacity: 0.6 + Math.random() * 0.4,
      speed: 0.5 + Math.random() * 1.5,
    }));
    setParticles(newParticles);
  }, [mood]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const primaryColor = moodData?.color || '#a855f7';
  const glowColor = moodData?.glow || 'rgba(168,85,247,0.4)';

  const orbVariants = {
    idle: {
      scale: [1, 1.06, 1],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    listening: {
      scale: [1, 1.15, 0.95, 1.1, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    },
    speaking: {
      scale: [1, 1.12, 0.98, 1.08, 1],
      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';

  return (
    <div className="orb-wrapper">
      {/* Outer ring pulse rings */}
      <AnimatePresence>
        {(isListening || isSpeaking) && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="pulse-ring"
                style={{ borderColor: primaryColor }}
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Rotating outer glow ring */}
      <motion.div
        className="orb-ring-outer"
        style={{ borderColor: `${primaryColor}40` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main orb */}
      <motion.div
        className="orb-main"
        variants={orbVariants}
        animate={state}
        style={{
          background: `radial-gradient(circle at 35% 35%, ${primaryColor}cc, ${primaryColor}44 50%, transparent 70%), radial-gradient(circle at 65% 65%, rgba(0,245,255,0.3), transparent 60%)`,
          boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}60, inset 0 0 30px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Inner core shimmer */}
        <motion.div
          className="orb-core"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: `radial-gradient(circle, white 0%, ${primaryColor} 50%, transparent 70%)` }}
        />

        {/* Emoji / icon when mood active */}
        <AnimatePresence>
          {mood && moodData?.emoji && (
            <motion.div
              key={mood}
              className="orb-emoji"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {moodData.emoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waveform bars when speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="waveform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <motion.div
                  key={i}
                  className="wave-bar"
                  style={{ background: primaryColor }}
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Orbiting particles */}
      <AnimatePresence>
        {mood && particles.map((p) => (
          <motion.div
            key={p.id}
            className="orbit-particle"
            style={{
              width: p.size,
              height: p.size,
              background: primaryColor,
              boxShadow: `0 0 ${p.size * 2}px ${primaryColor}`,
            }}
            animate={{
              rotate: [p.angle, p.angle + 360],
              x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
              y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
              opacity: [p.opacity, 0.2, p.opacity],
            }}
            transition={{
              rotate: { duration: 4 / p.speed, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
