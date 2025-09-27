import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Select, Typography, Space, Modal } from 'antd';
import { SearchOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Candidate } from '../store/slices/candidateSlice';
import CandidateDetailModal from './CandidateDetailModal';
import './InterviewerTab.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const InterviewerTab: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.candidates);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'not_started': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'not_started': return 'Not Started';
      default: return 'Unknown';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.interviewStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    // Sort by completion status first, then by score
    if (a.interviewStatus === 'completed' && b.interviewStatus !== 'completed') return -1;
    if (b.interviewStatus === 'completed' && a.interviewStatus !== 'completed') return 1;
    
    if (a.interviewStatus === 'completed' && b.interviewStatus === 'completed') {
      return (b.finalScore || 0) - (a.finalScore || 0);
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (record: Candidate) => (
        <div className="candidate-info">
          <div className="candidate-avatar">
            <UserOutlined />
          </div>
          <div className="candidate-details">
            <Text strong>{record.name}</Text>
            <Text type="secondary" className="candidate-email">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'interviewStatus',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Score',
      key: 'score',
      render: (record: Candidate) => (
        <div className="score-display">
          {record.finalScore ? (
            <Text strong className={`score ${record.finalScore >= 80 ? 'high' : record.finalScore >= 60 ? 'medium' : 'low'}`}>
              {record.finalScore}/100
            </Text>
          ) : (
            <Text type="secondary">-</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (record: Candidate) => {
        const totalQuestions = 6;
        const answeredQuestions = record.answers.length;
        const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
        
        return (
          <div className="progress-display">
            <Text type="secondary">{answeredQuestions}/{totalQuestions}</Text>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Candidate) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCandidate(record);
            setShowDetailModal(true);
          }}
          size="small"
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="interviewer-tab">
      <div className="dashboard-header">
        <Title level={2}>Interview Dashboard</Title>
        <Text type="secondary">
          Manage and review candidate interviews
        </Text>
      </div>

      <Card className="dashboard-card">
        <div className="filters-section">
          <Space size="middle" wrap>
            <Search
              placeholder="Search candidates..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Status</Option>
              <Option value="completed">Completed</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="not_started">Not Started</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={sortedCandidates}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`,
          }}
          className="candidates-table"
        />
      </Card>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          visible={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};

export default InterviewerTab;
