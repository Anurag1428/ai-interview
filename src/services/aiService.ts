// Mock AI service - In a real implementation, you would integrate with OpenAI, Anthropic, or similar
export interface AIQuestion {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number;
}

export interface AIEvaluation {
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// Mock questions database
const MOCK_QUESTIONS: AIQuestion[] = [
  // Easy Questions
  {
    id: 'easy-1',
    text: 'What is React and what are its main advantages?',
    difficulty: 'easy',
    category: 'React Fundamentals',
    timeLimit: 20,
  },
  {
    id: 'easy-2',
    text: 'Explain the difference between let, const, and var in JavaScript.',
    difficulty: 'easy',
    category: 'JavaScript Fundamentals',
    timeLimit: 20,
  },
  // Medium Questions
  {
    id: 'medium-1',
    text: 'How would you implement a custom hook in React to manage form state with validation?',
    difficulty: 'medium',
    category: 'React Advanced',
    timeLimit: 60,
  },
  {
    id: 'medium-2',
    text: 'Describe the event loop in Node.js and how it handles asynchronous operations.',
    difficulty: 'medium',
    category: 'Node.js',
    timeLimit: 60,
  },
  // Hard Questions
  {
    id: 'hard-1',
    text: 'Design a scalable architecture for a real-time chat application with millions of users. Consider database design, caching, and real-time communication.',
    difficulty: 'hard',
    category: 'System Design',
    timeLimit: 120,
  },
  {
    id: 'hard-2',
    text: 'Implement a function that efficiently finds the longest common subsequence between two strings using dynamic programming.',
    difficulty: 'hard',
    category: 'Algorithms',
    timeLimit: 120,
  },
];

export const generateInterviewQuestions = async (): Promise<AIQuestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return questions in order: 2 easy, 2 medium, 2 hard
  return MOCK_QUESTIONS;
};

export const evaluateAnswer = async (
  question: AIQuestion,
  answer: string,
  timeSpent: number
): Promise<AIEvaluation> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock evaluation logic - In real implementation, this would call an AI API
  const baseScore = Math.min(100, Math.max(0, 70 + Math.random() * 30));
  const timeBonus = timeSpent < question.timeLimit * 0.8 ? 5 : 0;
  const finalScore = Math.min(100, baseScore + timeBonus);
  
  const feedback = generateMockFeedback(question, answer, finalScore);
  const strengths = generateMockStrengths(finalScore);
  const improvements = generateMockImprovements(finalScore);
  
  return {
    score: Math.round(finalScore),
    feedback,
    strengths,
    improvements,
  };
};

const generateMockFeedback = (question: AIQuestion, answer: string, score: number): string => {
  const scoreRanges = [
    { min: 90, feedback: "Excellent answer! You demonstrated deep understanding of the concept." },
    { min: 80, feedback: "Good answer with solid understanding of the topic." },
    { min: 70, feedback: "Decent answer, but could benefit from more detail and examples." },
    { min: 60, feedback: "Basic understanding shown, but missing key concepts." },
    { min: 0, feedback: "Answer needs significant improvement in understanding and clarity." },
  ];
  
  const range = scoreRanges.find(r => score >= r.min) || scoreRanges[scoreRanges.length - 1];
  return range.feedback;
};

const generateMockStrengths = (score: number): string[] => {
  if (score >= 80) {
    return ["Clear communication", "Good technical knowledge", "Well-structured response"];
  } else if (score >= 60) {
    return ["Basic understanding", "Attempted to address the question"];
  } else {
    return ["Showed effort"];
  }
};

const generateMockImprovements = (score: number): string[] => {
  if (score >= 80) {
    return ["Consider providing more examples", "Could elaborate on edge cases"];
  } else if (score >= 60) {
    return ["Need more technical depth", "Provide specific examples", "Improve clarity"];
  } else {
    return ["Study fundamental concepts", "Practice explaining technical topics", "Provide more detailed answers"];
  }
};

export const generateFinalSummary = async (
  candidateName: string,
  answers: Array<{ question: AIQuestion; answer: string; evaluation: AIEvaluation }>
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const totalScore = answers.reduce((sum, item) => sum + item.evaluation.score, 0) / answers.length;
  const strengths = answers.flatMap(item => item.evaluation.strengths);
  const improvements = answers.flatMap(item => item.evaluation.improvements);
  
  return `${candidateName} completed the full-stack developer interview with an average score of ${Math.round(totalScore)}/100. 

Key Strengths:
${strengths.slice(0, 3).map(s => `• ${s}`).join('\n')}

Areas for Improvement:
${improvements.slice(0, 3).map(i => `• ${i}`).join('\n')}

Overall Assessment: ${totalScore >= 80 ? 'Strong candidate with good technical foundation' : 
  totalScore >= 60 ? 'Decent candidate with room for growth' : 
  'Candidate needs significant improvement in technical skills'}.`;
};
