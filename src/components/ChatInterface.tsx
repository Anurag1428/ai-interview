import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Typography, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addChatMessage, setTyping } from '../store/slices/uiSlice';
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
  const { chatMessages, isTyping } = useSelector((state: RootState) => state.ui);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
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

  const handleSubmitAnswer = async () => {
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
          type: 'ai',
          content: 'Congratulations! You have completed all 6 questions. I will now generate your final evaluation and summary.',
        }));

        // Update candidate status
        dispatch(updateCandidate({
          id: currentCandidate.id,
          updates: { interviewStatus: 'completed' }
        }));

        // Generate final summary (mock for now)
        setTimeout(() => {
          dispatch(addChatMessage({
            type: 'ai',
            content: `Interview Complete! Your final score is ${Math.round(
              currentCandidate.answers.reduce((sum, ans) => sum + (ans.score || 0), 0) / 
              Math.max(currentCandidate.answers.length, 1)
            )}/100. Thank you for participating!`,
          }));
        }, 2000);
      }

      setCurrentAnswer('');
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
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
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
                disabled={!currentAnswer.trim()}
                className="submit-btn"
              >
                Submit Answer
              </Button>
            </div>
            <div className="input-footer">
              <Text type="secondary">
                Question {(currentSession?.currentQuestionIndex ?? 0) + 1} of {currentSession?.questions.length ?? 0} • 
                Difficulty: {currentQuestion.difficulty} • 
                Time Limit: {currentQuestion.timeLimit}s
              </Text>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
