import React from 'react';
import { Modal, Button, Typography, Card } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setWelcomeBackModal } from '../store/slices/uiSlice';
import { resumeInterview } from '../store/slices/interviewSlice';
import { setActiveTab } from '../store/slices/uiSlice';
import './WelcomeBackModal.css';

const { Title, Text } = Typography;

const WelcomeBackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { showWelcomeBackModal } = useSelector((state: RootState) => state.ui);
  const { currentCandidate } = useSelector((state: RootState) => state.candidates);
  const { currentSession } = useSelector((state: RootState) => state.interviews);

  const handleResume = () => {
    if (currentSession) {
      dispatch(resumeInterview());
      dispatch(setActiveTab('interviewee'));
    }
    dispatch(setWelcomeBackModal(false));
  };

  const handleStartOver = () => {
    // Reset the interview session
    dispatch(setWelcomeBackModal(false));
    dispatch(setActiveTab('interviewee'));
  };

  const getProgressInfo = () => {
    if (!currentSession || !currentCandidate) return null;
    
    const totalQuestions = currentSession?.questions.length ?? 0;
    const currentQuestion = (currentSession?.currentQuestionIndex ?? 0) + 1;
    const completedAnswers = currentCandidate.answers.length;
    
    return {
      currentQuestion,
      totalQuestions,
      completedAnswers,
      progress: Math.round((completedAnswers / totalQuestions) * 100),
    };
  };

  const progressInfo = getProgressInfo();

  return (
    <Modal
      title={null}
      open={showWelcomeBackModal}
      onCancel={() => dispatch(setWelcomeBackModal(false))}
      footer={null}
      centered
      width={500}
      className="welcome-back-modal"
    >
      <div className="modal-content">
        <div className="welcome-icon">
          <ClockCircleOutlined />
        </div>
        
        <Title level={3} className="welcome-title">
          Welcome Back, {currentCandidate?.name}!
        </Title>
        
        <Text type="secondary" className="welcome-subtitle">
          You have an unfinished interview session. Would you like to continue where you left off?
        </Text>

        {progressInfo && (
          <Card className="progress-card">
            <div className="progress-info">
              <div className="progress-item">
                <Text strong>Progress:</Text>
                <Text>{progressInfo.completedAnswers} of {progressInfo.totalQuestions} questions answered</Text>
              </div>
              <div className="progress-item">
                <Text strong>Current Question:</Text>
                <Text>Question {progressInfo.currentQuestion}</Text>
              </div>
              <div className="progress-item">
                <Text strong>Completion:</Text>
                <Text>{progressInfo.progress}%</Text>
              </div>
            </div>
          </Card>
        )}

        <div className="modal-actions">
          <Button 
            size="large" 
            onClick={handleStartOver}
            className="start-over-btn"
          >
            Start Over
          </Button>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlayCircleOutlined />}
            onClick={handleResume}
            className="resume-btn"
          >
            Resume Interview
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;
