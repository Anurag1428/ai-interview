import React from 'react';
import { Switch, Tooltip, Space, Typography } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleDarkMode } from '../store/slices/uiSlice';

const { Text } = Typography;

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <Space align="center" size="small">
        <Text 
          style={{ 
            fontSize: '12px', 
            color: isDarkMode ? '#999' : '#666',
            transition: 'color 0.3s ease'
          }}
        >
          {isDarkMode ? 'Dark' : 'Light'}
        </Text>
        <Switch
          checked={isDarkMode}
          onChange={handleToggle}
          checkedChildren={<MoonOutlined style={{ fontSize: '12px' }} />}
          unCheckedChildren={<SunOutlined style={{ fontSize: '12px' }} />}
          size="small"
          style={{
            backgroundColor: isDarkMode ? '#1890ff' : '#d9d9d9',
            transition: 'background-color 0.3s ease',
          }}
        />
      </Space>
    </Tooltip>
  );
};

export default ThemeToggle;