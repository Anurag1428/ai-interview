import React, { useEffect } from 'react';
import { Layout, Tabs, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setActiveTab, setWelcomeBackModal } from '../store/slices/uiSlice';
import IntervieweeTab from './IntervieweeTab';
import InterviewerTab from './InterviewerTab';
import WelcomeBackModal from './WelcomeBackModal';
import './AppLayout.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { activeTab, showWelcomeBackModal } = useSelector((state: RootState) => state.ui);
  const { currentCandidate } = useSelector((state: RootState) => state.candidates);
  const { currentSession } = useSelector((state: RootState) => state.interviews);

  useEffect(() => {
    // Check if there's an unfinished session on app load
    if (currentCandidate && currentSession && currentSession.isActive && !currentSession.isPaused) {
      dispatch(setWelcomeBackModal(true));
    }
  }, [currentCandidate, currentSession, dispatch]);

  const handleTabChange = (key: string) => {
    dispatch(setActiveTab(key as 'interviewee' | 'interviewer'));
  };

  const tabItems = [
    {
      key: 'interviewee',
      label: 'Interviewee',
      children: <IntervieweeTab />,
    },
    {
      key: 'interviewer',
      label: 'Interviewer Dashboard',
      children: <InterviewerTab />,
    },
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-content">
          <Title level={3} className="app-title">
            AI Interview Assistant
          </Title>
          <div className="header-subtitle">
            Powered by AI • Full Stack Developer Assessment
          </div>
        </div>
      </Header>
      
      <Content className="app-content">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className="main-tabs"
          size="large"
        />
      </Content>

      {showWelcomeBackModal && <WelcomeBackModal />}
    </Layout>
  );
};

export default AppLayout;
