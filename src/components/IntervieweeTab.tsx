import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateCandidate } from '../store/slices/candidateSlice';
import { startInterview, setGeneratingQuestions, setTimer } from '../store/slices/interviewSlice';
import { addChatMessage, setTyping } from '../store/slices/uiSlice';
import { generateInterviewQuestions } from '../services/aiService';
import ResumeUpload from './ResumeUpload';
import ChatInterface from './ChatInterface';
import InterviewTimer from './InterviewTimer';
import './IntervieweeTab.css';

const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate } = useSelector((state: RootState) => state.candidates);
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  const handleResumeUploadComplete = async (candidateId: string) => {
    setIsStartingInterview(true);
    dispatch(setTyping(true));
    
    try {
      // Generate interview questions
      dispatch(setGeneratingQuestions(true));
      const questions = await generateInterviewQuestions();
      
      // Use current candidate ID if 'current' is passed
      const actualCandidateId = candidateId === 'current' ? currentCandidate?.id : candidateId;
      
      if (!actualCandidateId) {
        throw new Error('No candidate found');
      }
      
      // Start the interview
      dispatch(startInterview({ candidateId: actualCandidateId, questions }));
      
      // Update candidate status to in_progress
      dispatch(updateCandidate({ id: actualCandidateId, updates: { interviewStatus: 'in_progress' } }));
      
      // Add welcome message
      dispatch(addChatMessage({
        type: 'ai',
        content: `Hello ${currentCandidate?.name}! Welcome to your AI-powered interview for the Full Stack Developer position. I'll be asking you 6 questions covering React, Node.js, and system design. Let's begin!`,
      }));
      
      // Add first question
      if (questions.length > 0) {
        dispatch(addChatMessage({
          type: 'ai',
          content: `Question 1 of 6 (${questions[0].difficulty}): ${questions[0].text}`,
          metadata: {
            questionId: questions[0].id,
            difficulty: questions[0].difficulty,
            timeRemaining: questions[0].timeLimit,
          },
        }));
        
        // Start timer for first question
        dispatch(setTimer({ timeRemaining: questions[0].timeLimit, questionId: questions[0].id }));
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      dispatch(setGeneratingQuestions(false));
      dispatch(setTyping(false));
      setIsStartingInterview(false);
    }
  };

  const renderContent = () => {
    if (!currentCandidate) {
      return (
        <div className="interviewee-content">
          <div className="welcome-section">
            <h2>Welcome to AI Interview Assistant</h2>
            <p>Upload your resume to get started with your interview process.</p>
            <ResumeUpload onComplete={handleResumeUploadComplete} />
          </div>
        </div>
      );
    }

    if (currentCandidate.interviewStatus === 'not_started') {
      return (
        <div className="interviewee-content">
          <div className="ready-section">
            <h2>Ready to Start Your Interview?</h2>
            <p>Your profile has been created. Click below to begin your interview.</p>
            <button 
              className="start-interview-btn"
              onClick={() => handleResumeUploadComplete('current')}
              disabled={isStartingInterview}
            >
              {isStartingInterview ? 'Starting Interview...' : 'Start Interview'}
            </button>
          </div>
        </div>
      );
    }

    if (currentCandidate.interviewStatus === 'in_progress' || currentCandidate.interviewStatus === 'completed') {
      return (
        <div className="interviewee-content">
          <div className="interview-container">
            <div className="interview-header">
              <h3>Interview in Progress</h3>
              <InterviewTimer />
            </div>
            <ChatInterface />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="interviewee-tab">
      {renderContent()}
    </div>
  );
};

export default IntervieweeTab;
