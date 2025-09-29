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

// Comprehensive Full-Stack Developer Questions Database
const FULL_STACK_QUESTIONS: AIQuestion[] = [
  // Easy Questions (2)
  {
    id: 'easy-1',
    text: 'What is React and what are its main advantages over traditional DOM manipulation? Explain the concept of virtual DOM.',
    difficulty: 'easy',
    category: 'React Fundamentals',
    timeLimit: 20,
  },
  {
    id: 'easy-2',
    text: 'What is the difference between let, const, and var in JavaScript? Provide examples of when to use each.',
    difficulty: 'easy',
    category: 'JavaScript Fundamentals',
    timeLimit: 20,
  },
  // Medium Questions (2)
  {
    id: 'medium-1',
    text: 'How would you implement a custom React hook for managing form state with validation? Include error handling and submission logic.',
    difficulty: 'medium',
    category: 'React Advanced',
    timeLimit: 60,
  },
  {
    id: 'medium-2',
    text: 'Explain the Node.js event loop and how it handles asynchronous operations. How does it differ from traditional multi-threading?',
    difficulty: 'medium',
    category: 'Node.js & Backend',
    timeLimit: 60,
  },
  // Hard Questions (2)
  {
    id: 'hard-1',
    text: 'Design a scalable architecture for a real-time chat application with millions of users. Consider database design, caching strategies, real-time communication, and horizontal scaling.',
    difficulty: 'hard',
    category: 'System Design',
    timeLimit: 120,
  },
  {
    id: 'hard-2',
    text: 'Implement a function to find the longest common subsequence between two strings using dynamic programming. Explain the time and space complexity.',
    difficulty: 'hard',
    category: 'Algorithms & Data Structures',
    timeLimit: 120,
  },
];

export const generateInterviewQuestions = async (): Promise<AIQuestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return questions in order: 2 easy, 2 medium, 2 hard
  return FULL_STACK_QUESTIONS;
};

export const evaluateAnswer = async (
  question: AIQuestion,
  answer: string,
  timeSpent: number
): Promise<AIEvaluation> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Enhanced evaluation logic based on answer content and quality
  const evaluation = analyzeAnswerContent(question, answer, timeSpent);
  
  return evaluation;
};

const analyzeAnswerContent = (question: AIQuestion, answer: string, timeSpent: number): AIEvaluation => {
  const answerLength = answer.trim().length;
  const timeRatio = timeSpent / question.timeLimit;
  
  // Base scoring based on answer quality indicators
  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  // Length and completeness analysis
  if (answerLength < 50) {
    score += 20;
    improvements.push("Provide more detailed explanations");
  } else if (answerLength < 100) {
    score += 40;
    improvements.push("Elaborate more on key concepts");
  } else if (answerLength < 200) {
    score += 60;
    strengths.push("Good level of detail");
  } else {
    score += 80;
    strengths.push("Comprehensive answer");
  }
  
  // Technical keyword analysis based on question category
  const technicalKeywords = analyzeTechnicalKeywords(question, answer);
  score += technicalKeywords.score;
  strengths.push(...technicalKeywords.strengths);
  improvements.push(...technicalKeywords.improvements);
  
  // Time management analysis
  if (timeRatio < 0.3) {
    score += 10;
    strengths.push("Efficient time management");
  } else if (timeRatio > 0.9) {
    score -= 5;
    improvements.push("Work on time management");
  }
  
  // Question-specific evaluation
  const questionSpecific = evaluateQuestionSpecific(question, answer);
  score += questionSpecific.score;
  strengths.push(...questionSpecific.strengths);
  improvements.push(...questionSpecific.improvements);
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  const feedback = generateDetailedFeedback(question, score, strengths, improvements);
  
  return {
    score: Math.round(score),
    feedback,
    strengths: strengths.slice(0, 3), // Limit to top 3
    improvements: improvements.slice(0, 3), // Limit to top 3
  };
};

const analyzeTechnicalKeywords = (question: AIQuestion, answer: string): { score: number; strengths: string[]; improvements: string[] } => {
  const answerLower = answer.toLowerCase();
  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  // React-specific keywords
  if (question.category.includes('React')) {
    const reactKeywords = ['component', 'state', 'props', 'hook', 'jsx', 'virtual dom', 'rendering'];
    const foundKeywords = reactKeywords.filter(keyword => answerLower.includes(keyword));
    score += foundKeywords.length * 5;
    
    if (foundKeywords.length >= 3) {
      strengths.push("Good understanding of React concepts");
    } else if (foundKeywords.length < 2) {
      improvements.push("Learn more React fundamentals");
    }
  }
  
  // JavaScript-specific keywords
  if (question.category.includes('JavaScript')) {
    const jsKeywords = ['variable', 'scope', 'hoisting', 'closure', 'async', 'promise', 'callback'];
    const foundKeywords = jsKeywords.filter(keyword => answerLower.includes(keyword));
    score += foundKeywords.length * 5;
    
    if (foundKeywords.length >= 2) {
      strengths.push("Solid JavaScript knowledge");
    } else {
      improvements.push("Strengthen JavaScript fundamentals");
    }
  }
  
  // Node.js-specific keywords
  if (question.category.includes('Node.js')) {
    const nodeKeywords = ['event loop', 'asynchronous', 'callback', 'promise', 'async/await', 'non-blocking'];
    const foundKeywords = nodeKeywords.filter(keyword => answerLower.includes(keyword));
    score += foundKeywords.length * 8;
    
    if (foundKeywords.length >= 2) {
      strengths.push("Good understanding of Node.js concepts");
    } else {
      improvements.push("Study Node.js asynchronous programming");
    }
  }
  
  // System Design keywords
  if (question.category.includes('System Design')) {
    const designKeywords = ['scalability', 'database', 'caching', 'load balancing', 'microservices', 'api'];
    const foundKeywords = designKeywords.filter(keyword => answerLower.includes(keyword));
    score += foundKeywords.length * 10;
    
    if (foundKeywords.length >= 3) {
      strengths.push("Strong system design thinking");
    } else {
      improvements.push("Study system design principles");
    }
  }
  
  // Algorithm keywords
  if (question.category.includes('Algorithm')) {
    const algoKeywords = ['complexity', 'time', 'space', 'optimization', 'dynamic programming', 'recursion'];
    const foundKeywords = algoKeywords.filter(keyword => answerLower.includes(keyword));
    score += foundKeywords.length * 8;
    
    if (foundKeywords.length >= 2) {
      strengths.push("Good algorithmic thinking");
    } else {
      improvements.push("Practice algorithmic problem solving");
    }
  }
  
  return { score, strengths, improvements };
};

const evaluateQuestionSpecific = (question: AIQuestion, answer: string): { score: number; strengths: string[]; improvements: string[] } => {
  const answerLower = answer.toLowerCase();
  let score = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  // Question-specific evaluation
  switch (question.id) {
    case 'easy-1': // React advantages
      if (answerLower.includes('virtual dom')) score += 15;
      if (answerLower.includes('component')) score += 10;
      if (answerLower.includes('reusable')) score += 10;
      if (answerLower.includes('performance')) score += 10;
      break;
      
    case 'easy-2': // let, const, var
      if (answerLower.includes('block scope')) score += 15;
      if (answerLower.includes('hoisting')) score += 10;
      if (answerLower.includes('immutable')) score += 10;
      break;
      
    case 'medium-1': // Custom hook
      if (answerLower.includes('usestate')) score += 10;
      if (answerLower.includes('validation')) score += 15;
      if (answerLower.includes('error')) score += 10;
      if (answerLower.includes('custom')) score += 10;
      break;
      
    case 'medium-2': // Event loop
      if (answerLower.includes('call stack')) score += 15;
      if (answerLower.includes('callback queue')) score += 15;
      if (answerLower.includes('non-blocking')) score += 10;
      break;
      
    case 'hard-1': // System design
      if (answerLower.includes('database')) score += 15;
      if (answerLower.includes('caching')) score += 15;
      if (answerLower.includes('websocket')) score += 15;
      if (answerLower.includes('scaling')) score += 15;
      break;
      
    case 'hard-2': // Algorithm
      if (answerLower.includes('dynamic programming')) score += 20;
      if (answerLower.includes('complexity')) score += 15;
      if (answerLower.includes('memoization')) score += 10;
      break;
  }
  
  return { score, strengths, improvements };
};

const generateDetailedFeedback = (question: AIQuestion, score: number, strengths: string[], improvements: string[]): string => {
  let feedback = '';
  
  if (score >= 85) {
    feedback = `Excellent answer! You demonstrated strong understanding of ${question.category}. `;
  } else if (score >= 70) {
    feedback = `Good answer with solid knowledge of ${question.category}. `;
  } else if (score >= 50) {
    feedback = `Decent response, but could benefit from more depth in ${question.category}. `;
  } else {
    feedback = `Answer needs improvement in ${question.category} fundamentals. `;
  }
  
  if (strengths.length > 0) {
    feedback += `Strengths: ${strengths.join(', ')}. `;
  }
  
  if (improvements.length > 0) {
    feedback += `Areas to improve: ${improvements.join(', ')}.`;
  }
  
  return feedback;
};


export const generateFinalSummary = async (
  candidateName: string,
  answers: Array<{ question: AIQuestion; answer: string; evaluation: AIEvaluation }>
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const totalScore = answers.reduce((sum, item) => sum + item.evaluation.score, 0);
  const averageScore = Math.round(totalScore / answers.length);
  
  // Analyze performance by difficulty
  const easyScores = answers.filter(item => item.question.difficulty === 'easy').map(item => item.evaluation.score);
  const mediumScores = answers.filter(item => item.question.difficulty === 'medium').map(item => item.evaluation.score);
  const hardScores = answers.filter(item => item.question.difficulty === 'hard').map(item => item.evaluation.score);
  
  const easyAvg = easyScores.length > 0 ? Math.round(easyScores.reduce((a, b) => a + b, 0) / easyScores.length) : 0;
  const mediumAvg = mediumScores.length > 0 ? Math.round(mediumScores.reduce((a, b) => a + b, 0) / mediumScores.length) : 0;
  const hardAvg = hardScores.length > 0 ? Math.round(hardScores.reduce((a, b) => a + b, 0) / hardScores.length) : 0;
  
  // Collect unique strengths and improvements
  const allStrengths = Array.from(new Set(answers.flatMap(item => item.evaluation.strengths)));
  const allImprovements = Array.from(new Set(answers.flatMap(item => item.evaluation.improvements)));
  
  // Generate recommendation based on performance
  let recommendation = '';
  if (averageScore >= 85) {
    recommendation = 'Excellent candidate - Strong hire recommendation';
  } else if (averageScore >= 70) {
    recommendation = 'Good candidate - Consider for next round';
  } else if (averageScore >= 50) {
    recommendation = 'Average candidate - May need additional training';
  } else {
    recommendation = 'Below expectations - Not recommended for this role';
  }
  
  return `**Interview Summary for ${candidateName}**

**Overall Score: ${averageScore}/100**

**Performance by Difficulty:**
- Easy Questions: ${easyAvg}/100
- Medium Questions: ${mediumAvg}/100  
- Hard Questions: ${hardAvg}/100

**Detailed Breakdown:**
${answers.map((item, index) => 
  `- Question ${index + 1} (${item.question.difficulty.toUpperCase()}): ${item.evaluation.score}/100 - ${item.question.category}`
).join('\n')}

**Key Strengths:**
${allStrengths.slice(0, 5).map(strength => `• ${strength}`).join('\n')}

**Areas for Improvement:**
${allImprovements.slice(0, 5).map(improvement => `• ${improvement}`).join('\n')}

**Final Recommendation:** ${recommendation}

**Technical Assessment:** ${averageScore >= 70 ? 'Meets technical requirements' : 'Needs technical skill development'}`;
};
