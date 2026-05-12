import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { detectMoodFromText } from '../mood-engine/moodEngine';
import './ChatPanel.css';

const INITIAL_MESSAGES = [
  {
    id: 'aria-0',
    from: 'aria',
    text: "Hey. I'm ARIA — your AI music companion.",
    timestamp: Date.now() - 3000,
  },
  {
    id: 'aria-1',
    from: 'aria',
    text: "What are we feeling today?",
    timestamp: Date.now() - 1500,
  },
];

const SUGGESTIONS = [
  'chill 🌊', 'gym ⚡', 'focus 🧠', 'heartbreak 💔',
  'night drive 🌃', 'nostalgic 🌅', 'happy ☀️', 'Telugu mass 🔥'
];

export default function ChatPanel({ onMoodDetected, currentMood, moodData, ariaResponse }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When ariaResponse changes, show it as a message
  // ariaResponse is { text: string, id: number } from App.jsx
  useEffect(() => {
    if (!ariaResponse) return;
    const responseText = typeof ariaResponse === 'object' ? ariaResponse.text : ariaResponse;
    if (!responseText) return;
    const msg = {
      id: `aria-${ariaResponse.id || Date.now()}`,
      from: 'aria',
      text: responseText,
      timestamp: Date.now(),
    };
    setIsTyping(false);
    setMessages(prev => [...prev, msg]);
  }, [ariaResponse?.id, ariaResponse]);

  const handleSend = (text) => {
    const val = (text || input).trim();
    if (!val) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: val,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Detect mood
    const detected = detectMoodFromText(val);
    setTimeout(() => {
      onMoodDetected(detected, val);
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-panel">
      {/* Messages */}
      <div className="chat-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`chat-bubble-row ${msg.from}`}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {msg.from === 'aria' && (
                <div className="aria-avatar" style={{ background: moodData?.color || '#a855f7' }}>
                  A
                </div>
              )}
              <div className="chat-bubble-wrap">
                <div className={`chat-bubble ${msg.from}`}
                  style={msg.from === 'aria' ? {
                    borderColor: moodData ? `${moodData.color}40` : 'var(--glass-border)',
                  } : {}}
                >
                  {msg.text}
                </div>
                <span className="chat-time">{formatTime(msg.timestamp)}</span>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              key="typing"
              className="chat-bubble-row aria"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="aria-avatar" style={{ background: moodData?.color || '#a855f7' }}>A</div>
              <div className="chat-bubble aria typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div className="chat-suggestions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="suggestion-pill"
            onClick={() => handleSend(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="input chat-input"
          placeholder="Tell me your mood..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          id="chat-input"
        />
        <motion.button
          className="send-btn"
          style={{ background: moodData?.color || '#a855f7' }}
          onClick={() => handleSend()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          id="send-btn"
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}
