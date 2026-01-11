'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Resume storage moved to backend - no longer needed in frontend

/**
 * Backend URL resolution
 * - Uses env in prod
 * - Falls back to localhost for dev
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type ChatPanelProps = {
  onHighlightProject?: (projectId: string) => void;
};

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export const ChatPanel = ({ onHighlightProject }: ChatPanelProps) => {
  // Chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'agent',
      content:
        'Hi! Upload a resume PDF first, then ask me anything about the candidate.',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // resumeId for backend lookup - resume text stored server-side
  const [resumeId, setResumeId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --------------------------------------------------
  // SEND CHAT MESSAGE
  // --------------------------------------------------
  const handleSend = async () => {
    if (!input.trim() || isTyping || !resumeId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const chatUrl = `${API_BASE}/api/agent/chat`;

      const res = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_id: resumeId,
          message: userMessage.content,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: data.response ?? data.error ?? 'No response generated.',
          timestamp: new Date(),
        },
      ]);

      if (data.projectId) {
        onHighlightProject?.(data.projectId);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: '❌ Failed to reach agent.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // --------------------------------------------------
  // PDF RESUME UPLOAD
  // --------------------------------------------------
  const handlePDFUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Only PDF resumes are supported.');
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: `📄 Uploaded resume: ${file.name}`,
        timestamp: new Date(),
      },
    ]);

    setIsTyping(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const analyzeUrl = `${API_BASE}/api/resume/analyze`;

      const res = await fetch(analyzeUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Upload failed:', data);
        throw new Error('Upload failed');
      }

      /**
       * Store resumeId for backend lookup
       * Resume text is now stored server-side
       */
      setResumeId(data.resume_id);

      setMessages((prev) => {
        const updated = [...prev];
        if (updated[0]?.id === 'init') {
          updated[0] = {
            ...updated[0],
            content: 'Resume uploaded. Ask anything about the candidate.',
          };
        }

        return [
          ...updated,
          {
            id: Date.now().toString(),
            role: 'agent',
            content: data.summary || 'Resume uploaded successfully.',
            timestamp: new Date(),
          },
        ];
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: '⚠️ Resume upload failed.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="flex flex-col h-full rounded-xl border bg-card">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg: Message) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-muted'
                }`}
              >
                {msg.role === 'agent' ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-center gap-2 text-sm opacity-70">
            <Loader2 className="w-4 h-4 animate-spin" />
            Agent is thinking…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="file"
          accept="application/pdf"
          hidden
          ref={fileInputRef}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handlePDFUpload(file);
          }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg border"
          title="Upload PDF resume"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about skills, projects, experience..."
          className="flex-1 px-3 py-2 border rounded-lg"
          disabled={isTyping}
        />

        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim() || !resumeId}
          className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
