// ============================================
// Media Detection — Simulates OS-level player detection
// ============================================

const KNOWN_PLAYERS = [
  { name: 'Spotify', exe: 'spotify.exe', icon: '🎧', color: '#1DB954', type: 'desktop' },
  { name: 'VLC', exe: 'vlc.exe', icon: '🎬', color: '#FF7800', type: 'desktop' },
  { name: 'YouTube Music', exe: 'chrome.exe', icon: '▶️', color: '#FF0000', type: 'browser', url: 'music.youtube.com' },
  { name: 'Apple Music', exe: 'applemusic.exe', icon: '🍎', color: '#FC3C44', type: 'desktop' },
  { name: 'Windows Media Player', exe: 'wmplayer.exe', icon: '💿', color: '#0078D4', type: 'desktop' },
  { name: 'Meld', exe: 'meld.exe', icon: '🎵', color: '#6366f1', type: 'desktop' },
  { name: 'foobar2000', exe: 'foobar2000.exe', icon: '🎼', color: '#818cf8', type: 'desktop' },
  { name: 'Winamp', exe: 'winamp.exe', icon: '🔊', color: '#00c800', type: 'desktop' },
  { name: 'Browser Music', exe: 'firefox.exe', icon: '🌐', color: '#4285F4', type: 'browser' },
];

class MediaDetectionService {
  constructor() {
    this.detectedPlayer = null;
    this.listeners = [];
    this._scanInterval = null;
    this._isRunning = false;

    // Listen to real Electron events if available
    if (window.electronAPI) {
      window.electronAPI.onPlayerDetected((playerData) => {
        const fullPlayer = KNOWN_PLAYERS.find(p => p.name === playerData.name) || playerData;
        if (this.detectedPlayer?.name !== fullPlayer.name) {
          this.detectedPlayer = fullPlayer;
          this._notify(fullPlayer);
        }
      });
    }
  }

  start() {
    if (this._isRunning) return;
    this._isRunning = true;
    
    // Fallback timer for browser demo
    if (!window.electronAPI) {
      this._scanInterval = setInterval(() => this._scan(), 3000);
      this._scan(); // immediate first scan
    }
  }

  stop() {
    this._isRunning = false;
    if (this._scanInterval) {
      clearInterval(this._scanInterval);
      this._scanInterval = null;
    }
  }

  _scan() {
    // Simulate detecting a player based on simulated "active window"
    // In production, this would call Electron's shell.openExternal or
    // a Python bridge via WebSocket to check running processes.
    const mockDetected = this._simulateDetection();
    if (mockDetected?.name !== this.detectedPlayer?.name) {
      this.detectedPlayer = mockDetected;
      this._notify(mockDetected);
    }
  }

  _simulateDetection() {
    // Simulate: player appears after 2s on first load
    return null; // real detection is event-driven from UI
  }

  onPlayerDetected(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  _notify(player) {
    this.listeners.forEach(cb => cb(player));
  }

  // Manual trigger for demo/testing
  simulatePlayerOpen(playerName) {
    const player = KNOWN_PLAYERS.find(p =>
      p.name.toLowerCase().includes(playerName.toLowerCase())
    ) || KNOWN_PLAYERS[0];
    this.detectedPlayer = player;
    this._notify(player);
    return player;
  }

  getAllKnownPlayers() {
    return KNOWN_PLAYERS;
  }

  getCurrentPlayer() {
    return this.detectedPlayer;
  }
}

export const mediaDetection = new MediaDetectionService();
export { KNOWN_PLAYERS };
