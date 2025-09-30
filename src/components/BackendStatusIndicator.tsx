import React, { useState, useEffect } from 'react';
import { Tag, Tooltip } from 'antd';
import { DatabaseOutlined, CloudOutlined } from '@ant-design/icons';
import { isBackendAvailable } from '../services/backendService';

const BackendStatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const available = await isBackendAvailable();
        setIsConnected(available);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBackendStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Tooltip
      title={
        isConnected
          ? 'Connected to MongoDB backend - Data is persisted'
          : 'Using local storage - Data is temporary'
      }
    >
      <Tag
        icon={isConnected ? <DatabaseOutlined /> : <CloudOutlined />}
        color={isConnected ? 'green' : 'orange'}
        style={{ 
          marginLeft: 8,
          cursor: 'help',
          userSelect: 'none'
        }}
      >
        {isConnected ? 'Database' : 'Local Storage'}
      </Tag>
    </Tooltip>
  );
};

export default BackendStatusIndicator;