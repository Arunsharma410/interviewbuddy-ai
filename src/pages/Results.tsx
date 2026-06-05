import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, TrendingUp, MessageSquare, Shield, ChevronDown,
  CheckCircle, AlertTriangle, Lightbulb, ArrowLeft, Play, BarChart3
} from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { useState } from 'react';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function ScoreRing({ score, size = 120, label }: { score: number; size?: number; label: string }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#3b82f6' : '#f97316';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-2">{label}</span>
    </div>
  );
}

export function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { interviews, currentInterview, setCurrentInterview } = useInterviewStore();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const interview = currentInterview?.id === id ? currentInterview : interviews.find(i => i.id === id);

  useEffect(() => {
    if (interview && !currentInterview) {
      setCurrentInterview(interview);
    }
  }, [interview]);

  if (!interview || !interview.evaluation) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <GlassCard hover={false} className="p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Results Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">This interview hasn't been evaluated yet or doesn't exist.</p>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium text-white"
          >
            Go to Dashboard
          </button>
        </GlassCard>
      </div>
    );
  }

  const { evaluation } = interview;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/app/history')}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to History
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{interview.job_role}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-400">{interview.difficulty}</span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-400">{interview.interview_type}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/interview/setup')}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> New Interview
          </button>
        </motion.div>

        {/* Overall Scores */}
        <motion.div variants={fadeInUp}>
          <GlassCard hover={false} className="p-8 mb-8">
            <h2 className="text-lg font-semibold text-white mb-8 text-center">Performance Overview</h2>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              <ScoreRing score={evaluation.overall_score} size={140} label="Overall" />
              <ScoreRing score={evaluation.communication_score} label="Communication" />
              <ScoreRing score={evaluation.technical_score} label="Technical" />
              <ScoreRing score={evaluation.confidence_score} label="Confidence" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Score Summary Cards */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Award, label: 'Overall', score: evaluation.overall_score, color: 'blue' },
            { icon: MessageSquare, label: 'Communication', score: evaluation.communication_score, color: 'emerald' },
            { icon: BarChart3, label: 'Technical', score: evaluation.technical_score, color: 'purple' },
            { icon: Shield, label: 'Confidence', score: evaluation.confidence_score, color: 'orange' },
          ].map((item) => (
            <GlassCard key={item.label} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
              <div className={`text-2xl font-bold ${
                item.score >= 80 ? 'text-emerald-400' : item.score >= 60 ? 'text-blue-400' : 'text-orange-400'
              }`}>
                {item.score}<span className="text-sm text-gray-600">/100</span>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Question-by-Question Breakdown */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h2>
          <div className="space-y-3">
            {interview.questions.map((question, i) => {
              const eval_ = evaluation.evaluations[i];
              const isExpanded = expandedQuestion === i;
              
              return (
                <GlassCard key={i} hover={false} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                    className="w-full flex items-center gap-4 p-4 text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      (eval_?.score || 0) >= 80 ? 'bg-emerald-500/10' : (eval_?.score || 0) >= 60 ? 'bg-blue-500/10' : 'bg-orange-500/10'
                    }`}>
                      <span className={`text-sm font-bold ${
                        (eval_?.score || 0) >= 80 ? 'text-emerald-400' : (eval_?.score || 0) >= 60 ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        {eval_?.score || 0}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Q{i + 1}: {question.question}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{question.type}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && eval_ && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-white/5 px-4 pb-4"
                    >
                      {/* Answer */}
                      <div className="mt-4 p-3 rounded-xl bg-white/5">
                        <p className="text-xs text-gray-500 mb-1">Your Answer:</p>
                        <p className="text-sm text-gray-300">{interview.answers[i] || 'No answer provided'}</p>
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <div className="text-sm font-bold text-blue-400">{eval_.communication_score}</div>
                          <div className="text-[10px] text-gray-500">Communication</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <div className="text-sm font-bold text-purple-400">{eval_.technical_score}</div>
                          <div className="text-[10px] text-gray-500">Technical</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <div className="text-sm font-bold text-orange-400">{eval_.confidence_score}</div>
                          <div className="text-[10px] text-gray-500">Confidence</div>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-400">Strengths</span>
                          </div>
                          <ul className="space-y-1">
                            {eval_.strengths.map((s, j) => (
                              <li key={j} className="text-xs text-gray-400">• {s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-xs font-semibold text-orange-400">Weaknesses</span>
                          </div>
                          <ul className="space-y-1">
                            {eval_.weaknesses.map((w, j) => (
                              <li key={j} className="text-xs text-gray-400">• {w}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-semibold text-blue-400">Suggestions</span>
                          </div>
                          <ul className="space-y-1">
                            {eval_.suggestions.map((s, j) => (
                              <li key={j} className="text-xs text-gray-400">• {s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
