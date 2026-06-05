import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun, Moon, Bell, Shield, Key, Trash2, CheckCircle,
  Monitor, Volume2, Globe, Sparkles
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { GlassCard } from '@/components/ui/GlassCard';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-blue-500' : 'bg-white/10'
      }`}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? '22px' : '2px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export function SettingsPage() {
  const { theme, toggleTheme } = useUIStore();
  const { isDemo } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [voiceAutoStart, setVoiceAutoStart] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-gray-400">Customize your InterviewBuddy experience.</p>
        </motion.div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6"
          >
            <CheckCircle className="w-4 h-4" /> Settings saved!
          </motion.div>
        )}

        {/* Appearance */}
        <motion.div variants={fadeInUp} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Appearance
          </h2>
          <GlassCard hover={false} className="divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                <div>
                  <p className="text-sm font-medium text-white">Theme</p>
                  <p className="text-xs text-gray-500">Switch between dark and light mode</p>
                </div>
              </div>
              <Toggle enabled={theme === 'dark'} onChange={toggleTheme} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fadeInUp} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </h2>
          <GlassCard hover={false} className="divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-white">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive notifications about interview results</p>
              </div>
              <Toggle enabled={notifications} onChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-white">Sound Effects</p>
                <p className="text-xs text-gray-500">Play sounds for actions and events</p>
              </div>
              <Toggle enabled={soundEffects} onChange={setSoundEffects} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Interview */}
        <motion.div variants={fadeInUp} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Interview
          </h2>
          <GlassCard hover={false} className="divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-white">Voice Auto-Start</p>
                <p className="text-xs text-gray-500">Automatically start recording when a new question appears</p>
              </div>
              <Toggle enabled={voiceAutoStart} onChange={setVoiceAutoStart} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-white">Language</p>
                <p className="text-xs text-gray-500">Interview and recognition language</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300">
                <Globe className="w-4 h-4" /> English (US)
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Security */}
        <motion.div variants={fadeInUp} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Security
          </h2>
          <GlassCard hover={false} className="divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-white">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
              <button className="btn-secondary px-4 py-1.5 rounded-lg text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Key className="w-3 h-3" /> Change
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={fadeInUp} className="mb-6">
          <h2 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h2>
          <GlassCard hover={false} className="p-4 border-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Delete Account</p>
                <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1.5">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* API Keys Info */}
        <motion.div variants={fadeInUp}>
          <GlassCard hover={false} className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">API Configuration</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {isDemo
                    ? 'Running in demo mode. To use real AI features, configure your Supabase and Gemini API keys in the environment variables.'
                    : 'Your API keys are configured via environment variables. Never expose them in client-side code.'
                  }
                </p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                    <span className="text-xs text-gray-500">Supabase: {isDemo ? 'Demo Mode' : 'Connected'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                    <span className="text-xs text-gray-500">Gemini AI: {isDemo ? 'Demo Mode' : 'Connected'}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
