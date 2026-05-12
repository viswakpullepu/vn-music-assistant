// ============================================
// Player Adapter System — Universal interface
// ============================================

// ---- Base Adapter Interface ----
class BasePlayerAdapter {
  constructor(name, icon, color) {
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.isConnected = false;
  }
  async connect() { this.isConnected = true; }
  async disconnect() { this.isConnected = false; }
  async play(context) { this._dispatch('play', context); }
  async pause() { this._dispatch('pause'); }
  async next() { this._dispatch('next'); }
  async prev() { this._dispatch('prev'); }
  async setVolume(vol) { this._dispatch('volume', vol); }
  async search(query) { return []; }
  async queue(song) { this._dispatch('queue', song); }
  _dispatch(action, data) {
    console.log(`[${this.name}] ${action}`, data ?? '');
  }
}

// ---- Spotify Adapter ----
class SpotifyAdapter extends BasePlayerAdapter {
  constructor() { super('Spotify', '🎧', '#1DB954'); }
  async play(context) { 
    super.play(context); 
    const query = encodeURIComponent(`${context || 'my'} playlist`.trim());
    window.open(`spotify:search:${query}`, '_self'); 
  }
  getDetectionKeys() { return ['spotify']; }
}

// ---- VLC Adapter ----
class VLCAdapter extends BasePlayerAdapter {
  constructor() { super('VLC', '🎬', '#FF7800'); }
  getDetectionKeys() { return ['vlc']; }
}

// ---- YouTube Music Adapter ----
class YouTubeMusicAdapter extends BasePlayerAdapter {
  constructor() { super('YouTube Music', '▶️', '#FF0000'); }
  async play(context) {
    super.play(context);
    const query = encodeURIComponent(`${context || 'my'} playlist`.trim());
    window.open(`https://music.youtube.com/search?q=${query}`, '_blank');
  }
  async search(query) {
    return `https://music.youtube.com/search?q=${encodeURIComponent(query)}`;
  }
  getDetectionKeys() { return ['music.youtube.com', 'youtube music']; }
}

// ---- Browser Generic Adapter ----
class BrowserAdapter extends BasePlayerAdapter {
  constructor() { super('Browser', '🌐', '#4285F4'); }
  getDetectionKeys() { return ['chrome', 'firefox', 'edge', 'opera', 'browser']; }
}

// ---- Apple Music Adapter ----
class AppleMusicAdapter extends BasePlayerAdapter {
  constructor() { super('Apple Music', '🍎', '#FC3C44'); }
  async play(context) {
    super.play(context);
    const query = encodeURIComponent(`${context || 'my'} playlist`.trim());
    window.open(`music://search?term=${query}`, '_self');
  }
  getDetectionKeys() { return ['apple music', 'music.apple.com']; }
}

// ---- Windows Media Player Adapter ----
class WindowsMediaAdapter extends BasePlayerAdapter {
  constructor() { super('Windows Media Player', '💿', '#0078D4'); }
  getDetectionKeys() { return ['windows media', 'wmplayer']; }
}

// ---- Generic / Local Player ----
class GenericAdapter extends BasePlayerAdapter {
  constructor() { super('Local Player', '🎵', '#818cf8'); }
  getDetectionKeys() { return ['foobar', 'winamp', 'aimp', 'musicbee', 'mp3', 'media']; }
}

// ---- Simulation Adapter (demo mode) ----
class SimulationAdapter extends BasePlayerAdapter {
  constructor() { super('Demo Mode', '🤖', '#a855f7'); }
  getDetectionKeys() { return ['demo', 'simulation']; }
}

// ---- Registry ----
const ADAPTERS = [
  new SpotifyAdapter(),
  new YouTubeMusicAdapter(),
  new AppleMusicAdapter(),
  new VLCAdapter(),
  new BrowserAdapter(),
  new WindowsMediaAdapter(),
  new GenericAdapter(),
  new SimulationAdapter(),
];

export function getAllAdapters() { return ADAPTERS; }

export function getAdapterForPlayer(playerName) {
  if (!playerName) return ADAPTERS[ADAPTERS.length - 1]; // simulation
  const lower = playerName.toLowerCase();
  for (const adapter of ADAPTERS) {
    if (adapter.getDetectionKeys?.().some(k => lower.includes(k))) {
      return adapter;
    }
  }
  return ADAPTERS[ADAPTERS.length - 1];
}

// ---- Universal Controller ----
export class UniversalMusicController {
  constructor() {
    this.adapter = null;
    this.playbackState = {
      isPlaying: false,
      volume: 75,
      currentSong: null,
      queue: [],
      elapsed: 0,
      duration: 0,
    };
    this._timer = null;
  }

  setAdapter(adapter) {
    this.adapter = adapter;
  }

  loadSongs(songs) {
    if (!songs || songs.length === 0) return;
    this.playbackState.queue = songs;
    this.playbackState.currentSong = songs[0];
    this.playbackState.elapsed = 0;
    this.playbackState.duration = this._parseDuration(songs[0].duration);
  }

  _parseDuration(str) {
    if (!str) return 180;
    const parts = str.split(':').map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  }

  play(context) {
    this.playbackState.isPlaying = true;
    this._startTimer();
    this.adapter?.play(context);
  }

  pause() {
    this.playbackState.isPlaying = false;
    this._stopTimer();
    this.adapter?.pause();
  }

  toggle(context) {
    if (this.playbackState.isPlaying) this.pause();
    else this.play(context);
  }

  next() {
    const q = this.playbackState.queue;
    const idx = q.indexOf(this.playbackState.currentSong);
    const next = q[(idx + 1) % q.length];
    this.playbackState.currentSong = next;
    this.playbackState.elapsed = 0;
    this.playbackState.duration = this._parseDuration(next?.duration);
    this.adapter?.next();
    return next;
  }

  prev() {
    const q = this.playbackState.queue;
    const idx = q.indexOf(this.playbackState.currentSong);
    const prev = q[(idx - 1 + q.length) % q.length];
    this.playbackState.currentSong = prev;
    this.playbackState.elapsed = 0;
    this.playbackState.duration = this._parseDuration(prev?.duration);
    this.adapter?.prev();
    return prev;
  }

  setVolume(vol) {
    this.playbackState.volume = vol;
    this.adapter?.setVolume(vol);
  }

  seek(seconds) {
    this.playbackState.elapsed = seconds;
  }

  _startTimer() {
    this._stopTimer();
    this._timer = setInterval(() => {
      if (this.playbackState.elapsed < this.playbackState.duration) {
        this.playbackState.elapsed += 1;
      } else {
        this.next();
      }
    }, 1000);
  }

  _stopTimer() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }

  getState() { return { ...this.playbackState }; }

  destroy() { this._stopTimer(); }
}
