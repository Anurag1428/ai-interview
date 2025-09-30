import OpenAI from 'openai';
import { AIQuestion, AIEvaluation } from './aiService';

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Only for demo purposes
});

// Check if OpenAI is configured
const isOpenAIConfigured = () => {
  return !!process.env.REACT_APP_OPENAI_API_KEY;
};

// Generate interview questions using OpenAI
export const generateQuestionsWithAI = async (
  difficulty: 'easy' | 'medium' | 'hard',
  candidateName?: string,
  candidateBackground?: string
): Promise<AIQuestion[]> => {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  const difficultyPrompts = {
    easy: 'beginner-friendly conceptual questions that test basic understanding',
    medium: 'intermediate questions that require deeper knowledge and practical experience',
    hard: 'advanced questions that test system design thinking and complex problem-solving'
  };

  const timeLimit = {
    easy: 30,
    medium: 60,
    hard: 120
  };

  try {
    const prompt = `Generate 2 ${difficulty} level interview questions for a Full Stack Developer position.

Requirements:
- Questions should be theoretical/conceptual, not coding exercises
- Focus on understanding concepts, architecture, and best practices
- Questions should be relevant to modern web development (React, Node.js, databases, system design)
- Each question should test different areas of knowledge
- Make questions conversational and engaging
${candidateName ? `- Candidate name: ${candidateName}` : ''}
${candidateBackground ? `- Consider candidate background: ${candidateBackground}` : ''}

Return ONLY a JSON array with this exact format:
[
  {
    "id": "unique-id-1",
    "text": "Question text here?",
    "difficulty": "${difficulty}",
    "category": "Category Name",
    "timeLimit": ${timeLimit[difficulty]},
    "expectedKeywords": ["keyword1", "keyword2", "keyword3"]
  }
]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer specializing in Full Stack Development. Generate thoughtful, practical interview questions that assess real-world knowledge.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const questions = JSON.parse(content) as AIQuestion[];
    
    // Validate and ensure proper format
    return questions.map((q, index) => ({
      ...q,
      id: q.id || `${difficulty}-ai-${Date.now()}-${index}`,
      difficulty,
      timeLimit: timeLimit[difficulty]
    }));

  } catch (error) {
    console.error('Error generating questions with AI:', error);
    throw new Error('Failed to generate questions with AI');
  }
};

// Evaluate answer using OpenAI
export const evaluateAnswerWithAI = async (
  question: AIQuestion,
  answer: string,
  timeSpent: number
): Promise<AIEvaluation> => {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const prompt = `Evaluate this interview answer for a Full Stack Developer position.

Question (${question.difficulty} level): ${question.text}
Category: ${question.category}
Time Limit: ${question.timeLimit}s
Time Spent: ${timeSpent}s

Candidate's Answer: "${answer}"

Please evaluate and return ONLY a JSON object with this exact format:
{
  "score": 85,
  "feedback": "Detailed feedback about the answer quality, technical accuracy, and completeness.",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"]
}

Scoring criteria:
- Technical accuracy (40%)
- Completeness and depth (30%)
- Communication clarity (20%)
- Time management (10%)

Score range: 0-100 (where 70+ is good, 85+ is excellent)`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer with 10+ years of experience evaluating Full Stack Developer candidates. Provide fair, constructive, and detailed evaluations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent evaluations
      max_tokens: 800
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const evaluation = JSON.parse(content) as AIEvaluation;
    
    // Ensure score is within bounds
    evaluation.score = Math.max(0, Math.min(100, evaluation.score));
    
    return evaluation;

  } catch (error) {
    console.error('Error evaluating answer with AI:', error);
    throw new Error('Failed to evaluate answer with AI');
  }
};

// Generate final interview summary using OpenAI
export const generateFinalSummaryWithAI = async (
  candidateName: string,
  answers: Array<{ question: AIQuestion; answer: string; evaluation: AIEvaluation }>
): Promise<string> => {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  try {
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

Make it professional, constructive, and actionable for both the candidate and hiring team.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a senior technical hiring manager writing interview summaries for Full Stack Developer candidates. Provide professional, balanced, and actionable feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 1200
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return content;

  } catch (error) {
    console.error('Error generating summary with AI:', error);
    throw new Error('Failed to generate summary with AI');
  }
};

export { isOpenAIConfigured };