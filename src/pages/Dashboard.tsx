import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, BarChart3, Clock, Play, FileText, Target,
  ArrowRight, Sparkles, Award, ChevronRight, Briefcase, Mic
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useInterviewStore } from '@/store/interviewStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDistanceToNow } from 'date-fns';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { interviews, resumes } = useInterviewStore();

  const evaluatedInterviews = interviews.filter(i => i.status === 'evaluated' && i.evaluation);
  const avgScore = evaluatedInterviews.length > 0
    ? Math.round(evaluatedInterviews.reduce((sum, i) => sum + (i.evaluation?.overall_score || 0), 0) / evaluatedInterviews.length)
    : 0;

  const lastScore = evaluatedInterviews[0]?.evaluation?.overall_score || 0;
  const prevScore = evaluatedInterviews[1]?.evaluation?.overall_score || 0;
  const improvement = prevScore > 0 ? Math.round(((lastScore - prevScore) / prevScore) * 100) : 0;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            {greeting}, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-gray-400">Here's your interview preparation overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Award,
              label: 'Average Score',
              value: avgScore > 0 ? `${avgScore}/100` : '—',
              change: improvement !== 0 ? `${improvement > 0 ? '+' : ''}${improvement}%` : null,
              changePositive: improvement >= 0,
              gradient: 'from-blue-500 to-blue-600',
              bgGlow: 'bg-blue-500/5',
            },
            {
              icon: BarChart3,
              label: 'Interviews',
              value: interviews.length.toString(),
              change: null,
              changePositive: true,
              gradient: 'from-emerald-500 to-emerald-600',
              bgGlow: 'bg-emerald-500/5',
            },
            {
              icon: FileText,
              label: 'Resumes',
              value: resumes.length.toString(),
              change: null,
              changePositive: true,
              gradient: 'from-purple-500 to-purple-600',
              bgGlow: 'bg-purple-500/5',
            },
            {
              icon: TrendingUp,
              label: 'Improvement',
              value: improvement !== 0 ? `${improvement > 0 ? '+' : ''}${improvement}%` : '—',
              change: null,
              changePositive: improvement >= 0,
              gradient: 'from-orange-500 to-orange-600',
              bgGlow: 'bg-orange-500/5',
            },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgGlow} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.gradient} bg-clip-text`} style={{ color: stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('emerald') ? '#10b981' : stat.gradient.includes('purple') ? '#a855f7' : '#f97316' }} />
                </div>
                {stat.change && (
                  <span className={`text-xs font-medium ${stat.changePositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Play,
              title: 'Start Interview',
              description: 'Begin a new AI-powered interview session',
              path: '/app/interview/setup',
              gradient: 'from-blue-500 to-emerald-500',
            },
            {
              icon: FileText,
              title: 'Upload Resume',
              description: 'Upload or update your resume',
              path: '/app/resume',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: BarChart3,
              title: 'View Analytics',
              description: 'Track your improvement over time',
              path: '/app/analytics',
              gradient: 'from-orange-500 to-red-500',
            },
          ].map((action) => (
            <GlassCard
              key={action.title}
              className="p-5 cursor-pointer group"
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} bg-opacity-10 flex items-center justify-center mb-4`} style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))` }}>
                  <action.icon className="w-5 h-5 text-white/80" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-xs text-gray-500">{action.description}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Recent Interviews & Resumes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Interviews */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Interviews</h2>
              <button
                onClick={() => navigate('/app/history')}
                className="text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {evaluatedInterviews.length === 0 ? (
              <GlassCard hover={false} className="py-12">
                <EmptyState
                  icon={Briefcase}
                  title="No interviews yet"
                  description="Start your first AI-powered interview to see your results here."
                  action={{ label: 'Start Interview', onClick: () => navigate('/app/interview/setup') }}
                />
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {evaluatedInterviews.slice(0, 4).map((interview, i) => (
                  <GlassCard
                    key={interview.id}
                    className="p-4 cursor-pointer"
                    onClick={() => navigate(`/app/results/${interview.id}`)}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        (interview.evaluation?.overall_score || 0) >= 80 ? 'bg-emerald-500/10' :
                        (interview.evaluation?.overall_score || 0) >= 60 ? 'bg-blue-500/10' : 'bg-orange-500/10'
                      }`}>
                        <Target className={`w-5 h-5 ${
                          (interview.evaluation?.overall_score || 0) >= 80 ? 'text-emerald-400' :
                          (interview.evaluation?.overall_score || 0) >= 60 ? 'text-blue-400' : 'text-orange-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white truncate">{interview.job_role}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-gray-400 flex-shrink-0">
                            {interview.interview_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{interview.difficulty}</span>
                          <span className="text-xs text-gray-600">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(interview.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-lg font-bold ${
                          (interview.evaluation?.overall_score || 0) >= 80 ? 'text-emerald-400' :
                          (interview.evaluation?.overall_score || 0) >= 60 ? 'text-blue-400' : 'text-orange-400'
                        }`}>
                          {interview.evaluation?.overall_score || 0}
                        </div>
                        <div className="text-[10px] text-gray-600">/ 100</div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={fadeInUp} className="space-y-6">
            {/* Resume Status */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Your Resume</h2>
              {resumes.length === 0 ? (
                <GlassCard hover={false} className="p-5 text-center">
                  <FileText className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-3">No resume uploaded</p>
                  <button
                    onClick={() => navigate('/app/resume')}
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-medium text-white"
                  >
                    Upload Resume
                  </button>
                </GlassCard>
              ) : (
                <GlassCard className="p-5 cursor-pointer" onClick={() => navigate('/app/resume')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{resumes[0].file_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(resumes[0].uploaded_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Tips Card */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Tips</h2>
              <GlassCard hover={false} className="p-5 space-y-3">
                {[
                  { icon: Mic, text: 'Try voice mode for a realistic experience' },
                  { icon: Target, text: 'Start with beginner before advanced' },
                  { icon: TrendingUp, text: 'Practice daily for best results' },
                  { icon: Sparkles, text: 'Review feedback after each session' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400">{tip.text}</p>
                  </div>
                ))}
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
