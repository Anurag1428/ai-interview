import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, theme } from 'antd';
import { store, persistor, RootState } from './store';
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const ThemedApp: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const lightTheme = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBgLayout: '#f5f5f5',
      colorText: '#000000d9',
      colorTextSecondary: '#00000073',
      colorBorder: '#d9d9d9',
    },
  };

  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
      colorBgContainer: '#1f1f1f',
      colorBgElevated: '#262626',
      colorBgLayout: '#141414',
      colorText: '#ffffffd9',
      colorTextSecondary: '#ffffff73',
      colorBorder: '#434343',
    },
  };

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <AppLayout />
      </div>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemedApp />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
