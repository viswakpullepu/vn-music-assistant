// ============================================
// Mood Engine — Maps moods to music experiences
// ============================================

export const MOODS = {
  chill: {
    label: 'Chill',
    emoji: '🌊',
    color: '#00f5ff',
    glow: 'rgba(0, 245, 255, 0.3)',
    genres: ['lo-fi', 'ambient', 'chillhop', 'indie pop'],
    bpm: '60–90',
    energy: 0.3,
    description: 'Smooth and laid-back',
    palette: ['#00f5ff', '#0ea5e9', '#7c3aed'],
    songs: [
      { title: 'Midnight Rain', artist: 'Lo-Fi Collective', duration: '3:42' },
      { title: 'Ocean Breath', artist: 'Ambient Works', duration: '4:18' },
      { title: 'Coffee Shop', artist: 'ChillHop Music', duration: '3:55' },
      { title: 'Golden Hour', artist: 'JVKE', duration: '3:27' },
      { title: 'Snowfall', artist: 'Øneheart', duration: '4:01' },
    ],
  },
  gym: {
    label: 'Gym',
    emoji: '⚡',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.3)',
    genres: ['phonk', 'trap', 'hardstyle', 'metal'],
    bpm: '140–180',
    energy: 0.95,
    description: 'Pure hype energy',
    palette: ['#f97316', '#ef4444', '#fbbf24'],
    songs: [
      { title: 'ROUTINE', artist: 'Pharaoh Vice', duration: '2:58' },
      { title: 'GODS', artist: 'NewJeans', duration: '3:21' },
      { title: 'MONTAGEM AUTOMOTIVA', artist: 'MC GW', duration: '3:05' },
      { title: 'DEAF KILLA', artist: 'Stunna Gambino', duration: '2:47' },
      { title: 'Bzrp Session 52', artist: 'Bizarrap', duration: '3:12' },
    ],
  },
  focus: {
    label: 'Focus',
    emoji: '🧠',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.3)',
    genres: ['binaural beats', 'classical', 'post-rock', 'dark ambient'],
    bpm: '70–100',
    energy: 0.4,
    description: 'Deep concentration mode',
    palette: ['#a855f7', '#7c3aed', '#3b82f6'],
    songs: [
      { title: 'Neural Flow', artist: 'Brain.fm', duration: '30:00' },
      { title: 'Weightless', artist: 'Marconi Union', duration: '8:09' },
      { title: 'Comptine d\'un autre été', artist: 'Yann Tiersen', duration: '2:34' },
      { title: 'Deep Work', artist: 'Endel', duration: '60:00' },
      { title: 'Solitude', artist: 'Nils Frahm', duration: '5:44' },
    ],
  },
  heartbreak: {
    label: 'Heartbreak',
    emoji: '💔',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.3)',
    genres: ['sad pop', 'emo', 'indie folk', 'alternative R&B'],
    bpm: '50–80',
    energy: 0.2,
    description: 'Let it out. Feel it all.',
    palette: ['#ec4899', '#f43f5e', '#a855f7'],
    songs: [
      { title: 'Drivers License', artist: 'Olivia Rodrigo', duration: '4:02' },
      { title: 'The Night We Met', artist: 'Lord Huron', duration: '3:28' },
      { title: 'Liability', artist: 'Lorde', duration: '3:49' },
      { title: 'Skinny', artist: 'Billie Eilish', duration: '4:25' },
      { title: 'Sober', artist: 'Childish Gambino', duration: '4:19' },
    ],
  },
  nightDrive: {
    label: 'Night Drive',
    emoji: '🌃',
    color: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.3)',
    genres: ['synthwave', 'chillwave', 'retrowave', 'darksynth'],
    bpm: '100–125',
    energy: 0.6,
    description: 'Neon lights, open road',
    palette: ['#818cf8', '#a855f7', '#00f5ff'],
    songs: [
      { title: 'Midnight City', artist: 'M83', duration: '4:03' },
      { title: 'A Real Hero', artist: 'College & Electric Youth', duration: '5:02' },
      { title: 'Nightcall', artist: 'Kavinsky', duration: '4:17' },
      { title: 'Take My Breath', artist: 'The Weeknd', duration: '3:44' },
      { title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
    ],
  },
  nostalgic: {
    label: 'Nostalgic',
    emoji: '🌅',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.3)',
    genres: ['classic rock', '80s pop', '90s R&B', 'oldies'],
    bpm: '80–120',
    energy: 0.5,
    description: 'Back to the good times',
    palette: ['#fbbf24', '#f97316', '#f43f5e'],
    songs: [
      { title: 'Don\'t Stop Believin\'', artist: 'Journey', duration: '4:11' },
      { title: 'Africa', artist: 'Toto', duration: '4:55' },
      { title: 'Take On Me', artist: 'a-ha', duration: '3:48' },
      { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', duration: '5:03' },
      { title: 'With or Without You', artist: 'U2', duration: '4:56' },
    ],
  },
  happy: {
    label: 'Happy',
    emoji: '☀️',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.3)',
    genres: ['pop', 'indie pop', 'funk', 'disco'],
    bpm: '110–130',
    energy: 0.75,
    description: 'Good vibes only',
    palette: ['#10b981', '#34d399', '#fbbf24'],
    songs: [
      { title: 'Happy', artist: 'Pharrell Williams', duration: '3:53' },
      { title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', duration: '3:57' },
      { title: 'Good as Hell', artist: 'Lizzo', duration: '2:39' },
      { title: 'Shake It Off', artist: 'Taylor Swift', duration: '3:39' },
      { title: 'Uptown Funk', artist: 'Bruno Mars', duration: '4:30' },
    ],
  },
  romantic: {
    label: 'Romantic',
    emoji: '🌹',
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.3)',
    genres: ['R&B', 'soul', 'jazz', 'bossa nova'],
    bpm: '70–95',
    energy: 0.45,
    description: 'Soft, intimate, warm',
    palette: ['#f43f5e', '#ec4899', '#fbbf24'],
    songs: [
      { title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23' },
      { title: 'All of Me', artist: 'John Legend', duration: '4:29' },
      { title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: '4:41' },
      { title: 'At Last', artist: 'Etta James', duration: '3:01' },
      { title: 'La Vie en Rose', artist: 'Louis Armstrong', duration: '3:06' },
    ],
  },
  teluguMass: {
    label: 'Telugu Mass',
    emoji: '🔥',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.3)',
    genres: ['Telugu folk', 'mass beats', 'item songs', 'DJ remix'],
    bpm: '130–160',
    energy: 0.9,
    description: 'Mass ga pothundi!',
    palette: ['#ef4444', '#f97316', '#fbbf24'],
    songs: [
      { title: 'Naatu Naatu', artist: 'M.M. Keeravani', duration: '3:59' },
      { title: 'Oo Antava', artist: 'Thaman S', duration: '3:32' },
      { title: 'Kalaavathi', artist: 'Thaman S', duration: '4:12' },
      { title: 'Srivalli', artist: 'Devi Sri Prasad', duration: '4:44' },
      { title: 'Buttabomma', artist: 'Armaan Malik', duration: '4:18' },
    ],
  },
};

export const MOOD_QUICK_PICKS = [
  'chill', 'gym', 'focus', 'heartbreak', 'nightDrive',
  'nostalgic', 'happy', 'romantic', 'teluguMass'
];

export function detectMoodFromText(text) {
  const lower = text.toLowerCase();
  const map = {
    chill: ['chill', 'relax', 'calm', 'easy', 'low-key', 'mellow', 'cool', 'lofi', 'lo-fi', 'vibe'],
    gym: ['gym', 'workout', 'hype', 'pump', 'energy', 'beast', 'lift', 'run', 'exercise', 'intense', 'fire', 'aggressive', 'phonk'],
    focus: ['focus', 'study', 'work', 'concentrate', 'think', 'productive', 'deep', 'code'],
    heartbreak: ['sad', 'heartbreak', 'breakup', 'cry', 'hurt', 'broken', 'pain', 'miss', 'loss', 'depressed', 'lonely'],
    nightDrive: ['night', 'drive', 'synthwave', 'retro', 'city', 'neon', 'late night', 'cruising'],
    nostalgic: ['nostalgic', 'old', 'classic', 'throwback', '80s', '90s', 'memories', 'retro', 'vintage'],
    happy: ['happy', 'joy', 'good', 'fun', 'great', 'excited', 'cheerful', 'upbeat', 'smile', 'lit'],
    romantic: ['romantic', 'love', 'date', 'intimate', 'soft', 'warm', 'cozy', 'slow dance'],
    teluguMass: ['telugu', 'mass', 'naatu', 'desi', 'tollywood', 'mass song', 'item', 'folk'],
  };

  for (const [mood, keywords] of Object.entries(map)) {
    if (keywords.some(k => lower.includes(k))) return mood;
  }
  return null;
}

export function getAIResponse(mood, moodData, memory) {
  const hour = new Date().getHours();
  const isLateNight = hour >= 23 || hour < 4;
  const isEarlyMorning = hour >= 4 && hour < 8;
  const skipCount = memory.skippedSongs?.length || 0;

  const responses = {
    chill: [
      "Smooth. Dialing in the ambient flow.",
      "Going low-key. Let the sound carry you.",
      "Chill mode activated. World can wait.",
    ],
    gym: [
      "Let's GO. Phonk and hype incoming.",
      "Beast mode. Adjusting BPM to match your intensity.",
      "No excuses. Serving pure energy.",
    ],
    focus: [
      "Deep work mode. Binaural beats loading.",
      "Minimal. Clean. No distractions.",
      "Tuning out the world. Tuning into you.",
    ],
    heartbreak: [
      "I got you. Sometimes you need to feel it all.",
      "Soft and slow. Take your time.",
      isLateNight ? "Late nights hit different. I'm here." : "It's okay to not be okay.",
    ],
    nightDrive: [
      "Synthwave engaged. Where are we going?",
      isLateNight ? "Perfect timing. The city is yours." : "Night drive energy — even in daylight.",
      "Neon dreams loading.",
    ],
    nostalgic: [
      "Time machine online. Classic vibes incoming.",
      "Back to the good old days.",
      "Nostalgia hits different at " + (isLateNight ? "this hour." : "any hour."),
    ],
    happy: [
      "Yes. Let's keep this energy.",
      "Good vibes only. Turning it up.",
      isEarlyMorning ? "Morning energy? Love it." : "Sunshine mode. Let's go.",
    ],
    romantic: [
      "Setting the mood. Soft and warm.",
      "For the romantics. Taking it slow.",
      "Letting the music do the talking.",
    ],
    teluguMass: [
      "Naatu Naatu era unlocked! 🔥",
      "Mass mode ON. Tollywood takeover.",
      "Ee roju mass ga untadi!",
    ],
  };

  const pool = responses[mood] || ["Playing something special for you."];
  let base = pool[Math.floor(Math.random() * pool.length)];

  if (skipCount > 5) {
    base += ` (You've been picky today — I'm learning your taste.)`;
  }

  return base;
}
