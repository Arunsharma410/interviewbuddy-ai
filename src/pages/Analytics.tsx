import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { TrendingUp, Award, BarChart3, Target, Play, Briefcase } from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsPage() {
  const navigate = useNavigate();
  const { interviews } = useInterviewStore();

  const evaluatedInterviews = interviews
    .filter(i => i.status === 'evaluated' && i.evaluation)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (evaluatedInterviews.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-gray-400">Track your interview performance over time.</p>
        </div>
        <GlassCard hover={false}>
          <EmptyState
            icon={BarChart3}
            title="No analytics data yet"
            description="Complete at least one interview to see your performance analytics."
            action={{ label: 'Start Interview', onClick: () => navigate('/app/interview/setup') }}
          />
        </GlassCard>
      </div>
    );
  }

  const lineData = evaluatedInterviews.map((interview, i) => ({
    name: `#${i + 1}`,
    overall: interview.evaluation!.overall_score,
    communication: interview.evaluation!.communication_score,
    technical: interview.evaluation!.technical_score,
    confidence: interview.evaluation!.confidence_score,
  }));

  const latestEval = evaluatedInterviews[evaluatedInterviews.length - 1].evaluation!;
  const radarData = [
    { subject: 'Overall', value: latestEval.overall_score },
    { subject: 'Communication', value: latestEval.communication_score },
    { subject: 'Technical', value: latestEval.technical_score },
    { subject: 'Confidence', value: latestEval.confidence_score },
  ];

  const avgScore = Math.round(evaluatedInterviews.reduce((s, i) => s + i.evaluation!.overall_score, 0) / evaluatedInterviews.length);
  const bestScore = Math.max(...evaluatedInterviews.map(i => i.evaluation!.overall_score));
  const latestScore = latestEval.overall_score;
  const firstScore = evaluatedInterviews[0].evaluation!.overall_score;
  const improvement = firstScore > 0 ? Math.round(((latestScore - firstScore) / firstScore) * 100) : 0;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-gray-400">Track your interview performance over time.</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Award, label: 'Average Score', value: avgScore, suffix: '/100', color: 'text-blue-400' },
            { icon: TrendingUp, label: 'Best Score', value: bestScore, suffix: '/100', color: 'text-emerald-400' },
            { icon: Target, label: 'Total Interviews', value: evaluatedInterviews.length, suffix: '', color: 'text-purple-400' },
            { icon: BarChart3, label: 'Improvement', value: `${improvement > 0 ? '+' : ''}${improvement}`, suffix: '%', color: improvement >= 0 ? 'text-emerald-400' : 'text-red-400' },
          ].map(stat => (
            <GlassCard key={stat.label} className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}<span className="text-sm text-gray-600">{stat.suffix}</span>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <GlassCard hover={false} className="p-6">
              <h3 className="text-sm font-semibold text-white mb-6">Score History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={lineData}>
                  <defs>
                    <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="overall" stroke="#3b82f6" fill="url(#colorOverall)" strokeWidth={2} name="Overall" />
                  <Line type="monotone" dataKey="communication" stroke="#34d399" strokeWidth={2} dot={false} name="Communication" />
                  <Line type="monotone" dataKey="technical" stroke="#a855f7" strokeWidth={2} dot={false} name="Technical" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Radar Chart */}
          <motion.div variants={fadeInUp}>
            <GlassCard hover={false} className="p-6">
              <h3 className="text-sm font-semibold text-white mb-6">Skills Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Progress Bars */}
        <motion.div variants={fadeInUp}>
          <GlassCard hover={false} className="p-6">
            <h3 className="text-sm font-semibold text-white mb-6">Latest Performance</h3>
            <div className="space-y-5">
              {[
                { label: 'Overall', score: latestEval.overall_score, color: 'from-blue-500 to-blue-400' },
                { label: 'Communication', score: latestEval.communication_score, color: 'from-emerald-500 to-emerald-400' },
                { label: 'Technical', score: latestEval.technical_score, color: 'from-purple-500 to-purple-400' },
                { label: 'Confidence', score: latestEval.confidence_score, color: 'from-orange-500 to-orange-400' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <span className="text-sm font-semibold text-white">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
