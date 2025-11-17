/**
 * 앱 전체 Provider들
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { GlobalStyle } from '../theme/GlobalStyle';
import ErrorBoundary from '../error/ErrorBoundary';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default AppProvider;
