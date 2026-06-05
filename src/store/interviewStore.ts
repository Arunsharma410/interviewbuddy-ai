import { create } from 'zustand';
import type { InterviewQuestion, FullEvaluation } from '@/lib/gemini';

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  resume_text: string;
  uploaded_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  job_role: string;
  difficulty: string;
  interview_type: string;
  questions: InterviewQuestion[];
  answers: string[];
  evaluation: FullEvaluation | null;
  status: 'setup' | 'in-progress' | 'completed' | 'evaluated';
  created_at: string;
  completed_at: string | null;
  resume_id: string | null;
}

interface InterviewState {
  resumes: Resume[];
  interviews: InterviewSession[];
  currentInterview: InterviewSession | null;
  currentQuestionIndex: number;
  isRecording: boolean;
  transcript: string;
  
  setResumes: (resumes: Resume[]) => void;
  addResume: (resume: Resume) => void;
  setInterviews: (interviews: InterviewSession[]) => void;
  addInterview: (interview: InterviewSession) => void;
  setCurrentInterview: (interview: InterviewSession | null) => void;
  updateCurrentInterview: (updates: Partial<InterviewSession>) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (index: number, answer: string) => void;
  setIsRecording: (recording: boolean) => void;
  setTranscript: (transcript: string) => void;
  completeInterview: (evaluation: FullEvaluation) => void;
}

// Demo data
const demoResumes: Resume[] = [
  {
    id: 'demo-resume-1',
    user_id: 'demo-user-id',
    file_name: 'alex_johnson_resume.pdf',
    resume_text: 'Experienced Full-Stack Developer with 5 years of experience in React, TypeScript, Node.js, and cloud technologies. Led development of multiple high-traffic web applications. Strong background in system design and agile methodologies.',
    uploaded_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const demoInterviews: InterviewSession[] = [
  {
    id: 'demo-interview-1',
    user_id: 'demo-user-id',
    job_role: 'Senior Frontend Developer',
    difficulty: 'Advanced',
    interview_type: 'Technical',
    questions: [
      { question: 'Explain the virtual DOM and reconciliation in React.', type: 'Technical' },
      { question: 'How do you handle state management in large-scale applications?', type: 'Technical' },
    ],
    answers: ['The virtual DOM is a lightweight in-memory representation of the actual DOM...', 'For large-scale applications, I prefer using a combination of local state with useState...'],
    evaluation: {
      overall_score: 85,
      communication_score: 88,
      technical_score: 82,
      confidence_score: 87,
      evaluations: [
        { score: 88, communication_score: 90, technical_score: 85, confidence_score: 89, strengths: ['Clear explanation', 'Good technical depth'], weaknesses: ['Could mention fiber architecture'], suggestions: ['Discuss React 18 concurrent features'] },
        { score: 82, communication_score: 86, technical_score: 79, confidence_score: 85, strengths: ['Practical approach', 'Good examples'], weaknesses: ['Missing server state discussion'], suggestions: ['Mention React Query or SWR'] },
      ]
    },
    status: 'evaluated',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 3 * 86400000 + 3600000).toISOString(),
    resume_id: 'demo-resume-1',
  },
  {
    id: 'demo-interview-2',
    user_id: 'demo-user-id',
    job_role: 'Full Stack Engineer',
    difficulty: 'Intermediate',
    interview_type: 'Mixed',
    questions: [
      { question: 'Tell me about a challenging project you worked on.', type: 'HR' },
      { question: 'How do you design a RESTful API?', type: 'Technical' },
    ],
    answers: ['One of the most challenging projects was building a real-time analytics dashboard...', 'When designing a RESTful API, I follow resource-oriented architecture...'],
    evaluation: {
      overall_score: 78,
      communication_score: 82,
      technical_score: 75,
      confidence_score: 80,
      evaluations: [
        { score: 80, communication_score: 85, technical_score: 75, confidence_score: 82, strengths: ['Good storytelling', 'Shows leadership'], weaknesses: ['Could quantify results more'], suggestions: ['Use STAR method'] },
        { score: 76, communication_score: 79, technical_score: 75, confidence_score: 78, strengths: ['Solid fundamentals'], weaknesses: ['Missing versioning discussion'], suggestions: ['Discuss API versioning strategies'] },
      ]
    },
    status: 'evaluated',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 10 * 86400000 + 2400000).toISOString(),
    resume_id: 'demo-resume-1',
  },
  {
    id: 'demo-interview-3',
    user_id: 'demo-user-id',
    job_role: 'Product Manager',
    difficulty: 'Beginner',
    interview_type: 'HR',
    questions: [],
    answers: [],
    evaluation: {
      overall_score: 72,
      communication_score: 78,
      technical_score: 65,
      confidence_score: 74,
      evaluations: []
    },
    status: 'evaluated',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 20 * 86400000 + 1800000).toISOString(),
    resume_id: null,
  },
];

export const useInterviewStore = create<InterviewState>((set, get) => ({
  resumes: [],
  interviews: [],
  currentInterview: null,
  currentQuestionIndex: 0,
  isRecording: false,
  transcript: '',

  setResumes: (resumes) => set({ resumes }),
  addResume: (resume) => set(state => ({ resumes: [resume, ...state.resumes] })),
  setInterviews: (interviews) => set({ interviews }),
  addInterview: (interview) => set(state => ({ interviews: [interview, ...state.interviews] })),
  
  setCurrentInterview: (interview) => set({ currentInterview: interview, currentQuestionIndex: 0 }),
  
  updateCurrentInterview: (updates) => set(state => ({
    currentInterview: state.currentInterview ? { ...state.currentInterview, ...updates } : null
  })),
  
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  
  setAnswer: (index, answer) => set(state => {
    if (!state.currentInterview) return state;
    const answers = [...state.currentInterview.answers];
    answers[index] = answer;
    return { currentInterview: { ...state.currentInterview, answers } };
  }),
  
  setIsRecording: (recording) => set({ isRecording: recording }),
  setTranscript: (transcript) => set({ transcript }),
  
  completeInterview: (evaluation) => set(state => {
    if (!state.currentInterview) return state;
    const completed: InterviewSession = {
      ...state.currentInterview,
      evaluation,
      status: 'evaluated',
      completed_at: new Date().toISOString(),
    };
    return {
      currentInterview: completed,
      interviews: state.interviews.map(i => i.id === completed.id ? completed : i),
    };
  }),
}));

// Load demo data
export const loadDemoData = () => {
  const store = useInterviewStore.getState();
  store.setResumes(demoResumes);
  store.setInterviews(demoInterviews);
};
