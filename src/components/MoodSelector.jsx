import { motion } from 'framer-motion';
import { MOODS, MOOD_QUICK_PICKS } from '../mood-engine/moodEngine';
import './MoodSelector.css';

export default function MoodSelector({ currentMood, onMoodSelect }) {
  return (
    <div className="mood-selector">
      <p className="mood-selector-label">MOOD SELECT</p>
      <div className="mood-grid">
        {MOOD_QUICK_PICKS.map((moodKey, i) => {
          const m = MOODS[moodKey];
          const isActive = currentMood === moodKey;
          return (
            <motion.button
              key={moodKey}
              className={`mood-card ${isActive ? 'active' : ''}`}
              style={isActive ? {
                borderColor: `${m.color}80`,
                background: `${m.color}15`,
                boxShadow: `0 0 24px ${m.glow}`,
              } : {}}
              onClick={() => onMoodSelect(moodKey)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              id={`mood-${moodKey}`}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label" style={isActive ? { color: m.color } : {}}>
                {m.label}
              </span>
              <span className="mood-desc">{m.description}</span>

              {/* Energy bar */}
              <div className="mood-energy-bar">
                <div
                  className="mood-energy-fill"
                  style={{
                    width: `${m.energy * 100}%`,
                    background: m.color,
                    boxShadow: isActive ? `0 0 8px ${m.color}` : 'none',
                  }}
                />
              </div>

              {isActive && (
                <motion.div
                  className="mood-active-ring"
                  style={{ borderColor: m.color }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
