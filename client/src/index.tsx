import './assets/scss/custom.scss';
import './assets/css/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';
import AuthProvider from './context/AuthProvider';
import SystemProvider from './context/SystemProvider';
import AlertProvider from './context/AlertProvider';
import reportWebVitals from './reportWebVitals';
import ConfirmProvider from './context/ConfirmProvider';
import ErrorBoundary from './components/ErrorBoundary';
import SocketProvider from './context/SocketProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SocketProvider>
          <SystemProvider>
            <ConfirmProvider>
              <AlertProvider>
                <AuthProvider>
                  <Routes>
                    <Route path='/*' element={<App />} />
                  </Routes>
                </AuthProvider>
              </AlertProvider>
            </ConfirmProvider>
          </SystemProvider>
        </SocketProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
