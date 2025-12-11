

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Shield, Award, Github, Moon, Sun, Menu, X, Terminal, Zap, Bot, User, Loader2, MessageSquare, ArrowRight, Linkedin, Mail, ExternalLink, Star, Code2, GitBranch, Server, Cloud, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const skillCategories = [
  {
    title: 'Backend Development',
    icon: Server,
    skills: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'TypeScript'],
    color: 'primary',
  },
  {
    title: 'Systems & Networking',
    icon: Terminal,
    skills: ['Linux', 'Socket Programming', 'TCP/IP', 'Shell Scripting'],
    color: 'secondary',
  },
  {
    title: 'Security',
    icon: Shield,
    skills: ['CTF', 'Penetration Testing', 'Cryptography', 'Network Security'],
    color: 'destructive',
  },
  {
    title: 'DevOps & Tools',
    icon: Cloud,
    skills: ['Docker', 'Git', 'CI/CD', 'Kestra', 'Vercel'],
    color: 'accent',
  },
];


export const SkillsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {skillCategories.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="glass p-5 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg bg-${category.color}/10 flex items-center justify-center`}>
              <category.icon className={`w-5 h-5 text-${category.color}`} />
            </div>
            <h3 className="font-semibold text-foreground">{category.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

