import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Briefcase, BarChart3, MessageSquare, Layers,
  ArrowRight, CheckCircle, Sparkles, AlertCircle, FileText
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useInterviewStore, type InterviewSession } from '@/store/interviewStore';
import { generateQuestions, isGeminiConfigured } from '@/lib/gemini';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const difficulties = [
  { value: 'Beginner', icon: '🌱', description: 'Basic concepts, behavioral questions', color: 'emerald' },
  { value: 'Intermediate', icon: '⚡', description: 'Applied knowledge, scenario-based', color: 'blue' },
  { value: 'Advanced', icon: '🔥', description: 'Expert-level, system design, deep dives', color: 'orange' },
];

const interviewTypes = [
  { value: 'HR', icon: MessageSquare, description: 'Behavioral, situational, and cultural fit questions', color: 'purple' },
  { value: 'Technical', icon: Layers, description: 'Coding concepts, algorithms, and system design', color: 'blue' },
  { value: 'Mixed', icon: Sparkles, description: 'Combination of both HR and technical questions', color: 'emerald' },
];

export function InterviewSetupPage() {
  const navigate = useNavigate();
  const { user, isDemo } = useAuthStore();
  const { resumes, addInterview, setCurrentInterview } = useInterviewStore();

  const [jobRole, setJobRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedResume = resumes.find(r => r.id === selectedResumeId);
  const canStart = jobRole.trim() && difficulty && interviewType;

  const handleStart = async () => {
    if (!canStart) return;
    setError('');
    setLoading(true);

    try {
      const resumeText = selectedResume?.resume_text || 'General candidate with diverse experience.';
      
      let questions;
      
      if (isGeminiConfigured()) {
        const result = await generateQuestions(resumeText, jobRole, difficulty, interviewType);
        if (!result) {
          throw new Error('Failed to generate questions. Please try again.');
        }
        questions = result.questions;
      } else {
        // Demo questions
        questions = [
          { question: `Tell me about your experience relevant to the ${jobRole} position.`, type: interviewType === 'Mixed' ? 'HR' : interviewType },
          { question: 'What is your greatest professional achievement and why?', type: 'HR' },
          { question: `Describe a challenging ${jobRole}-related problem you solved.`, type: interviewType === 'HR' ? 'HR' : 'Technical' },
          { question: 'How do you handle tight deadlines and pressure?', type: 'HR' },
          { question: `What tools and technologies are you most proficient with for a ${jobRole} role?`, type: 'Technical' },
          { question: 'Describe your approach to learning new technologies.', type: 'HR' },
          { question: `How would you design a scalable system for a ${jobRole} project?`, type: 'Technical' },
          { question: 'Tell me about a time you had a conflict with a team member.', type: 'HR' },
          { question: `What best practices do you follow as a ${jobRole}?`, type: 'Technical' },
          { question: 'Where do you see yourself in 5 years?', type: 'HR' },
        ];
      }

      const newInterview: InterviewSession = {
        id: `interview-${Date.now()}`,
        user_id: user?.id || 'demo',
        job_role: jobRole,
        difficulty,
        interview_type: interviewType,
        questions,
        answers: new Array(questions.length).fill(''),
        evaluation: null,
        status: 'in-progress',
        created_at: new Date().toISOString(),
        completed_at: null,
        resume_id: selectedResumeId || null,
      };

      addInterview(newInterview);
      setCurrentInterview(newInterview);
      navigate(`/app/interview/session/${newInterview.id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 mx-auto"
              animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 blur-2xl opacity-30 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Generating Your Interview</h2>
          <p className="text-sm text-gray-400 mb-1">AI is crafting personalized questions...</p>
          <p className="text-xs text-gray-600">This may take a few moments</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Interview Setup</h1>
          <p className="text-gray-400">Configure your AI-powered interview session.</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
          >
            <AlertCircle className="w-4 h-4" /> {error}
          </motion.div>
        )}

        {/* Resume Selection */}
        {resumes.length > 0 && (
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Select Resume (Optional)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassCard
                className={`p-4 cursor-pointer ${!selectedResumeId ? 'border-blue-500/30 bg-blue-500/5' : ''}`}
                onClick={() => setSelectedResumeId('')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">No Resume</p>
                    <p className="text-xs text-gray-500">General questions</p>
                  </div>
                  {!selectedResumeId && <CheckCircle className="w-4 h-4 text-blue-400 ml-auto" />}
                </div>
              </GlassCard>
              {resumes.map(resume => (
                <GlassCard
                  key={resume.id}
                  className={`p-4 cursor-pointer ${selectedResumeId === resume.id ? 'border-blue-500/30 bg-blue-500/5' : ''}`}
                  onClick={() => setSelectedResumeId(resume.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{resume.file_name}</p>
                      <p className="text-xs text-gray-500">Personalized questions</p>
                    </div>
                    {selectedResumeId === resume.id && <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Job Role */}
        <motion.div variants={fadeInUp} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Job Role
          </h2>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className="w-full input-glass rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600"
            />
          </div>
        </motion.div>

        {/* Difficulty */}
        <motion.div variants={fadeInUp} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Difficulty Level
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficulties.map(d => (
              <GlassCard
                key={d.value}
                className={`p-4 cursor-pointer text-center ${difficulty === d.value ? `border-${d.color}-500/30 bg-${d.color}-500/5` : ''}`}
                onClick={() => setDifficulty(d.value)}
                style={difficulty === d.value ? { borderColor: d.color === 'emerald' ? 'rgba(16,185,129,0.3)' : d.color === 'blue' ? 'rgba(59,130,246,0.3)' : 'rgba(249,115,22,0.3)', background: d.color === 'emerald' ? 'rgba(16,185,129,0.05)' : d.color === 'blue' ? 'rgba(59,130,246,0.05)' : 'rgba(249,115,22,0.05)' } : {}}
              >
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{d.value}</div>
                <div className="text-xs text-gray-500">{d.description}</div>
                {difficulty === d.value && <CheckCircle className="w-4 h-4 text-blue-400 mx-auto mt-2" />}
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Interview Type */}
        <motion.div variants={fadeInUp} className="mb-10">
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Interview Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {interviewTypes.map(t => (
              <GlassCard
                key={t.value}
                className={`p-4 cursor-pointer ${interviewType === t.value ? 'border-blue-500/30 bg-blue-500/5' : ''}`}
                onClick={() => setInterviewType(t.value)}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <t.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{t.value}</div>
                <div className="text-xs text-gray-500">{t.description}</div>
                {interviewType === t.value && <CheckCircle className="w-4 h-4 text-blue-400 mt-2" />}
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={fadeInUp} className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="btn-primary px-10 py-3.5 rounded-2xl text-base font-semibold text-white flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <Play className="w-5 h-5" />
            Start Interview
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
