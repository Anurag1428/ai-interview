import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { TrophyOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './AnalyticsDashboard.css';

const { Title, Text } = Typography;

const AnalyticsDashboard: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.candidates);
  
  // Calculate analytics
  const totalCandidates = candidates.length;
  const completedInterviews = candidates.filter(c => c.interviewStatus === 'completed').length;
  const inProgressInterviews = candidates.filter(c => c.interviewStatus === 'in_progress').length;
  const averageScore = candidates.length > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + (c.finalScore || 0), 0) / candidates.length)
    : 0;
  
  const completionRate = totalCandidates > 0 ? Math.round((completedInterviews / totalCandidates) * 100) : 0;
  
  // Score distribution
  const highPerformers = candidates.filter(c => (c.finalScore || 0) >= 80).length;
  const mediumPerformers = candidates.filter(c => (c.finalScore || 0) >= 60 && (c.finalScore || 0) < 80).length;
  const lowPerformers = candidates.filter(c => (c.finalScore || 0) < 60 && c.finalScore !== null).length;
  
  return (
    <div className="analytics-dashboard">
      <Title level={3} className="dashboard-title">Interview Analytics</Title>
      
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Candidates"
              value={totalCandidates}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed"
              value={completedInterviews}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="In Progress"
              value={inProgressInterviews}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Average Score"
              value={averageScore}
              suffix="/ 100"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: averageScore >= 70 ? '#52c41a' : averageScore >= 50 ? '#faad14' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} md={12}>
          <Card title="Completion Rate" className="chart-card">
            <div className="progress-container">
              <Progress
                type="circle"
                percent={completionRate}
                format={percent => `${percent}%`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={120}
              />
              <Text type="secondary" className="progress-text">
                {completedInterviews} of {totalCandidates} interviews completed
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Performance Distribution" className="chart-card">
            <div className="performance-bars">
              <div className="performance-item">
                <Text>High Performers (80+)</Text>
                <Progress 
                  percent={totalCandidates > 0 ? (highPerformers / totalCandidates) * 100 : 0} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
                <Text type="secondary">{highPerformers} candidates</Text>
              </div>
              
              <div className="performance-item">
                <Text>Medium Performers (60-79)</Text>
                <Progress 
                  percent={totalCandidates > 0 ? (mediumPerformers / totalCandidates) * 100 : 0} 
                  strokeColor="#faad14"
                  showInfo={false}
                />
                <Text type="secondary">{mediumPerformers} candidates</Text>
              </div>
              
              <div className="performance-item">
                <Text>Needs Improvement (&lt;60)</Text>
                <Progress 
                  percent={totalCandidates > 0 ? (lowPerformers / totalCandidates) * 100 : 0} 
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
                <Text type="secondary">{lowPerformers} candidates</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;