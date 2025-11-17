import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './core/theme';
import { GlobalStyle } from './core/theme/GlobalStyle';
import AppRouter from './core/router';
import { useCSRF } from './core/hooks/useCSRF';

function App() {
  // CSRF 토큰 초기화
  useCSRF();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;