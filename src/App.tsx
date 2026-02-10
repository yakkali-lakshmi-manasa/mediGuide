import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';

import routes from './routes';

// import { AuthProvider } from '@/contexts/AuthContext';
// import { RouteGuard } from '@/components/common/RouteGuard';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        {/*<AuthProvider>*/}
        {/*<RouteGuard>*/}
        <IntersectObserver />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster />
        {/*</RouteGuard>*/}
        {/*</AuthProvider>*/}
      </Router>
    </ThemeProvider>
  );
};

export default App;
