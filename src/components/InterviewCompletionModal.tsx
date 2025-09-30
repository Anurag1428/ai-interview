import React from 'react';
import { Modal, Result, Button, Typography, Card, Row, Col, Progress } from 'antd';
import { TrophyOutlined, CheckCircleOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentCandidate } from '../store/slices/candidateSlice';
import { setActiveTab } from '../store/slices/uiSlice';

const { Title, Text, Paragraph } = Typography;

interface InterviewCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  candidateName: string;
  finalScore: number;
}

const InterviewCompletionModal: React.FC<InterviewCompletionModalProps> = ({
  visible,
  onClose,
  candidateName,
  finalScore
}) => {
  const dispatch = useDispatch();

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { level: 'Excellent', color: '#52c41a' };
    if (score >= 70) return { level: 'Good', color: '#1890ff' };
    if (score >= 60) return { level: 'Average', color: '#faad14' };
    return { level: 'Needs Improvement', color: '#ff4d4f' };
  };

  const performance = getPerformanceLevel(finalScore);

  const handleStartNewInterview = () => {
    dispatch(setCurrentCandidate(''));
    onClose();
  };

  const handleViewDashboard = () => {
    dispatch(setActiveTab('interviewer'));
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="completion-modal"
    >
      <Result
        icon={<TrophyOutlined style={{ color: performance.color }} />}
        title={
          <Title level={2} style={{ margin: 0 }}>
            Interview Completed Successfully!
          </Title>
        }
        subTitle={
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Congratulations {candidateName}, you've finished all 6 questions
          </Text>
        }
      />

      <Card className="score-card" style={{ margin: '20px 0' }}>
        <Row gutter={24} align="middle">
          <Col span={12}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={finalScore}
                format={percent => `${percent}/100`}
                strokeColor={performance.color}
                size={120}
              />
              <Title level={4} style={{ marginTop: 16, color: performance.color }}>
                {performance.level}
              </Title>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Title level={4}>What's Next?</Title>
              <div style={{ marginBottom: 12 }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text>Your responses have been saved</Text>
              </div>
              <div style={{ marginBottom: 12 }}>
                <MailOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Text>Detailed feedback via email (2-3 days)</Text>
              </div>
              <div>
                <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                <Text>Next round notification (if selected)</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Paragraph style={{ textAlign: 'center', marginBottom: 24 }}>
        <Text type="secondary">
          Thank you for your time and effort. Our AI has analyzed your responses and 
          generated a comprehensive evaluation. Best of luck with your application!
        </Text>
      </Paragraph>

      <div style={{ textAlign: 'center', gap: 12, display: 'flex', justifyContent: 'center' }}>
        <Button size="large" onClick={handleViewDashboard}>
          View Dashboard
        </Button>
        <Button type="primary" size="large" onClick={handleStartNewInterview}>
          Start New Interview
        </Button>
      </div>
    </Modal>
  );
};

export default InterviewCompletionModal;