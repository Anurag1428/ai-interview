import React from 'react';
import { Spin } from 'antd';
import './CustomLoader.css';

interface CustomLoaderProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
}

const CustomLoader: React.FC<CustomLoaderProps> = ({ 
  message = 'Loading...', 
  size = 'default' 
}) => {
  return (
    <div className="custom-loader">
      <div className="loader-content">
        <div className="brain-animation">
          <div className="brain-dot dot-1"></div>
          <div className="brain-dot dot-2"></div>
          <div className="brain-dot dot-3"></div>
        </div>
        <Spin size={size} />
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default CustomLoader;