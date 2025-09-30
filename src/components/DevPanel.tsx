import React from 'react';
import { Button, Space, Typography, Popconfirm } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { clearAllStorageData, hasExistingData } from '../utils/clearStorageData';

const { Text } = Typography;

// Only show in development mode
const DevPanel: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleClearData = () => {
    clearAllStorageData();
    window.location.reload();
  };

  const dataExists = hasExistingData();

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: 8,
      fontSize: '12px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }}>
      <Text style={{ color: 'white', fontSize: '11px' }}>
        DEV: {dataExists ? 'Data exists' : 'Clean state'}
      </Text>
      <Space size="small">
        <Popconfirm
          title="Clear all data?"
          description="This will remove all candidates and sessions"
          onConfirm={handleClearData}
          okText="Clear"
          cancelText="Cancel"
        >
          <Button 
            size="small" 
            type="text" 
            icon={<DeleteOutlined />}
            style={{ color: 'white', fontSize: '10px' }}
          >
            Clear
          </Button>
        </Popconfirm>
        <Button 
          size="small" 
          type="text" 
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
          style={{ color: 'white', fontSize: '10px' }}
        >
          Reload
        </Button>
      </Space>
    </div>
  );
};

export default DevPanel;