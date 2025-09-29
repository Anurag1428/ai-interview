// Enhanced AI service with adaptive difficulty and personalized questions
export interface AIQuestion {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number;
  followUpHints?: string[];
  expectedKeywords?: string[];
}

export interface AIEvaluation {
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  improvements: string[];
}

// AI-Generated Theoretical Questions Pool - More conceptual, less coding
// Questions focus on understanding concepts rather than implementation details
const THEORETICAL_QUESTIONS: AIQuestion[] = [
  // Easy Questions Pool (10 questions, pick 2)
  {
    id: 'easy-1',
    text: 'Explain what React is and why companies like Facebook, Netflix, and Airbnb choose it over other frameworks. What makes it special?',
    difficulty: 'easy',
    category: 'React Fundamentals',
    timeLimit: 30,
    expectedKeywords: ['virtual dom', 'component', 'reusable', 'performance', 'ecosystem'],
  },
  {
    id: 'easy-2',
    text: 'What is the difference between frontend and backend development? How do they communicate with each other?',
    difficulty: 'easy',
    category: 'Web Development Basics',
    timeLimit: 30,
    expectedKeywords: ['frontend', 'backend', 'api', 'client', 'server', 'http'],
  },
  {
    id: 'easy-3',
    text: 'Explain what APIs are and why they are important in modern web development. Give a real-world example.',
    difficulty: 'easy',
    category: 'API Concepts',
    timeLimit: 30,
    expectedKeywords: ['api', 'interface', 'data', 'communication', 'rest'],
  },
  {
    id: 'easy-4',
    text: 'What is the purpose of version control systems like Git? Why do development teams use them?',
    difficulty: 'easy',
    category: 'Development Tools',
    timeLimit: 30,
    expectedKeywords: ['version control', 'git', 'collaboration', 'history', 'branches'],
  },
  {
    id: 'easy-5',
    text: 'Explain the concept of responsive web design. Why is it important in today\'s world?',
    difficulty: 'easy',
    category: 'Frontend Concepts',
    timeLimit: 30,
    expectedKeywords: ['responsive', 'mobile', 'desktop', 'css', 'media queries'],
  },
  {
    id: 'easy-6',
    text: 'What is the difference between a library and a framework? Give examples of each.',
    difficulty: 'easy',
    category: 'Software Architecture',
    timeLimit: 30,
    expectedKeywords: ['library', 'framework', 'control', 'structure', 'react', 'angular'],
  },
  {
    id: 'easy-7',
    text: 'Explain what databases are and why web applications need them. What\'s the difference between SQL and NoSQL?',
    difficulty: 'easy',
    category: 'Database Concepts',
    timeLimit: 30,
    expectedKeywords: ['database', 'sql', 'nosql', 'data storage', 'persistence'],
  },
  {
    id: 'easy-8',
    text: 'What is cloud computing and how has it changed web development? Name some popular cloud providers.',
    difficulty: 'easy',
    category: 'Cloud & Infrastructure',
    timeLimit: 30,
    expectedKeywords: ['cloud', 'aws', 'azure', 'scalability', 'deployment'],
  },
  {
    id: 'easy-9',
    text: 'Explain what HTTPS is and why it\'s important for websites. How does it make browsing safer?',
    difficulty: 'easy',
    category: 'Web Security',
    timeLimit: 30,
    expectedKeywords: ['https', 'ssl', 'encryption', 'security', 'certificate'],
  },
  {
    id: 'easy-10',
    text: 'What is the role of a web browser in displaying websites? How does it process HTML, CSS, and JavaScript?',
    difficulty: 'easy',
    category: 'Web Fundamentals',
    timeLimit: 30,
    expectedKeywords: ['browser', 'html', 'css', 'javascript', 'rendering'],
  },

  // Medium Questions Pool (10 questions, pick 2)
  {
    id: 'medium-1',
    text: 'Explain the concept of state management in React applications. When would you choose Redux over Context API and why?',
    difficulty: 'medium',
    category: 'React State Management',
    timeLimit: 60,
    expectedKeywords: ['state', 'redux', 'context', 'global state', 'predictable'],
  },
  {
    id: 'medium-2',
    text: 'What is the difference between authentication and authorization? How would you explain these concepts to a non-technical person?',
    difficulty: 'medium',
    category: 'Security Concepts',
    timeLimit: 60,
    expectedKeywords: ['authentication', 'authorization', 'identity', 'permissions', 'access control'],
  },
  {
    id: 'medium-3',
    text: 'Explain the concept of microservices architecture. What are its advantages and disadvantages compared to monolithic architecture?',
    difficulty: 'medium',
    category: 'Software Architecture',
    timeLimit: 60,
    expectedKeywords: ['microservices', 'monolithic', 'scalability', 'complexity', 'independence'],
  },
  {
    id: 'medium-4',
    text: 'What is DevOps and how has it changed software development? Explain the concept of CI/CD pipelines.',
    difficulty: 'medium',
    category: 'DevOps & Deployment',
    timeLimit: 60,
    expectedKeywords: ['devops', 'ci/cd', 'automation', 'deployment', 'integration'],
  },
  {
    id: 'medium-5',
    text: 'Explain the concept of caching in web applications. What are different types of caching and when would you use each?',
    difficulty: 'medium',
    category: 'Performance Optimization',
    timeLimit: 60,
    expectedKeywords: ['caching', 'browser cache', 'server cache', 'cdn', 'performance'],
  },
  {
    id: 'medium-6',
    text: 'What is the difference between SQL and NoSQL databases? When would you choose one over the other?',
    difficulty: 'medium',
    category: 'Database Design',
    timeLimit: 60,
    expectedKeywords: ['sql', 'nosql', 'relational', 'document', 'scalability', 'consistency'],
  },
  {
    id: 'medium-7',
    text: 'Explain the concept of RESTful APIs. What makes an API RESTful and what are the key principles?',
    difficulty: 'medium',
    category: 'API Design',
    timeLimit: 60,
    expectedKeywords: ['rest', 'stateless', 'http methods', 'resources', 'uniform interface'],
  },
  {
    id: 'medium-8',
    text: 'What is serverless computing and how does it differ from traditional server-based applications? What are its pros and cons?',
    difficulty: 'medium',
    category: 'Cloud Architecture',
    timeLimit: 60,
    expectedKeywords: ['serverless', 'functions', 'scaling', 'cost', 'cold start'],
  },
  {
    id: 'medium-9',
    text: 'Explain the concept of Progressive Web Apps (PWAs). How do they bridge the gap between web and mobile apps?',
    difficulty: 'medium',
    category: 'Modern Web Technologies',
    timeLimit: 60,
    expectedKeywords: ['pwa', 'service worker', 'offline', 'mobile', 'app-like'],
  },
  {
    id: 'medium-10',
    text: 'What is the importance of testing in software development? Explain different types of testing and their purposes.',
    difficulty: 'medium',
    category: 'Software Quality',
    timeLimit: 60,
    expectedKeywords: ['testing', 'unit tests', 'integration', 'quality assurance', 'bugs'],
  },

  // Hard Questions Pool (10 questions, pick 2)
  {
    id: 'hard-1',
    text: 'How would you design a system to handle millions of concurrent users? Discuss scalability strategies, load balancing, and database considerations.',
    difficulty: 'hard',
    category: 'System Design & Scalability',
    timeLimit: 120,
    expectedKeywords: ['scalability', 'load balancing', 'horizontal scaling', 'database sharding', 'caching'],
  },
  {
    id: 'hard-2',
    text: 'Explain the CAP theorem and its implications for distributed systems. How do different databases handle these trade-offs?',
    difficulty: 'hard',
    category: 'Distributed Systems',
    timeLimit: 120,
    expectedKeywords: ['cap theorem', 'consistency', 'availability', 'partition tolerance', 'distributed'],
  },
  {
    id: 'hard-3',
    text: 'What are the key considerations when designing a global content delivery network (CDN)? How would you ensure fast content delivery worldwide?',
    difficulty: 'hard',
    category: 'Network Architecture',
    timeLimit: 120,
    expectedKeywords: ['cdn', 'global distribution', 'edge servers', 'latency', 'caching strategies'],
  },
  {
    id: 'hard-4',
    text: 'How would you approach building a real-time collaborative platform like Google Docs? What are the main technical challenges?',
    difficulty: 'hard',
    category: 'Real-time Systems',
    timeLimit: 120,
    expectedKeywords: ['real-time', 'collaboration', 'conflict resolution', 'websockets', 'operational transform'],
  },
  {
    id: 'hard-5',
    text: 'Explain the concept of eventual consistency in distributed systems. When is it acceptable and what are the trade-offs?',
    difficulty: 'hard',
    category: 'Data Consistency',
    timeLimit: 120,
    expectedKeywords: ['eventual consistency', 'distributed systems', 'trade-offs', 'availability', 'performance'],
  },
  {
    id: 'hard-6',
    text: 'How would you design a recommendation system for a platform like Netflix or Amazon? What algorithms and data would you consider?',
    difficulty: 'hard',
    category: 'Machine Learning Systems',
    timeLimit: 120,
    expectedKeywords: ['recommendation system', 'machine learning', 'collaborative filtering', 'data processing', 'personalization'],
  },
  {
    id: 'hard-7',
    text: 'What are the security considerations when building a financial application? How would you protect against common attacks?',
    difficulty: 'hard',
    category: 'Security Architecture',
    timeLimit: 120,
    expectedKeywords: ['security', 'encryption', 'authentication', 'financial', 'compliance', 'attacks'],
  },
  {
    id: 'hard-8',
    text: 'How would you design a search engine that can index and search billions of web pages? Consider crawling, indexing, and ranking.',
    difficulty: 'hard',
    category: 'Search Systems',
    timeLimit: 120,
    expectedKeywords: ['search engine', 'indexing', 'crawling', 'ranking algorithms', 'distributed processing'],
  },
  {
    id: 'hard-9',
    text: 'Explain the challenges of building a globally distributed database. How would you handle data replication and consistency across continents?',
    difficulty: 'hard',
    category: 'Global Systems',
    timeLimit: 120,
    expectedKeywords: ['global database', 'replication', 'consistency', 'latency', 'data synchronization'],
  },
  {
    id: 'hard-10',
    text: 'How would you architect a system to process and analyze real-time data streams from millions of IoT devices? Consider data ingestion, processing, and storage.',
    difficulty: 'hard',
    category: 'Big Data & IoT',
    timeLimit: 120,
    expectedKeywords: ['iot', 'real-time processing', 'data streams', 'big data', 'analytics', 'scalability'],
  },
];

export const generateInterviewQuestions = async (): Promise<AIQuestion[]> => {
  // Simulate AI thinking time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // AI-powered question selection based on theoretical concepts
  const easyQuestions = THEORETICAL_QUESTIONS.filter(q => q.difficulty === 'easy');
  const mediumQuestions = THEORETICAL_QUESTIONS.filter(q => q.difficulty === 'medium');
  const hardQuestions = THEORETICAL_QUESTIONS.filter(q => q.difficulty === 'hard');
  
  // Intelligent selection - avoid similar categories in same interview
  const selectedEasy = selectDiverseQuestions(easyQuestions, 2);
  const selectedMedium = selectDiverseQuestions(mediumQuestions, 2);
  const selectedHard = selectDiverseQuestions(hardQuestions, 2);
  
  // Return in progressive difficulty order
  return [...selectedEasy, ...selectedMedium, ...selectedHard];
};

// AI-powered diverse question selection to avoid category overlap
const selectDiverseQuestions = (questions: AIQuestion[], count: number): AIQuestion[] => {
  const shuffled = shuffleArray(questions);
  const selected: AIQuestion[] = [];
  const usedCategories = new Set<string>();
  
  // First pass: select questions from different categories
  for (const question of shuffled) {
    if (selected.length >= count) break;
    if (!usedCategories.has(question.category)) {
      selected.push(question);
      usedCategories.add(question.category);
    }
  }
  
  // Second pass: fill remaining slots if needed
  for (const question of shuffled) {
    if (selected.length >= count) break;
    if (!selected.includes(question)) {
      selected.push(question);
    }
  }
  
  return selected;
};

// Helper function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
