

'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Shield, Award, Github, Moon, Sun, Menu, Terminal, Bot, User, Loader2, MessageSquare, ArrowRight, Linkedin, Mail, ExternalLink, Star, Code2, GitBranch, Server, Cloud, Database, X, Zap, Users, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import {ChatPanel} from '@/components/ChatPanel';
import {Header} from '@/components/Header';
import {HeroSection} from '@/components/HeroSection';
import {ProjectCard} from '@/components/ProjectCard';
import {SkillsSection} from '@/components/SkillsSelector';

const projects = [
  {
    id: 'resume-agent',
    title: 'AI Resume Agent',
    description: 'An interactive, AI-powered resume and portfolio agent that lets interviewers chat with candidate profiles instead of reading static CVs.',
    technologies: ['TypeScript', 'Node.js', 'Express', 'OpenRouter', 'Kestra'],
    github: 'https://github.com',
    demo: 'https://demo.com',
    stars: 42,
    category: 'AI / Full Stack',
  },
  {
    id: 'security-labs',
    title: 'Security Labs Platform',
    description: 'A comprehensive platform for practicing cybersecurity skills through hands-on labs and CTF-style challenges.',
    technologies: ['Python', 'Docker', 'PostgreSQL', 'Linux'],
    github: 'https://github.com',
    stars: 28,
    category: 'Security',
  },
  {
    id: 'network-analyzer',
    title: 'Network Protocol Analyzer',
    description: 'Real-time network traffic analysis tool for educational purposes, helping understand TCP/IP and common protocols.',
    technologies: ['C', 'libpcap', 'Linux', 'Socket Programming'],
    github: 'https://github.com',
    category: 'Networking',
  },
  {
    id: 'open-source',
    title: 'Open Source Contributions',
    description: 'Various contributions to popular open-source projects including bug fixes, documentation, and feature implementations.',
    technologies: ['JavaScript', 'Python', 'Go', 'Documentation'],
    github: 'https://github.com',
    category: 'Open Source',
  },
];

const features = [
  {
    icon: MessageSquare,
    title: 'Chat Interface',
    description: 'Natural conversation with AI that knows every detail of the candidate\'s profile.',
  },
  {
    icon: Target,
    title: 'Role-Based Summaries',
    description: 'Get tailored insights whether you\'re hiring for backend, security, or open source roles.',
  },
  {
    icon: Zap,
    title: 'Instant Answers',
    description: 'No more scanning through pages. Get precise answers in seconds.',
  },
  {
    icon: Users,
    title: 'Multi-Perspective',
    description: 'Designed for recruiters, mentors, and peers with appropriate depth levels.',
  },
];






const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState('backend-engineer');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [highlightedProject, setHighlightedProject] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleHighlightProject = (projectId) => {
    setHighlightedProject(projectId);
    setTimeout(() => setHighlightedProject(null), 3000);
  };

  const Target = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );

  const Users = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* <style>{styles}</style> */}

      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <HeroSection selectedRole={selectedRole} onSelectRole={setSelectedRole} onOpenChat={() => setIsChatOpen(true)} />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Chat With a Resume?
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Save time and get better insights with an AI that understands the candidate's full profile.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, title: 'Chat Interface', description: 'Natural conversation with AI that knows every detail of the candidate\'s profile.' },
              { icon: Target, title: 'Role-Based Summaries', description: 'Get tailored insights whether you\'re hiring for backend, security, or open source roles.' },
              { icon: Zap, title: 'Instant Answers', description: 'No more scanning through pages. Get precise answers in seconds.' },
              { icon: Users, title: 'Multi-Perspective', description: 'Designed for recruiters, mentors, and peers with appropriate depth levels.' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-xl text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-inverted" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-medium text-primary uppercase tracking-wider">
              Portfolio
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Featured Projects
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of projects showcasing backend development, security, and systems programming skills.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} isHighlighted={highlightedProject === project.id} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-medium text-primary uppercase tracking-wider">
              Expertise
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Technical Skills
            </motion.h2>
          </div>

          <SkillsSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass p-8 sm:p-12 rounded-2xl border border-border">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to Learn More?</h2>
            <p className="text-lg text-muted-foreground mb-8">Start a conversation with the AI agent to get personalized insights about this candidate.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsChatOpen(true)} className="px-8 py-4 text-lg rounded-lg bg-gradient-primary text-inverted hover:shadow-glow transition-all font-medium">
              Open Chat Agent
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">Built for AI Agents Assemble Hackathon by WeMakeDevs</p>
          <p className="text-xs text-muted-foreground mt-2">Powered by Cline • Kestra • Vercel • Oumi • CodeRabbit • Together AI</p>
        </div>
      </footer>

      {/* Chat FAB */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-primary text-inverted shadow-glow flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat Panel Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="relative w-full max-w-md h-[80vh] sm:h-[600px] pointer-events-auto"
              >
                <button onClick={() => setIsChatOpen(false)} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10">
                  <X className="w-5 h-5" />
                </button>
                <ChatPanel onHighlightProject={handleHighlightProject} />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

// const Index = () => {
//   const [selectedRole, setSelectedRole] = useState('backend-engineer');
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [highlightedProject, setHighlightedProject] = useState<string | null>(null);

//   const handleHighlightProject = (projectId: string) => {
//     setHighlightedProject(projectId);
//     setTimeout(() => setHighlightedProject(null), 3000);
//   };

//   return (
//     <div className="min-h-screen bg-[hsl(var(--background))]">
//       <Header />

//       {/* Hero Section */}
//       <HeroSection
//         selectedRole={selectedRole}
//         onSelectRole={setSelectedRole}
//         onOpenChat={() => setIsChatOpen(true)}
//       />

//       {/* Features Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] mb-4">
//               Why Chat With a Resume?
//             </h2>
//             <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
//               Save time and get better insights with an AI that understands the candidate's full profile.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature, index) => (
//               <div
//                 key={feature.title}
//                 className="glass p-6 rounded-xl text-center animate-slide-up"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
//                   <feature.icon className="w-6 h-6 text-[hsl(var(--primary-foreground))]" />
//                 </div>
//                 <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">{feature.title}</h3>
//                 <p className="text-sm text-[hsl(var(--muted-foreground))]">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--muted)/0.3)]">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <span className="text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wider">
//               Portfolio
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] mt-2 mb-4">
//               Featured Projects
//             </h2>
//             <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
//               A collection of projects showcasing backend development, security, and systems programming skills.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {projects.map((project, index) => (
//               <div
//                 key={project.id}
//                 className="animate-slide-up"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <ProjectCard
//                   project={project}
//                   isHighlighted={highlightedProject === project.id}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <span className="text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wider">
//               Expertise
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] mt-2 mb-4">
//               Technical Skills
//             </h2>
//           </div>

//           <SkillsSection />
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="border-gradient p-8 sm:p-12 rounded-2xl">
//             <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))] mb-4">
//               Ready to Learn More?
//             </h2>
//             <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
//               Start a conversation with the AI agent to get personalized insights about this candidate.
//             </p>
//             <button
//               onClick={() => setIsChatOpen(true)}
//               className="btn-primary text-lg px-8 py-4"
//             >
//               Open Chat Agent
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 px-4 border-t border-[hsl(var(--border))]">
//         <div className="max-w-6xl mx-auto text-center">
//           <p className="text-sm text-[hsl(var(--muted-foreground))]">
//             Built for AI Agents Assemble Hackathon by WeMakeDevs
//           </p>
//           <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
//             Powered by Cline • Kestra • Vercel • Oumi • CodeRabbit • Together AI
//           </p>
//         </div>
//       </footer>

//       {/* Chat FAB */}
//       {!isChatOpen && (
//         <button
//           onClick={() => setIsChatOpen(true)}
//           className="fixed bottom-6 right-6 z-40 btn-icon w-14 h-14 shadow-glow animate-pulse-glow"
//         >
//           <MessageSquare className="w-6 h-6" />
//         </button>
//       )}

//       {/* Chat Panel Overlay */}
//       {isChatOpen && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6">
//           {/* Backdrop */}
//           <div
//             className="absolute inset-0 bg-[hsl(var(--foreground)/0.2)] backdrop-blur-sm"
//             onClick={() => setIsChatOpen(false)}
//           />

//           {/* Chat Panel */}
//           <div className="relative w-full max-w-md h-[80vh] sm:h-[600px] animate-slide-up">
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-[hsl(var(--card))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors z-10"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <ChatPanel onHighlightProject={handleHighlightProject} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Index;
