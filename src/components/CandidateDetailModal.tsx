import React from 'react';
import { Modal, Typography, Card, Tag, Progress, Divider, Timeline } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Candidate } from '../store/slices/candidateSlice';
import './CandidateDetailModal.css';

const { Title, Text, Paragraph } = Typography;

interface CandidateDetailModalProps {
  candidate: Candidate;
  visible: boolean;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  visible,
  onClose,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const calculateOverallScore = () => {
    if (candidate.answers.length === 0) return 0;
    const totalScore = candidate.answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
    return Math.round(totalScore / candidate.answers.length);
  };

  const overallScore = calculateOverallScore();

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="candidate-detail-modal"
    >
      <div className="modal-content">
        <div className="candidate-header">
          <div className="candidate-avatar-large">
            <UserOutlined />
          </div>
          <div className="candidate-info">
            <Title level={3} className="candidate-name">
              {candidate.name}
            </Title>
            <div className="contact-info">
              <div className="contact-item">
                <MailOutlined />
                <Text>{candidate.email}</Text>
              </div>
              <div className="contact-item">
                <PhoneOutlined />
                <Text>{candidate.phone}</Text>
              </div>
            </div>
          </div>
          <div className="score-section">
            <div className="overall-score">
              <Text className="score-label">Overall Score</Text>
              <Text className="score-value" style={{ color: getScoreColor(overallScore) }}>
                {overallScore}/100
              </Text>
            </div>
            <Progress
              type="circle"
              percent={overallScore}
              strokeColor={getScoreColor(overallScore)}
              size={80}
            />
          </div>
        </div>

        <Divider />

        <div className="interview-details">
          <Title level={4}>Interview Details</Title>
          <div className="details-grid">
            <div className="detail-item">
              <Text strong>Status:</Text>
              <Tag color={candidate.interviewStatus === 'completed' ? 'green' : 
                         candidate.interviewStatus === 'in_progress' ? 'blue' : 'default'}>
                {candidate.interviewStatus === 'completed' ? 'Completed' :
                 candidate.interviewStatus === 'in_progress' ? 'In Progress' : 'Not Started'}
              </Tag>
            </div>
            <div className="detail-item">
              <Text strong>Questions Answered:</Text>
              <Text>{candidate.answers.length} of 6</Text>
            </div>
            <div className="detail-item">
              <Text strong>Started:</Text>
              <Text>{new Date(candidate.createdAt).toLocaleString()}</Text>
            </div>
            <div className="detail-item">
              <Text strong>Last Active:</Text>
              <Text>{new Date(candidate.lastActiveAt).toLocaleString()}</Text>
            </div>
          </div>
        </div>

        {candidate.answers.length > 0 && (
          <>
            <Divider />
            <div className="answers-section">
              <Title level={4}>Question & Answers</Title>
              <Timeline>
                {candidate.answers.map((answer, index) => (
                  <Timeline.Item
                    key={answer.questionId}
                    color={getScoreColor(answer.score || 0)}
                  >
                    <Card className="answer-card">
                      <div className="answer-header">
                        <div className="question-info">
                          <Text strong>Question {index + 1}</Text>
                          <Tag color={getDifficultyColor(answer.difficulty)}>
                            {answer.difficulty.toUpperCase()}
                          </Tag>
                        </div>
                        <div className="answer-score">
                          <Text strong style={{ color: getScoreColor(answer.score || 0) }}>
                            {answer.score}/100
                          </Text>
                        </div>
                      </div>
                      
                      <div className="question-text">
                        <Text type="secondary">Question:</Text>
                        <Paragraph>{answer.question}</Paragraph>
                      </div>
                      
                      <div className="answer-text">
                        <Text type="secondary">Answer:</Text>
                        <Paragraph>{answer.answer}</Paragraph>
                      </div>
                      
                      {answer.feedback && (
                        <div className="feedback">
                          <Text type="secondary">AI Feedback:</Text>
                          <Paragraph>{answer.feedback}</Paragraph>
                        </div>
                      )}
                      
                      <div className="answer-meta">
                        <Text type="secondary">
                          <ClockCircleOutlined /> Time spent: {answer.timeSpent}s
                        </Text>
                      </div>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </>
        )}

        {candidate.summary && (
          <>
            <Divider />
            <div className="summary-section">
              <Title level={4}>AI Summary</Title>
              <Card className="summary-card">
                <Paragraph>{candidate.summary}</Paragraph>
              </Card>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CandidateDetailModal;
