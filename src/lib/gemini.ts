import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

export const getGeminiModel = () => {
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export const isGeminiConfigured = () => {
  return apiKey !== '';
};

export interface InterviewQuestion {
  question: string;
  type: string;
}

export interface QuestionsResponse {
  questions: InterviewQuestion[];
}

export interface AnswerEvaluation {
  score: number;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface FullEvaluation {
  overall_score: number;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
  evaluations: AnswerEvaluation[];
}

export async function generateQuestions(
  resumeText: string,
  jobRole: string,
  difficulty: string,
  interviewType: string
): Promise<QuestionsResponse | null> {
  const model = getGeminiModel();
  if (!model) return null;

  const prompt = `You are an expert interviewer. Generate exactly 10 interview questions based on the following details:

Resume: ${resumeText}
Job Role: ${jobRole}
Difficulty Level: ${difficulty}
Interview Type: ${interviewType}

Return ONLY valid JSON in this exact format, no markdown, no code blocks:
{
  "questions": [
    {
      "question": "Your question here",
      "type": "${interviewType === 'Mixed' ? 'Technical or HR' : interviewType}"
    }
  ]
}

Make questions relevant, challenging, and specific to the candidate's background and the job role.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned) as QuestionsResponse;
    
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Invalid response format');
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to generate questions:', error);
    return null;
  }
}

export async function evaluateAnswers(
  questions: InterviewQuestion[],
  answers: string[],
  jobRole: string,
  difficulty: string
): Promise<FullEvaluation | null> {
  const model = getGeminiModel();
  if (!model) return null;

  const qaPairs = questions.map((q, i) => `Question ${i + 1}: ${q.question}\nAnswer: ${answers[i] || 'No answer provided'}`).join('\n\n');

  const prompt = `You are an expert interview evaluator. Evaluate the following interview answers for a ${jobRole} position at ${difficulty} difficulty level.

${qaPairs}

Return ONLY valid JSON in this exact format, no markdown, no code blocks:
{
  "overall_score": 75,
  "communication_score": 80,
  "technical_score": 70,
  "confidence_score": 75,
  "evaluations": [
    {
      "score": 80,
      "communication_score": 85,
      "technical_score": 75,
      "confidence_score": 80,
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1"],
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
  ]
}

Provide an evaluation object for each question/answer pair. Be fair but constructive. Scores should be 0-100.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned) as FullEvaluation;
    
    if (!parsed.evaluations || !Array.isArray(parsed.evaluations)) {
      throw new Error('Invalid evaluation format');
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to evaluate answers:', error);
    return null;
  }
}
