import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Typography, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addChatMessage, setTyping, setDraftAnswer, clearDraftAnswer } from '../store/slices/uiSlice';
import { addAnswer, updateCandidate } from '../store/slices/candidateSlice';
import { nextQuestion, setTimer, stopTimer } from '../store/slices/interviewSlice';
import { evaluateAnswer } from '../services/aiService';
import { Answer } from '../store/slices/candidateSlice';
import { AIQuestion } from '../services/aiService';
import './ChatInterface.css';

const { TextArea } = Input;
const { Text } = Typography;

const ChatInterface: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate } = useSelector((state: RootState) => state.candidates);
  const { currentSession, timer } = useSelector((state: RootState) => state.interviews);
  const { chatMessages, isTyping, currentDraftAnswer, draftAnswerQuestionId } = useSelector((state: RootState) => state.ui);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const getCurrentQuestion = (): AIQuestion | null => {
    if (!currentSession || currentSession.currentQuestionIndex >= currentSession.questions.length) {
      return null;
    }
    return currentSession.questions[currentSession.currentQuestionIndex];
  };

  // Get the current answer - either from draft or empty
  const getCurrentAnswer = (): string => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion && draftAnswerQuestionId === currentQuestion.id) {
      return currentDraftAnswer;
    }
    return '';
  };

  // Handle answer change with persistence
  const handleAnswerChange = (value: string) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      dispatch(setDraftAnswer({ answer: value, questionId: currentQuestion.id }));
    }
  };

  const handleSubmitAnswer = async () => {
    const currentAnswer = getCurrentAnswer();
    if (!currentAnswer.trim() || !currentCandidate || !currentSession) return;

    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    setIsSubmitting(true);
    dispatch(setTyping(true));
    dispatch(stopTimer());

    try {
      // Add user's answer to chat
      dispatch(addChatMessage({
        type: 'user',
        content: currentAnswer,
      }));

      // Evaluate the answer
      const evaluation = await evaluateAnswer(
        currentQuestion,
        currentAnswer,
        currentQuestion.timeLimit - timer.timeRemaining
      );

      // Save the answer
      const answer: Answer = {
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: currentAnswer,
        difficulty: currentQuestion.difficulty,
        timeSpent: currentQuestion.timeLimit - timer.timeRemaining,
        score: evaluation.score,
        feedback: evaluation.feedback,
      };

      dispatch(addAnswer({ candidateId: currentCandidate.id, answer }));

      // Add AI feedback to chat
      dispatch(addChatMessage({
        type: 'ai',
        content: `Great! I've evaluated your answer. Score: ${evaluation.score}/100. ${evaluation.feedback}`,
      }));

      // Move to next question or end interview
      if (currentSession && currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
        dispatch(nextQuestion());
        const nextQuestionIndex = currentSession.currentQuestionIndex + 1;
        const nextQ = currentSession.questions[nextQuestionIndex];
        
        dispatch(addChatMessage({
          type: 'ai',
          content: `Question ${nextQuestionIndex + 1} of 6 (${nextQ.difficulty}): ${nextQ.text}`,
          metadata: {
            questionId: nextQ.id,
            difficulty: nextQ.difficulty,
            timeRemaining: nextQ.timeLimit,
          },
        }));

        // Start timer for next question
        dispatch(setTimer({ timeRemaining: nextQ.timeLimit, questionId: nextQ.id }));
      } else {
        // Interview completed
        dispatch(addChatMessage({
          type: 'system',
          content: '🎉 Congratulations! You have successfully completed all 6 questions!',
        }));

        dispatch(addChatMessage({
          type: 'ai',
          content: 'Thank you for participating in this AI-powered interview. I am now analyzing your responses and generating your comprehensive evaluation report. This may take a moment...',
        }));

        // Update candidate status
        dispatch(updateCandidate({
          id: currentCandidate.id,
          updates: { interviewStatus: 'completed' }
        }));

        // Generate detailed final summary
        setTimeout(() => {
          const finalScore = Math.round(
            currentCandidate.answers.reduce((sum, ans) => sum + (ans.score || 0), 0) / 
            Math.max(currentCandidate.answers.length, 1)
          );
          
          let performanceLevel = '';
          let recommendation = '';
          
          if (finalScore >= 85) {
            performanceLevel = 'Excellent';
            recommendation = 'Strong candidate - Highly recommended for next round';
          } else if (finalScore >= 70) {
            performanceLevel = 'Good';
            recommendation = 'Solid candidate - Recommended for next round';
          } else if (finalScore >= 60) {
            performanceLevel = 'Average';
            recommendation = 'Consider for next round with additional evaluation';
          } else {
            performanceLevel = 'Needs Improvement';
            recommendation = 'Additional training recommended';
          }

          dispatch(addChatMessage({
            type: 'system',
            content: `📊 INTERVIEW RESULTS FOR ${currentCandidate.name.toUpperCase()}

🎯 Final Score: ${finalScore}/100
📈 Performance Level: ${performanceLevel}
💼 Recommendation: ${recommendation}

📋 Next Steps:
• Your responses have been saved and will be reviewed by our hiring team
• You will receive detailed feedback via email within 2-3 business days
• If selected, you'll be contacted for the next round of interviews

Thank you for your time and effort. Best of luck! 🚀`,
          }));
        }, 3000);
      }

      // Clear the draft answer after successful submission
      dispatch(clearDraftAnswer());
    } catch (error) {
      message.error('Failed to submit answer. Please try again.');
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
      dispatch(setTyping(false));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const isInterviewComplete = currentCandidate?.interviewStatus === 'completed';
  const currentQuestion = getCurrentQuestion();

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
              {msg.metadata?.timeRemaining && (
                <div className="message-timer">
                  Time: {msg.metadata.timeRemaining}s
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {!isInterviewComplete && currentQuestion && (
        <div className="chat-input">
          <Card className="input-card">
            <div className="input-container">
              <TextArea
                value={getCurrentAnswer()}
                onChange={(e) => handleAnswerChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Answer the ${currentQuestion.difficulty} question...`}
                autoSize={{ minRows: 3, maxRows: 6 }}
                disabled={isSubmitting}
                className="answer-input"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmitAnswer}
                loading={isSubmitting}
                disabled={!getCurrentAnswer().trim()}
                className="submit-btn"
              >
                Submit Answer
              </Button>
            </div>
            <div className="input-footer">
              <div className="footer-left">
                <Text type="secondary">
                  Question {(currentSession?.currentQuestionIndex ?? 0) + 1} of {currentSession?.questions.length ?? 0} • 
                  Difficulty: {currentQuestion.difficulty} • 
                  Time Limit: {currentQuestion.timeLimit}s
                </Text>
              </div>
              {getCurrentAnswer().trim() && (
                <div className="footer-right">
                  <Text type="secondary" className="draft-indicator">
                    ✓ Draft saved
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
