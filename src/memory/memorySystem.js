// ============================================
// Memory System — Persistent user preferences
// ============================================

const STORAGE_KEY = 'aria_memory';

const defaultMemory = {
  totalSessions: 0,
  username: null,
  moodHistory: [],         // [{ mood, timestamp, hour }]
  genrePreferences: {},    // { genre: weight }
  skippedSongs: [],
  likedSongs: [],
  sessionPatterns: {       // hour → preferred mood
    morning: null,
    afternoon: null,
    evening: null,
    night: null,
    lateNight: null,
  },
  lastActivePlayer: null,
  lastMood: null,
  createdAt: null,
};

export function loadMemory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultMemory, createdAt: new Date().toISOString() };
    return { ...defaultMemory, ...JSON.parse(raw) };
  } catch {
    return { ...defaultMemory, createdAt: new Date().toISOString() };
  }
}

export function saveMemory(mem) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mem));
  } catch {}
}

export function recordMood(memory, mood) {
  const now = new Date();
  const hour = now.getHours();
  const entry = { mood, timestamp: now.toISOString(), hour };
  const updated = {
    ...memory,
    lastMood: mood,
    moodHistory: [entry, ...memory.moodHistory].slice(0, 100),
  };

  // Update session patterns
  const slot = getTimeSlot(hour);
  updated.sessionPatterns = { ...updated.sessionPatterns, [slot]: mood };

  saveMemory(updated);
  return updated;
}

export function recordSkip(memory, song) {
  const updated = {
    ...memory,
    skippedSongs: [song, ...memory.skippedSongs].slice(0, 50),
  };
  saveMemory(updated);
  return updated;
}

export function recordLike(memory, song) {
  const updated = {
    ...memory,
    likedSongs: [song, ...memory.likedSongs].slice(0, 100),
  };
  saveMemory(updated);
  return updated;
}

export function boostGenre(memory, genre) {
  const prefs = { ...memory.genrePreferences };
  prefs[genre] = (prefs[genre] || 0) + 1;
  const updated = { ...memory, genrePreferences: prefs };
  saveMemory(updated);
  return updated;
}

export function getTimeSlot(hour) {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  if (hour >= 21 && hour < 24) return 'night';
  return 'lateNight';
}

export function getSuggestedMood(memory) {
  const hour = new Date().getHours();
  const slot = getTimeSlot(hour);
  const pattern = memory.sessionPatterns[slot];
  if (pattern) return pattern;

  // Fall back to most frequent mood
  const freq = {};
  memory.moodHistory.forEach(m => { freq[m.mood] = (freq[m.mood] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
}
