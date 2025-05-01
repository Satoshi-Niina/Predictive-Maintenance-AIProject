import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from './components/ErrorBoundary';
import FaultAnalysis from './pages/FaultAnalysis';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', element: <Login /> },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  },
  {
    path: '/fault-analysis',
    element: (
      <PrivateRoute>
        <FaultAnalysis />
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  }
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default React.memo(App);
