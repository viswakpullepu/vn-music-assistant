import { motion } from 'framer-motion';
import { Brain, Clock, TrendingUp, Music, SkipForward, Heart } from 'lucide-react';
import { MOODS } from '../mood-engine/moodEngine';
import './MemoryPanel.css';

export default function MemoryPanel({ memory }) {
  const topGenres = Object.entries(memory.genrePreferences || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentMoods = (memory.moodHistory || []).slice(0, 8);

  const sessionSlots = [
    { key: 'morning', label: 'Morning', icon: '🌅', time: '5am–12pm' },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️', time: '12pm–5pm' },
    { key: 'evening', label: 'Evening', icon: '🌆', time: '5pm–9pm' },
    { key: 'night', label: 'Night', icon: '🌙', time: '9pm–12am' },
    { key: 'lateNight', label: 'Late Night', icon: '🌃', time: '12am–5am' },
  ];

  const totalSessions = memory.totalSessions || 0;
  const likedCount = (memory.likedSongs || []).length;
  const skippedCount = (memory.skippedSongs || []).length;

  return (
    <div className="memory-panel">
      {/* Header stats */}
      <div className="memory-stats-row">
        {[
          { icon: <Music size={14} />, label: 'Sessions', value: totalSessions },
          { icon: <Heart size={14} />, label: 'Liked', value: likedCount, color: '#f43f5e' },
          { icon: <SkipForward size={14} />, label: 'Skipped', value: skippedCount, color: '#fbbf24' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="stat-icon" style={{ color: s.color || 'var(--cyan)' }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Time patterns */}
      <div className="memory-section">
        <div className="memory-section-title">
          <Clock size={12} />
          <span>Time Patterns</span>
        </div>
        <div className="time-patterns">
          {sessionSlots.map((slot, i) => {
            const mood = memory.sessionPatterns?.[slot.key];
            const moodData = mood ? MOODS[mood] : null;
            return (
              <motion.div
                key={slot.key}
                className="time-slot"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="slot-icon">{slot.icon}</span>
                <div className="slot-info">
                  <span className="slot-label">{slot.label}</span>
                  <span className="slot-time">{slot.time}</span>
                </div>
                <div className="slot-mood">
                  {moodData ? (
                    <span className="slot-mood-tag" style={{
                      color: moodData.color,
                      borderColor: `${moodData.color}40`,
                      background: `${moodData.color}10`,
                    }}>
                      {moodData.emoji} {moodData.label}
                    </span>
                  ) : (
                    <span className="slot-mood-empty">—</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent moods */}
      {recentMoods.length > 0 && (
        <div className="memory-section">
          <div className="memory-section-title">
            <TrendingUp size={12} />
            <span>Recent Moods</span>
          </div>
          <div className="recent-moods">
            {recentMoods.map((entry, i) => {
              const m = MOODS[entry.mood];
              if (!m) return null;
              return (
                <motion.div
                  key={i}
                  className="mood-chip"
                  style={{ background: `${m.color}15`, borderColor: `${m.color}30`, color: m.color }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {m.emoji} {m.label}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top genres */}
      {topGenres.length > 0 && (
        <div className="memory-section">
          <div className="memory-section-title">
            <Brain size={12} />
            <span>Learned Genres</span>
          </div>
          <div className="genre-bars">
            {topGenres.map(([genre, count], i) => {
              const max = topGenres[0][1];
              return (
                <motion.div
                  key={genre}
                  className="genre-bar-row"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <span className="genre-name">{genre}</span>
                  <div className="genre-bar-track">
                    <motion.div
                      className="genre-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / max) * 100}%` }}
                      transition={{ delay: i * 0.07 + 0.2, duration: 0.6 }}
                    />
                  </div>
                  <span className="genre-count">{count}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {recentMoods.length === 0 && topGenres.length === 0 && (
        <div className="memory-empty">
          <Brain size={32} className="empty-icon" />
          <p>VN is learning your taste.</p>
          <p className="empty-sub">Start chatting to build your profile.</p>
        </div>
      )}
    </div>
  );
}
