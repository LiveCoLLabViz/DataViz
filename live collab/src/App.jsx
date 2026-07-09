import React from 'react';
import { BrowserRouter } from 'react-router-dom';
//BrowserRouter is a router implementation that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL. It is the standard router for React applications that run in the browser. It allows you to define routes and navigate between different components based on the URL, enabling client-side routing in single-page applications (SPAs).
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import { SocketProvider } from './context/SocketContext';
import ErrorBoundary from './components/Common/errorboundary';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SocketProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <AppRoutes />
          </BrowserRouter>
        </SocketProvider>
      </Provider>
    </ErrorBoundary>
  );

  //
}
