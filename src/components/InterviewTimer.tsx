import React, { useEffect, useRef } from 'react';
import { Progress, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateTimer, stopTimer, nextQuestion } from '../store/slices/interviewSlice';
import { addChatMessage } from '../store/slices/uiSlice';
import './InterviewTimer.css';

const { Text } = Typography;

const InterviewTimer: React.FC = () => {
  const dispatch = useDispatch();
  const { timer, currentSession } = useSelector((state: RootState) => state.interviews);
  const { currentCandidate } = useSelector((state: RootState) => state.candidates);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.isActive && timer.timeRemaining > 0) {
      const id = setInterval(() => {
        const newTime = timer.timeRemaining - 1;
        dispatch(updateTimer(newTime));
        
        if (newTime <= 0) {
          dispatch(stopTimer());
          
          if (currentCandidate && currentSession) {
            // Add system message about time up
            dispatch(addChatMessage({
              type: 'system',
              content: 'Time\'s up! Moving to the next question...',
            }));

            // Move to next question
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
              dispatch(updateTimer(nextQ.timeLimit));
            }
          }
        }
      }, 1000);
      
      intervalRef.current = id;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isActive, timer.timeRemaining, dispatch, currentCandidate, currentSession]);


  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (): string => {
    const percentage = (timer.timeRemaining / (currentSession?.questions[currentSession?.currentQuestionIndex ?? 0]?.timeLimit || 1)) * 100;
    if (percentage > 50) return '#52c41a';
    if (percentage > 25) return '#faad14';
    return '#ff4d4f';
  };

  const getCurrentQuestion = () => {
    if (!currentSession || currentSession.currentQuestionIndex >= currentSession.questions.length) {
      return null;
    }
    return currentSession.questions[currentSession.currentQuestionIndex];
  };

  const currentQuestion = getCurrentQuestion();
  const progressPercentage = currentQuestion 
    ? ((timer.timeRemaining / currentQuestion.timeLimit) * 100)
    : 0;

  if (!timer.isActive || !currentQuestion) {
    return null;
  }

  return (
    <div className="interview-timer">
      <div className="timer-content">
        <div className="timer-info">
          <Text strong className="time-display">
            {formatTime(timer.timeRemaining)}
          </Text>
          <Text type="secondary" className="question-info">
            {currentQuestion.difficulty.toUpperCase()} • Q{(currentSession?.currentQuestionIndex ?? 0) + 1}/6
          </Text>
        </div>
        <div className="timer-progress">
          <Progress
            percent={progressPercentage}
            strokeColor={getProgressColor()}
            showInfo={false}
            strokeWidth={6}
            className="progress-bar"
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewTimer;
