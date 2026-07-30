import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

const STORAGE_KEY = 'devixa-chat-messages';
const STATE_KEY = 'devixa-chat-open';
const DEFAULT_MSG = [{ role: 'bot', text: 'Hey! I\'m Devixa AI. How can I help you today?' }];

const loadMessages = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_MSG;
};

const loadOpenState = () => {
  try {
    return sessionStorage.getItem(STATE_KEY) === 'true';
  } catch {}
  return false;
};

export default function SkateboardBot() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(loadOpenState);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(STATE_KEY, String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post('/ai/chat', { message: trimmed });
      setMessages(prev => [...prev, { role: 'bot', text: res.reply || 'Sorry, I couldn\'t process that.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const skateboardTrick = {
    animate: {
      y: [0, 0, -60, -60, 0, 0, 0],
      scaleY: [1, 0.85, 1, 1, 1, 0.7, 1],
      scaleX: [1, 1.1, 1, 1, 1, 1.2, 1],
      rotate: [0, 0, 0, 360, 360, 360, 360],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 3.5,
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 1],
        ease: ["easeInOut", "easeOut", "linear", "easeIn", "easeOut", "easeInOut"]
      }
    }
  };

  const idleState = {
    animate: {
      y: 0,
      scaleY: 1,
      scaleX: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 w-[380px] h-[500px] bg-background/95 backdrop-blur-2xl border border-border rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent" />
            
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">Devixa AI</p>
                  <p className="text-foreground/40 text-[11px]">Powered by Gemini & Groq</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#8B5CF6] text-white rounded-br-md' 
                      : 'bg-foreground/[0.04] text-foreground/80 border border-border rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-foreground/[0.04] border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="text-[#8B5CF6] animate-spin" />
                    <span className="text-foreground/40 text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 bg-foreground/[0.03] rounded-xl border border-border px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-foreground text-sm placeholder-foreground/30 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white disabled:opacity-30 hover:bg-[#7C3AED] transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
          initial={false}
          animate={isHovered ? idleState.animate : skateboardTrick.animate}
          className="relative w-14 h-14 rounded-full bg-[#8B5CF6] shadow-[0_8px_32px_0_rgba(139,92,246,0.4)] group"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M12 2L13.09 8.26L18 5L14.74 9.91L21 11L14.74 12.09L18 17L13.09 13.74L12 20L10.91 13.74L6 17L9.26 12.09L3 11L9.26 9.91L6 5L10.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.button>
      )}
    </div>
  );
}
