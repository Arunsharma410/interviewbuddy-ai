import { motion, type HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  glow?: 'blue' | 'emerald' | 'none';
  hover?: boolean;
}

export function GlassCard({ children, className = '', glow = 'none', hover = true, ...props }: GlassCardProps) {
  const glowClass = glow === 'blue' ? 'glow-blue' : glow === 'emerald' ? 'glow-emerald' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-2xl ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
