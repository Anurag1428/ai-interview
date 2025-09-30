import React, { useState, useEffect } from 'react';
import { Tag, Tooltip } from 'antd';
import { RobotOutlined, BookOutlined } from '@ant-design/icons';

const AIStatusIndicator: React.FC = () => {
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        const { isGeminiConfigured } = await import('../services/geminiService');
        setIsAIEnabled(isGeminiConfigured());
      } catch (error) {
        setIsAIEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAIStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Tooltip
      title={
        isAIEnabled
          ? 'Real AI-powered interviews using Google Gemini Pro'
          : 'Using curated questions and rule-based evaluation'
      }
    >
      <Tag
        icon={isAIEnabled ? <RobotOutlined /> : <BookOutlined />}
        color={isAIEnabled ? 'green' : 'blue'}
        style={{ 
          marginLeft: 8,
          cursor: 'help',
          userSelect: 'none'
        }}
      >
        {isAIEnabled ? 'AI Powered' : 'Curated Mode'}
      </Tag>
    </Tooltip>
  );
};

export default AIStatusIndicator;