import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIQuestion, AIEvaluation } from './aiService';

// Gemini configuration
const API_KEY = 'AIzaSyDpysE3ZKK2DwRReY0LPPVBL1e8mSKEleE';
const genAI = new GoogleGenerativeAI(API_KEY);

// Check if Gemini is configured
const isGeminiConfigured = () => {
  return !!API_KEY;
};

// Generate interview questions using Gemini
export const generateQuestionsWithGemini = async (
  difficulty: 'easy' | 'medium' | 'hard',
  candidateName?: string,
  candidateBackground?: string
): Promise<AIQuestion[]> => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key not configured');
  }

  const timeLimit = {
    easy: 30,
    medium: 60,
    hard: 120
  };

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(7);
    
    const prompt = `Generate 2 UNIQUE ${difficulty} level interview questions for a Full Stack Developer position.

UNIQUENESS REQUIREMENTS:
- Use timestamp: ${timestamp} and seed: ${randomSeed} to ensure uniqueness
- Questions must be completely different from standard interview questions
- Avoid common questions like "What is React?" or "Explain closures"
- Create fresh, innovative questions that test deep understanding
- Each question should explore different technical domains

CONTENT REQUIREMENTS:
- Questions should be theoretical/conceptual, not coding exercises
- Focus on understanding concepts, architecture, and best practices
- Questions should be relevant to modern web development (React, Node.js, databases, system design)
- Each question should test different areas of knowledge
- Make questions conversational and engaging
- Include real-world scenarios and problem-solving aspects
${candidateName ? `- Personalize for candidate: ${candidateName}` : ''}
${candidateBackground ? `- Consider background: ${candidateBackground}` : ''}

Return ONLY a JSON array with this exact format (no markdown, no extra text):
[
  {
    "id": "unique-id-1",
    "text": "Question text here?",
    "difficulty": "${difficulty}",
    "category": "Category Name",
    "timeLimit": ${timeLimit[difficulty]},
    "expectedKeywords": ["keyword1", "keyword2", "keyword3"]
  },
  {
    "id": "unique-id-2", 
    "text": "Second question text here?",
    "difficulty": "${difficulty}",
    "category": "Another Category",
    "timeLimit": ${timeLimit[difficulty]},
    "expectedKeywords": ["keyword4", "keyword5", "keyword6"]
  }
]`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No response from Gemini');
    }

    // Clean the response - remove markdown formatting if present
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse the JSON response
    const questions = JSON.parse(cleanContent) as AIQuestion[];
    
    // Validate and ensure proper format
    return questions.map((q, index) => ({
      ...q,
      id: q.id || `${difficulty}-gemini-${Date.now()}-${index}`,
      difficulty,
      timeLimit: timeLimit[difficulty]
    }));

  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw new Error('Failed to generate questions with Gemini AI');
  }
};

// Evaluate answer using Gemini
export const evaluateAnswerWithGemini = async (
  question: AIQuestion,
  answer: string,
  timeSpent: number
): Promise<AIEvaluation> => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a senior technical interviewer with 15+ years of experience. Evaluate this Full Stack Developer interview answer with professional rigor.

QUESTION DETAILS:
- Difficulty: ${question.difficulty}
- Question: ${question.text}
- Category: ${question.category}
- Time Limit: ${question.timeLimit}s
- Time Spent: ${timeSpent}s

CANDIDATE'S ANSWER:
"${answer}"

EVALUATION CRITERIA (Be strict but fair):
1. Technical Accuracy (40%): Is the information correct? Are there any technical errors?
2. Completeness & Depth (30%): Does the answer cover all aspects? Shows deep understanding?
3. Communication Clarity (20%): Is the explanation clear and well-structured?
4. Time Management (10%): Appropriate use of time given the complexity?

SCORING GUIDELINES:
- 90-100: Exceptional answer, hire immediately
- 80-89: Strong answer, very good candidate
- 70-79: Good answer, meets requirements
- 60-69: Average answer, needs improvement
- 50-59: Below average, significant gaps
- 0-49: Poor answer, major concerns

ADDITIONAL CONSIDERATIONS:
- Look for practical experience indicators
- Check for understanding of best practices
- Evaluate problem-solving approach
- Consider real-world application knowledge

Return ONLY a JSON object with this exact format (no markdown, no extra text):
{
  "score": 85,
  "feedback": "Comprehensive feedback covering technical accuracy, depth of understanding, and areas for improvement. Be specific and constructive.",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No response from Gemini');
    }

    // Clean the response - remove markdown formatting if present
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const evaluation = JSON.parse(cleanContent) as AIEvaluation;
    
    // Ensure score is within bounds
    evaluation.score = Math.max(0, Math.min(100, evaluation.score));
    
    return evaluation;

  } catch (error) {
    console.error('Error evaluating answer with Gemini:', error);
    throw new Error('Failed to evaluate answer with Gemini AI');
  }
};

// Generate final interview summary using Gemini
export const generateFinalSummaryWithGemini = async (
  candidateName: string,
  answers: Array<{ question: AIQuestion; answer: string; evaluation: AIEvaluation }>
): Promise<string> => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const totalScore = answers.reduce((sum, item) => sum + item.evaluation.score, 0);
    const averageScore = Math.round(totalScore / answers.length);

    const interviewData = answers.map((item, index) => ({
      questionNumber: index + 1,
      difficulty: item.question.difficulty,
      category: item.question.category,
      question: item.question.text,
      answer: item.answer.substring(0, 200) + (item.answer.length > 200 ? '...' : ''),
      score: item.evaluation.score,
      strengths: item.evaluation.strengths,
      improvements: item.evaluation.improvements
    }));

    const prompt = `Generate a comprehensive interview summary for ${candidateName}.

Interview Results:
${JSON.stringify(interviewData, null, 2)}

Overall Score: ${averageScore}/100

Please provide a professional interview summary that includes:
1. Overall performance assessment
2. Key strengths demonstrated
3. Areas for improvement
4. Hiring recommendation
5. Technical competency evaluation

Make it professional, constructive, and actionable for both the candidate and hiring team.
Write in a clear, structured format with proper headings and bullet points.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No response from Gemini');
    }

    return content;

  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    throw new Error('Failed to generate summary with Gemini AI');
  }
};

export { isGeminiConfigured };
