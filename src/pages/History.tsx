import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Clock, Play, Briefcase } from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDistanceToNow, format } from 'date-fns';

export function HistoryPage() {
  const navigate = useNavigate();
  const { interviews } = useInterviewStore();

  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Interview History</h1>
            <p className="text-gray-400">View all your past interview sessions and results.</p>
          </div>
          <button
            onClick={() => navigate('/app/interview/setup')}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> New Interview
          </button>
        </div>

        {sortedInterviews.length === 0 ? (
          <GlassCard hover={false}>
            <EmptyState
              icon={Briefcase}
              title="No interview history"
              description="Complete your first interview to see your history here."
              action={{ label: 'Start Interview', onClick: () => navigate('/app/interview/setup') }}
            />
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {sortedInterviews.map((interview, i) => (
              <GlassCard
                key={interview.id}
                className="p-5 cursor-pointer"
                onClick={() => {
                  if (interview.status === 'evaluated') {
                    navigate(`/app/results/${interview.id}`);
                  } else {
                    navigate(`/app/interview/session/${interview.id}`);
                  }
                }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    interview.status === 'evaluated'
                      ? (interview.evaluation?.overall_score || 0) >= 80 ? 'bg-emerald-500/10' : (interview.evaluation?.overall_score || 0) >= 60 ? 'bg-blue-500/10' : 'bg-orange-500/10'
                      : 'bg-white/5'
                  }`}>
                    {interview.status === 'evaluated' ? (
                      <Target className={`w-6 h-6 ${
                        (interview.evaluation?.overall_score || 0) >= 80 ? 'text-emerald-400' :
                        (interview.evaluation?.overall_score || 0) >= 60 ? 'text-blue-400' : 'text-orange-400'
                      }`} />
                    ) : (
                      <Play className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">{interview.job_role}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                        interview.status === 'evaluated' ? 'bg-emerald-500/10 text-emerald-400' :
                        interview.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-gray-400'
                      }`}>
                        {interview.status === 'evaluated' ? 'Completed' : interview.status === 'in-progress' ? 'In Progress' : interview.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-gray-500">{interview.difficulty}</span>
                      <span className="text-xs text-gray-700">•</span>
                      <span className="text-xs text-gray-500">{interview.interview_type}</span>
                      <span className="text-xs text-gray-700">•</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(interview.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {interview.status === 'evaluated' && interview.evaluation && (
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xl font-bold ${
                        interview.evaluation.overall_score >= 80 ? 'text-emerald-400' :
                        interview.evaluation.overall_score >= 60 ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        {interview.evaluation.overall_score}
                      </div>
                      <div className="text-[10px] text-gray-600">/ 100</div>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
