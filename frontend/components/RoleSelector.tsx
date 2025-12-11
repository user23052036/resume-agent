

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Shield, Award, Github, Moon, Sun, Menu, X, Terminal, Zap, Bot, User, Loader2, MessageSquare, ArrowRight, Linkedin, Mail, ExternalLink, Star, Code2, GitBranch, Server, Cloud, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoleSelectorProps {
  selectedRole: string;
  onSelectRole: (role: string) => void;
}

const roles = [
  {
    id: 'backend-engineer',
    label: 'Backend Engineer',
    icon: Code2,
    className: 'role-badge-backend',
  },
  {
    id: 'security-engineer',
    label: 'Security Engineer',
    icon: Shield,
    className: 'role-badge-security',
  },
  {
    id: 'open-source',
    label: 'Open Source / GSoC',
    icon: GitBranch,
    className: 'role-badge-opensource',
  },
];

export const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelectRole(role.id)}
          className={`role-badge ${role.className} ${selectedRole === role.id ? 'active' : ''} flex items-center gap-2`}
        >
          <role.icon className="w-4 h-4" />
          {role.label}
        </button>
      ))}
    </div>
  );
};
