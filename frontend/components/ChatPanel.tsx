'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Shield, Award, Github, Moon, Sun, Menu, X, Terminal, Zap, Bot, User, Loader2, MessageSquare, ArrowRight, Linkedin, Mail, ExternalLink, Star, Code2, GitBranch, Server, Cloud, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  references?: string[];
}

interface ChatPanelProps {
  onHighlightProject?: (projectId: string) => void;
}

const suggestedQuestions = [
  "What's their strongest backend project?",
  "Summarize their security experience",
  "What makes them a good fit for GSoC?",
  "Explain their networking skills",
];


export const ChatPanel = ({ onHighlightProject }) => {
  const [messages, setMessages] = useState([{ id: '1', role: 'agent', content: "Hi! I'm an AI assistant that knows everything about this candidate. Ask me anything about their skills, projects, or experience. I can tailor my responses based on whether you're a recruiter, mentor, or peer!", timestamp: new Date() }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        { content: "Based on their GitHub profile and project history, they have strong experience in backend development with Node.js, Express, and PostgreSQL. Their 'Distributed Task Scheduler' project demonstrates proficiency in API design and workflow automation.", references: ['task-scheduler'] },
        { content: "They've shown consistent growth in security through CTF participation and practical projects. Their networking fundamentals are solid, with hands-on experience in socket programming and protocol implementation.", references: ['security-labs'] },
        { content: "For a GSoC role, their open-source contributions and ability to work with complex codebases would be valuable. They've demonstrated the ability to learn quickly and integrate multiple technologies effectively.", references: ['open-source'] }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const agentMessage = { id: (Date.now() + 1).toString(), role: 'agent', content: randomResponse.content, timestamp: new Date(), references: randomResponse.references };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full backdrop-blur-md bg-card rounded-2xl overflow-hidden shadow-soft border border-border">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-inverted" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-card" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Resume Agent</h3>
          <p className="text-xs text-muted-foreground">Ask anything</p>
        </div>
        <Sparkles className="w-4 h-4 text-primary ml-auto animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-gradient-primary' : 'bg-muted'}`}>
                {message.role === 'user' ? <User className="w-4 h-4 text-inverted" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              <div className={`max-w-[80%] ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'} px-4 py-3`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.references && message.references.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border opacity-70">
                    <p className="text-xs">Referenced: {message.references.join(', ')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="chat-bubble-agent px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button key={index} onClick={() => handleSuggestion(question)} className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <div className="flex gap-3">
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about skills, projects, experience..." className="flex-1 px-4 py-3 rounded-lg border border-border outline-none transition-all text-sm text-foreground" disabled={isTyping} />
          <button onClick={handleSend} disabled={!input.trim() || isTyping} className="px-6 py-3 rounded-lg bg-primary text-inverted hover:shadow-glow transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

