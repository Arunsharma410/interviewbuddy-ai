import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Clock, Mic, MicOff, Send,
  AlertCircle, CheckCircle, Volume2, Sparkles, Square
} from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { evaluateAnswers, isGeminiConfigured, type FullEvaluation } from '@/lib/gemini';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function InterviewSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentInterview, setCurrentInterview, currentQuestionIndex,
    setCurrentQuestionIndex, setAnswer, interviews, completeInterview,
    isRecording, setIsRecording, transcript, setTranscript
  } = useInterviewStore();

  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load interview
  useEffect(() => {
    if (!currentInterview && id) {
      const found = interviews.find(i => i.id === id);
      if (found) setCurrentInterview(found);
      else navigate('/app/dashboard');
    }
  }, [id, currentInterview, interviews]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentInterview) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading interview..." />
      </div>
    );
  }

  const questions = currentInterview.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentInterview.answers[currentQuestionIndex] || '';
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const goNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(currentQuestionIndex, value);
  };

  // Voice recording
  const startRecording = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in your browser.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += t + ' ';
          } else {
            interimTranscript += t;
          }
        }

        const newText = (currentAnswer + ' ' + finalTranscript).trim();
        if (finalTranscript) {
          handleAnswerChange(newText);
        }
        setTranscript(interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Failed to start voice recording.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setTranscript('');
  };

  const handleSubmit = async () => {
    const unanswered = currentInterview.answers.filter(a => !a.trim()).length;
    if (unanswered > 0) {
      const confirmed = window.confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`);
      if (!confirmed) return;
    }

    setSubmitting(true);
    setError('');

    try {
      let evaluation: FullEvaluation;

      if (isGeminiConfigured()) {
        const result = await evaluateAnswers(
          currentInterview.questions,
          currentInterview.answers,
          currentInterview.job_role,
          currentInterview.difficulty
        );
        if (!result) throw new Error('Failed to evaluate. Please try again.');
        evaluation = result;
      } else {
        // Demo evaluation
        evaluation = {
          overall_score: 78,
          communication_score: 82,
          technical_score: 75,
          confidence_score: 80,
          evaluations: currentInterview.questions.map((_, i) => ({
            score: 70 + Math.floor(Math.random() * 25),
            communication_score: 70 + Math.floor(Math.random() * 25),
            technical_score: 65 + Math.floor(Math.random() * 30),
            confidence_score: 70 + Math.floor(Math.random() * 25),
            strengths: ['Good structure', 'Clear communication', 'Relevant examples'],
            weaknesses: ['Could provide more depth', 'Missing specific metrics'],
            suggestions: ['Use the STAR method', 'Include quantifiable results', 'Practice conciseness'],
          })),
        };
      }

      completeInterview(evaluation);
      navigate(`/app/results/${currentInterview.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit interview.');
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="relative mb-6 mx-auto w-20 h-20">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500"
              animate={{ rotate: [0, 180, 360], borderRadius: ['16px', '50%', '16px'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 blur-2xl opacity-30" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Evaluating Your Answers</h2>
          <p className="text-sm text-gray-400">AI is analyzing your responses...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-white">{currentInterview.job_role}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">{currentInterview.difficulty}</span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-500">{currentInterview.interview_type}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-white font-mono">{formatTime(timer)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          {/* Question dots */}
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                  i === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : currentInterview.answers[i]?.trim()
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 text-gray-500 hover:bg-white/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
          >
            <AlertCircle className="w-4 h-4" /> {error}
          </motion.div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard hover={false} className="p-6 lg:p-8 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  currentQuestion?.type === 'Technical' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  {currentQuestion?.type || 'General'}
                </span>
                <span className="text-xs text-gray-600">Question {currentQuestionIndex + 1}</span>
              </div>
              <h2 className="text-lg lg:text-xl font-semibold text-white leading-relaxed">
                {currentQuestion?.question || 'Loading question...'}
              </h2>
            </GlassCard>

            {/* Answer Area */}
            <GlassCard hover={false} className="p-6 lg:p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300">Your Answer</h3>
                <div className="flex items-center gap-2">
                  {/* Voice Toggle */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isRecording
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-red-500 recording-pulse" />
                        <Square className="w-3 h-3" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Mic className="w-3 h-3" />
                        Voice
                      </>
                    )}
                  </button>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                value={currentAnswer}
                onChange={e => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here or use voice mode..."
                className="w-full input-glass rounded-xl p-4 text-sm text-white placeholder-gray-600 min-h-[200px] resize-none"
                rows={8}
              />

              {/* Live transcript */}
              {isRecording && transcript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 className="w-3 h-3 text-blue-400" />
                    <span className="text-[11px] text-blue-400 font-medium">Live Transcript</span>
                  </div>
                  <p className="text-sm text-gray-400 italic">{transcript}</p>
                </motion.div>
              )}

              {currentAnswer && (
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-gray-500">{currentAnswer.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 group"
              >
                <Send className="w-4 h-4" />
                Submit Interview
              </button>
            ) : (
              <button
                onClick={goNext}
                className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
