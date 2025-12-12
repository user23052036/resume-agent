'use client'

import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
}

const NavLink = ({ href, className, activeClassName, children }: NavLinkProps) => {
  return (
    <Link href={href} className={cn(className, activeClassName)}>
      {children}
    </Link>
  );
};

export { NavLink };
