import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Upload, Play, History, BarChart3,
  User, Settings, LogOut, FileText, Sparkles
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

interface CommandItem {
  icon: typeof Search;
  label: string;
  description: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { signOut } = useAuthStore();

  const commands: CommandItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', description: 'Go to dashboard', action: () => navigate('/app/dashboard'), category: 'Navigation' },
    { icon: Upload, label: 'Upload Resume', description: 'Upload a new resume', action: () => navigate('/app/resume'), category: 'Navigation' },
    { icon: Play, label: 'Start Interview', description: 'Begin a new interview session', action: () => navigate('/app/interview/setup'), category: 'Navigation' },
    { icon: History, label: 'Interview History', description: 'View past interviews', action: () => navigate('/app/history'), category: 'Navigation' },
    { icon: BarChart3, label: 'Analytics', description: 'View performance analytics', action: () => navigate('/app/analytics'), category: 'Navigation' },
    { icon: User, label: 'Profile', description: 'Edit your profile', action: () => navigate('/app/profile'), category: 'Navigation' },
    { icon: Settings, label: 'Settings', description: 'App settings', action: () => navigate('/app/settings'), category: 'Navigation' },
    { icon: LogOut, label: 'Sign Out', description: 'Sign out of your account', action: () => signOut(), category: 'Account' },
  ];

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [commandPaletteOpen]);

  const handleSelect = (command: CommandItem) => {
    setCommandPaletteOpen(false);
    command.action();
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="mx-4 glass rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-500">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-3 py-1.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider">{category}</div>
                    {items.map(item => (
                      <button
                        key={item.label}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <item.icon className="w-4 h-4 text-gray-500" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-gray-500">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
