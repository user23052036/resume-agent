'use client'


import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Shield, Award, Github, Moon, Sun, Menu, X, Terminal, Zap, Bot, User, Loader2, MessageSquare, ArrowRight, Linkedin, Mail, ExternalLink, Star, Code2, GitBranch, Server, Cloud, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
