import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Shuffle, Repeat, Music
} from 'lucide-react';
import './PlayerController.css';

export default function PlayerController({ controller, songs, moodData, onSkip, onLike }) {
  const [state, setState] = useState(controller?.getState?.() || {
    isPlaying: false, volume: 75, currentSong: null, elapsed: 0, duration: 180
  });
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volVisible, setVolVisible] = useState(false);
  const tickRef = useRef(null);

  // Sync state with controller
  useEffect(() => {
    if (!controller) return;
    const sync = () => setState({ ...controller.getState() });
    tickRef.current = setInterval(sync, 500);
    return () => clearInterval(tickRef.current);
  }, [controller]);

  // Load new songs when mood changes
  useEffect(() => {
    if (!controller || !songs?.length) return;
    controller.loadSongs(songs);
    // Removed controller.play() here because browsers block deep links without a direct user gesture
    setState({ ...controller.getState() });
    setLiked(false);
  }, [songs, moodData]);

  const accent = moodData?.color || '#a855f7';
  const glowShadow = `0 0 20px ${moodData?.glow || 'rgba(168,85,247,0.3)'}`;

  const handlePlayPause = () => {
    if (!controller) return;
    controller.toggle(moodData?.label);
    setState({ ...controller.getState() });
  };

  const handleNext = () => {
    if (!controller) return;
    const skipped = controller.getState().currentSong;
    const next = controller.next();
    setState({ ...controller.getState() });
    setLiked(false);
    onSkip?.(skipped);
  };

  const handlePrev = () => {
    if (!controller) return;
    controller.prev();
    setState({ ...controller.getState() });
    setLiked(false);
  };

  const handleVolume = (e) => {
    const vol = Number(e.target.value);
    if (!controller) return;
    controller.setVolume(vol);
    setState(s => ({ ...s, volume: vol }));
  };

  const handleSeek = (e) => {
    const secs = Number(e.target.value);
    if (!controller) return;
    controller.seek(secs);
    setState(s => ({ ...s, elapsed: secs }));
  };

  const handleLike = () => {
    setLiked(l => !l);
    onLike?.(state.currentSong);
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = state.duration > 0 ? (state.elapsed / state.duration) * 100 : 0;

  return (
    <div className="player-controller">
      {/* Song Info */}
      <div className="song-info">
        <motion.div
          className="album-art"
          style={{ background: `linear-gradient(135deg, ${accent}44, ${accent}22)`, boxShadow: glowShadow }}
          animate={{ rotate: state.isPlaying ? 360 : 0 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', pause: !state.isPlaying }}
        >
          <Music size={22} style={{ color: accent }} />
        </motion.div>
        <div className="song-meta">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentSong?.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <p className="song-title truncate">{state.currentSong?.title || 'No Track'}</p>
              <p className="song-artist truncate">{state.currentSong?.artist || '—'}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <motion.button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          id="like-btn"
          style={liked ? { color: '#f43f5e', filter: 'drop-shadow(0 0 6px #f43f5e)' } : {}}
        >
          <Heart size={16} fill={liked ? '#f43f5e' : 'none'} />
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <span className="time-label">{fmtTime(state.elapsed)}</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%`, background: accent }} />
          <input
            type="range"
            className="progress-range"
            min={0}
            max={state.duration || 180}
            value={state.elapsed}
            onChange={handleSeek}
            id="progress-range"
          />
        </div>
        <span className="time-label">{fmtTime(state.duration)}</span>
      </div>

      {/* Controls */}
      <div className="controls-row">
        <motion.button
          className={`ctrl-btn small ${shuffle ? 'active' : ''}`}
          onClick={() => setShuffle(s => !s)}
          whileTap={{ scale: 0.9 }}
          style={shuffle ? { color: accent } : {}}
          id="shuffle-btn"
        >
          <Shuffle size={14} />
        </motion.button>

        <motion.button
          className="ctrl-btn"
          onClick={handlePrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          id="prev-btn"
        >
          <SkipBack size={18} />
        </motion.button>

        <motion.button
          className="ctrl-btn play-btn"
          onClick={handlePlayPause}
          style={{ background: accent, boxShadow: glowShadow }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          id="play-pause-btn"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={state.isPlaying ? 'pause' : 'play'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              {state.isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <motion.button
          className="ctrl-btn"
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          id="next-btn"
        >
          <SkipForward size={18} />
        </motion.button>

        <motion.button
          className={`ctrl-btn small ${repeat ? 'active' : ''}`}
          onClick={() => setRepeat(r => !r)}
          whileTap={{ scale: 0.9 }}
          style={repeat ? { color: accent } : {}}
          id="repeat-btn"
        >
          <Repeat size={14} />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="volume-row">
        <button
          className="ctrl-btn small"
          onClick={() => setVolVisible(v => !v)}
          id="volume-toggle"
        >
          {state.volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <div className="volume-slider-wrap">
          <input
            type="range"
            min={0}
            max={100}
            value={state.volume}
            onChange={handleVolume}
            id="volume-range"
            style={{ '--accent': accent }}
          />
        </div>
        <span className="vol-label">{state.volume}%</span>
      </div>

      {/* Queue */}
      {songs?.length > 0 && (
        <div className="queue-list">
          <p className="queue-label">UP NEXT</p>
          {songs.slice(0, 4).map((s, i) => (
            <motion.div
              key={s.title}
              className={`queue-item ${state.currentSong?.title === s.title ? 'active' : ''}`}
              style={state.currentSong?.title === s.title ? { borderColor: `${accent}60` } : {}}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <span className="q-num" style={state.currentSong?.title === s.title ? { color: accent } : {}}>
                {state.currentSong?.title === s.title ? '▶' : i + 1}
              </span>
              <div className="q-info">
                <span className="q-title truncate">{s.title}</span>
                <span className="q-artist truncate">{s.artist}</span>
              </div>
              <span className="q-dur">{s.duration}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
