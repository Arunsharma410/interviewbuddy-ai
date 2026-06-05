import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-500/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500"
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 blur-xl opacity-30" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold gradient-text mb-1">InterviewBuddy AI</h2>
          <p className="text-sm text-gray-400">{text}</p>
        </div>
      </motion.div>
    </div>
  );
}
