'use client'


import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Shield, Award, Github, Moon, Sun, Menu, X, Terminal, Zap, Bot, User, Loader2, MessageSquare, ArrowRight, Linkedin, Mail, ExternalLink, Star, Code2, GitBranch, Server, Cloud, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  stars?: number;
  category: string;
}

interface ProjectCardProps {
  project: Project;
  isHighlighted?: boolean;
}



export const ProjectCard = ({ project, isHighlighted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`project-card group ${isHighlighted ? 'highlighted' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">{project.category}</span>
          <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{project.title}</h3>
        </div>
        {project.stars && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-4 h-4 fill-current text-yellow-500" />
            <span className="text-sm">{project.stars}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech) => (
          <span key={tech} className="skill-tag">{tech}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-border">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-4 h-4" />
            Code
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:text-primary transition-colors">
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        )}
      </div>

      {isHighlighted && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
      )}
    </motion.div>
  );
};
