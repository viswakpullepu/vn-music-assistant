import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KNOWN_PLAYERS } from '../media-detection/mediaDetection';
import { getAllAdapters } from '../player-adapters/playerAdapters';
import './PlayerDetector.css';

export default function PlayerDetector({ activePlayer, onSelectPlayer, onDismiss }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="detector-panel">
      <div className="detector-header">
        <div className="detector-status">
          <motion.div
            className="status-dot"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>Scanning for music apps…</span>
        </div>
        <p className="detector-sub">Select the player you want VN to control</p>
      </div>

      <div className="player-grid">
        {KNOWN_PLAYERS.map((player) => (
          <motion.button
            key={player.name}
            className={`player-card ${activePlayer?.name === player.name ? 'active' : ''}`}
            style={activePlayer?.name === player.name ? {
              borderColor: `${player.color}80`,
              boxShadow: `0 0 20px ${player.color}30`,
            } : {}}
            onMouseEnter={() => setHovered(player.name)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectPlayer(player)}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            id={`player-${player.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="player-icon">{player.icon}</span>
            <span className="player-name">{player.name}</span>
            <span
              className="player-type-badge"
              style={{ color: player.color, borderColor: `${player.color}40`, background: `${player.color}10` }}
            >
              {player.type}
            </span>

            {activePlayer?.name === player.name && (
              <motion.div
                className="active-indicator"
                style={{ background: player.color }}
                layoutId="active-player"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="detector-footer">
        <p className="detector-note">
          💡 In the full desktop app, players are detected automatically from running processes.
        </p>
      </div>
    </div>
  );
}
