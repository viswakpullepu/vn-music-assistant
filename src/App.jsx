import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Radio, Brain, Settings, ChevronDown, Zap, X, Minimize2
} from 'lucide-react';

import OrbAssistant from './components/OrbAssistant';
import ChatPanel from './components/ChatPanel';
import PlayerController from './components/PlayerController';
import PlayerDetector from './components/PlayerDetector';
import MoodSelector from './components/MoodSelector';
import MemoryPanel from './components/MemoryPanel';

import { MOODS, getAIResponse } from './mood-engine/moodEngine';
import { getAdapterForPlayer, UniversalMusicController } from './player-adapters/playerAdapters';
import { mediaDetection, KNOWN_PLAYERS } from './media-detection/mediaDetection';
import {
  loadMemory, saveMemory, recordMood, recordSkip,
  recordLike, boostGenre, getSuggestedMood
} from './memory/memorySystem';

import './App.css';

const TABS = [
  { id: 'chat', label: 'ARIA', icon: <Cpu size={14} /> },
  { id: 'player', label: 'Player', icon: <Radio size={14} /> },
  { id: 'moods', label: 'Moods', icon: <Zap size={14} /> },
  { id: 'memory', label: 'Memory', icon: <Brain size={14} /> },
  { id: 'detect', label: 'Detect', icon: <Settings size={14} /> },
];

const controller = new UniversalMusicController();

export default function App() {
  const [tab, setTab] = useState('chat');
  const [mood, setMood] = useState(null);
  const [moodData, setMoodData] = useState(null);
  const [ariaResponse, setAriaResponse] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activePlayer, setActivePlayer] = useState(null);
  const [memory, setMemory] = useState(loadMemory);
  const [songs, setSongs] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [bgPalette, setBgPalette] = useState(['#d4af37', '#ffffff', '#b5952f']);
  const [sessionCount, setSessionCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [defaultPlayer, setDefaultPlayer] = useState(localStorage.getItem('vn_default_player') || null);
  const responseRef = useRef(null);

  // Resize Electron Window based on chat state
  useEffect(() => {
    if (window.electronAPI?.resizeWindow) {
      if (chatOpen) {
        window.electronAPI.resizeWindow(350, 600);
      } else {
        window.electronAPI.resizeWindow(150, 150);
      }
    }
  }, [chatOpen]);

  // Init
  useEffect(() => {
    mediaDetection.start();
    const unsub = mediaDetection.onPlayerDetected(handlePlayerDetected);

    // Update session count
    const updatedMem = { ...memory, totalSessions: (memory.totalSessions || 0) + 1 };
    setMemory(updatedMem);
    saveMemory(updatedMem);

    // Suggest mood from memory
    const suggested = getSuggestedMood(memory);
    if (suggested && !mood) {
      setTimeout(() => {
        speakAriaResponse(`Welcome back. Based on your history, you might be feeling ${MOODS[suggested]?.label || suggested} right now. Want me to set that up?`);
      }, 2500);
    }

    return () => {
      unsub();
      mediaDetection.stop();
      controller.destroy();
    };
  }, []);

  const handlePlayerDetected = useCallback((player) => {
    if (!player) return;
    setActivePlayer(player);
    const adapter = getAdapterForPlayer(player.name);
    controller.setAdapter(adapter);
    speakAriaResponse(`${player.name} detected. I'm ready. What are we feeling?`);
    setTab('chat');
  }, []);

  const speakAriaResponse = (text) => {
    setIsSpeaking(true);
    setAriaResponse({ text, id: Date.now() });
    setTimeout(() => setIsSpeaking(false), 2500);
  };

  const handleMoodDetected = useCallback((detectedMood, rawText) => {
    const resolvedMood = detectedMood || 'chill';
    const data = MOODS[resolvedMood];
    if (!data) return;

    setMood(resolvedMood);
    setMoodData(data);
    setSongs(data.songs || []);
    setBgPalette(data.palette || ['#d4af37', '#ffffff', '#b5952f']);

    // Update memory
    let updatedMem = recordMood(memory, resolvedMood);
    data.genres?.forEach(g => { updatedMem = boostGenre(updatedMem, g); });
    setMemory(updatedMem);

    // AI response
    let resp = getAIResponse(resolvedMood, data, memory);
    const playerName = controller.adapter?.name || 'your player';
    resp += ` Tap the play button to open ${playerName}.`;

    setTimeout(() => {
      speakAriaResponse(resp);
      
      if (window.electronAPI) {
        // Auto-hide chat after responding
        setTimeout(() => setChatOpen(false), 3000);
      } else {
        setTab('player');
      }
    }, 900);
  }, [memory]);

  const handleMoodSelect = useCallback((moodKey) => {
    handleMoodDetected(moodKey, moodKey);
  }, [handleMoodDetected]);

  const handleSelectPlayer = (player) => {
    mediaDetection.simulatePlayerOpen(player.name);
  };

  const handleSkip = useCallback((song) => {
    if (!song) return;
    const updated = recordSkip(memory, song);
    setMemory(updated);
  }, [memory]);

  const handleLike = useCallback((song) => {
    if (!song) return;
    const updated = recordLike(memory, song);
    setMemory(updated);
  }, [memory]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    if (!window.electronAPI) {
      if (!defaultPlayer) {
        setTimeout(() => setShowPlayerSelection(true), 400);
      } else {
        const p = KNOWN_PLAYERS.find(x => x.name === defaultPlayer);
        if (p) setTimeout(() => handlePlayerDetected(p), 400);
      }
    }
  };

  const accentColor = moodData?.color || '#a855f7';
  const glowColor = moodData?.glow || 'rgba(168,85,247,0.2)';

  if (window.electronAPI) {
    return (
      <div className={`widget-mode ${chatOpen ? 'expanded' : ''}`}>
        <motion.div 
          className="widget-orb-container"
          onClick={() => setChatOpen(!chatOpen)}
          whileHover={{ scale: 1.05 }}
        >
          <OrbAssistant
            mood={mood}
            moodData={moodData}
            isSpeaking={isSpeaking}
            isListening={isListening}
          />
        </motion.div>
        
        <AnimatePresence>
          {chatOpen && (
            <motion.div 
              className="widget-chat-container"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 430, y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ChatPanel
                onMoodDetected={handleMoodDetected}
                currentMood={mood}
                moodData={moodData}
                ariaResponse={ariaResponse}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Global Close Button */}
      {!showWelcome && !showPlayerSelection && (
        <motion.button
          className="global-close-btn"
          onClick={() => {
            if (window.electronAPI) {
              window.electronAPI.hideWindow();
            } else {
              setShowWelcome(true);
            }
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      )}

      {/* Animated background */}
      <div className="bg-layer">
        <div className="bg-gradient"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 20% 30%, ${bgPalette[0]}18 0%, transparent 60%),
                         radial-gradient(ellipse 60% 50% at 80% 70%, ${bgPalette[1]}12 0%, transparent 55%),
                         radial-gradient(ellipse 50% 40% at 50% 50%, ${bgPalette[2]}08 0%, transparent 70%)`
          }}
        />
        <div className="bg-noise" />
        <div className="scanline" />
      </div>

      {/* Welcome splash */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="welcome-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <motion.div
              className="welcome-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <motion.div
                className="welcome-orb"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <h1 className="welcome-title">
                <span className="gradient-text">VN</span>
              </h1>
              <p className="welcome-sub">Universal AI Music Companion</p>
              <p className="welcome-desc">
                I detect your music player and curate<br />the perfect soundtrack for your mood.
              </p>
              <motion.button
                className="btn btn-primary welcome-btn"
                onClick={dismissWelcome}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                id="welcome-start-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Begin Session
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Selection Overlay (Mobile / Web) */}
      <AnimatePresence>
        {showPlayerSelection && (
          <motion.div
            className="welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 900 }}
          >
            <motion.div className="welcome-content" initial={{ y: 20 }} animate={{ y: 0 }}>
              <h2 className="welcome-title" style={{ fontSize: '32px' }}>Select Player</h2>
              <p className="welcome-desc">Choose your default music app.</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px', maxWidth: '300px' }}>
                {KNOWN_PLAYERS.slice(0, 4).map(p => (
                  <motion.button 
                    key={p.name} 
                    className="btn btn-ghost"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      localStorage.setItem('vn_default_player', p.name);
                      setDefaultPlayer(p.name);
                      setShowPlayerSelection(false);
                      handlePlayerDetected(p);
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: `${p.color}40`, width: '130px' }}
                  >
                    {p.icon} {p.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="app-layout">
        {/* ===== LEFT SIDEBAR ===== */}
        <motion.aside
          className="left-sidebar glass"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Logo */}
          <div className="sidebar-logo">
            <motion.div
              className="logo-orb"
              style={{ background: accentColor, boxShadow: `0 0 20px ${glowColor}` }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <div>
              <span className="logo-text gradient-text">VN</span>
              <span className="logo-version">v1.0 MVP</span>
            </div>
          </div>

          {/* Active player badge */}
          <AnimatePresence>
            {activePlayer && (
              <motion.div
                className="active-player-badge"
                style={{ borderColor: `${activePlayer.color}50` }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="player-pulse"
                  style={{ background: activePlayer.color }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="player-badge-icon">{activePlayer.icon}</span>
                <div className="player-badge-info">
                  <span className="player-badge-name">{activePlayer.name}</span>
                  <span className="player-badge-status">Connected</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mood state */}
          <AnimatePresence mode="wait">
            {mood && moodData && (
              <motion.div
                key={mood}
                className="mood-state-card"
                style={{
                  borderColor: `${moodData.color}40`,
                  background: `${moodData.color}0a`,
                  boxShadow: `0 0 24px ${moodData.glow}`
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <span className="mood-state-emoji">{moodData.emoji}</span>
                <div>
                  <p className="mood-state-label" style={{ color: moodData.color }}>{moodData.label}</p>
                  <p className="mood-state-desc">{moodData.description}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orb */}
          <div className="orb-container">
            <OrbAssistant
              mood={mood}
              moodData={moodData}
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
          </div>

          {/* Genre tags */}
          <AnimatePresence>
            {moodData?.genres && (
              <motion.div
                className="genre-tags"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {moodData.genres.map((g, i) => (
                  <motion.span
                    key={g}
                    className="genre-tag"
                    style={{ borderColor: `${moodData.color}40`, color: moodData.color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {g}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* BPM info */}
          <AnimatePresence>
            {moodData?.bpm && (
              <motion.div
                className="bpm-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="bpm-label">BPM</span>
                <span className="bpm-value" style={{ color: moodData.color }}>{moodData.bpm}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom info */}
          <div className="sidebar-footer">
            <div className="session-info">
              <Cpu size={11} />
              <span>Session #{memory.totalSessions || 1}</span>
            </div>
            <div className="session-info">
              <div className="online-dot" />
              <span>AI Engine Online</span>
            </div>
          </div>
        </motion.aside>

        {/* ===== MAIN PANEL ===== */}
        <main className="main-panel">
          {/* Tab bar */}
          <motion.div
            className="tab-bar glass"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {TABS.map((t) => (
              <motion.button
                key={t.id}
                className={`tab-btn ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
                style={tab === t.id ? { color: accentColor, borderColor: `${accentColor}60` } : {}}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                id={`tab-${t.id}`}
              >
                {t.icon}
                <span>{t.label}</span>
                {tab === t.id && (
                  <motion.div
                    className="tab-indicator"
                    style={{ background: accentColor }}
                    layoutId="tab-indicator"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            className="panel-content glass"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                className="tab-pane"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {tab === 'chat' && (
                  <ChatPanel
                    onMoodDetected={handleMoodDetected}
                    currentMood={mood}
                    moodData={moodData}
                    ariaResponse={ariaResponse}
                  />
                )}
                {tab === 'player' && (
                  <PlayerController
                    controller={controller}
                    songs={songs}
                    moodData={moodData}
                    onSkip={handleSkip}
                    onLike={handleLike}
                  />
                )}
                {tab === 'moods' && (
                  <MoodSelector
                    currentMood={mood}
                    onMoodSelect={handleMoodSelect}
                  />
                )}
                {tab === 'memory' && (
                  <MemoryPanel memory={memory} />
                )}
                {tab === 'detect' && (
                  <PlayerDetector
                    activePlayer={activePlayer}
                    onSelectPlayer={handleSelectPlayer}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>

        {/* ===== RIGHT SIDEBAR — Visualizer ===== */}
        <motion.aside
          className="right-sidebar"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="visualizer-panel glass">
            <p className="viz-label">VISUALIZER</p>
            <div className="visualizer">
              {Array.from({ length: 28 }, (_, i) => (
                <motion.div
                  key={i}
                  className="viz-bar"
                  style={{ background: accentColor }}
                  animate={{
                    scaleY: mood
                      ? [0.1 + Math.random() * 0.4, 0.5 + Math.random() * 0.5, 0.2 + Math.random() * 0.3]
                      : [0.05, 0.12, 0.05],
                    opacity: mood ? [0.6, 1, 0.7] : [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: mood ? 0.4 + Math.random() * 0.6 : 1.5,
                    repeat: Infinity,
                    delay: i * 0.03,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ARIA status card */}
          <div className="aria-status-card glass">
            <div className="aria-status-header">
              <motion.div
                className="status-glow"
                style={{ background: accentColor }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="aria-status-title">ARIA Status</span>
            </div>
            <div className="status-rows">
              {[
                { label: 'Mood Engine', status: mood ? 'Active' : 'Standby', color: mood ? '#10b981' : '#fbbf24' },
                { label: 'Player Bridge', status: activePlayer ? 'Connected' : 'Scanning', color: activePlayer ? '#10b981' : '#f97316' },
                { label: 'Memory', status: 'Learning', color: '#a855f7' },
                { label: 'AI Engine', status: 'Online', color: '#00f5ff' },
              ].map((row) => (
                <div key={row.label} className="status-row">
                  <span className="status-row-label">{row.label}</span>
                  <span className="status-row-val" style={{ color: row.color }}>
                    <motion.span
                      className="status-dot-inline"
                      style={{ background: row.color }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick mood triggers */}
          <div className="quick-moods glass">
            <p className="quick-label">QUICK MOODS</p>
            {['chill 🌊', 'gym ⚡', 'focus 🧠', 'night drive 🌃'].map((m) => (
              <motion.button
                key={m}
                className="quick-mood-btn"
                onClick={() => {
                  const key = m.split(' ')[0];
                  handleMoodSelect(key === 'night' ? 'nightDrive' : key);
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.96 }}
                style={{ borderColor: 'var(--glass-border)' }}
              >
                {m}
              </motion.button>
            ))}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
