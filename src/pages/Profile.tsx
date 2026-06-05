import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Award, BarChart3, Clock, Edit3, CheckCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useInterviewStore } from '@/store/interviewStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { format } from 'date-fns';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export function ProfilePage() {
  const { profile } = useAuthStore();
  const { interviews, resumes } = useInterviewStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.full_name || '');
  const [saved, setSaved] = useState(false);

  const evaluatedInterviews = interviews.filter(i => i.status === 'evaluated' && i.evaluation);
  const avgScore = evaluatedInterviews.length > 0
    ? Math.round(evaluatedInterviews.reduce((s, i) => s + (i.evaluation?.overall_score || 0), 0) / evaluatedInterviews.length)
    : 0;

  const handleSave = () => {
    // In production, save to Supabase
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Profile</h1>
          <p className="text-gray-400">Manage your account information.</p>
        </motion.div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6"
          >
            <CheckCircle className="w-4 h-4" /> Profile updated successfully!
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div variants={fadeInUp}>
          <GlassCard hover={false} className="p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-glass rounded-xl py-2 px-3 text-lg font-bold text-white"
                    />
                    <button onClick={handleSave} className="btn-primary px-4 py-2 rounded-xl text-sm text-white">Save</button>
                    <button onClick={() => setEditing(false)} className="text-sm text-gray-500">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h2 className="text-2xl font-bold text-white">{profile?.full_name || 'User'}</h2>
                    <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">{profile?.email || 'user@example.com'}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">
                    Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BarChart3, label: 'Interviews', value: interviews.length, color: 'text-blue-400' },
            { icon: Award, label: 'Avg Score', value: avgScore > 0 ? `${avgScore}%` : '—', color: 'text-emerald-400' },
            { icon: Sparkles, label: 'Resumes', value: resumes.length, color: 'text-purple-400' },
            { icon: Clock, label: 'Best Score', value: evaluatedInterviews.length > 0 ? `${Math.max(...evaluatedInterviews.map(i => i.evaluation?.overall_score || 0))}%` : '—', color: 'text-orange-400' },
          ].map(stat => (
            <GlassCard key={stat.label} className="p-5 text-center">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <GlassCard hover={false} className="divide-y divide-white/5">
            {evaluatedInterviews.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">No recent activity</div>
            ) : (
              evaluatedInterviews.slice(0, 5).map(interview => (
                <div key={interview.id} className="flex items-center gap-4 p-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      Completed <span className="font-medium">{interview.job_role}</span> interview
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {interview.evaluation?.overall_score || 0}/100 • {format(new Date(interview.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
