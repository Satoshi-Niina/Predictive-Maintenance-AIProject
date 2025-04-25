import React from 'react';
import { createBrowserRouter, RouterProvider, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import UploadKnowledge from './pages/UploadKnowledge';
import KnowledgeList from './pages/KnowledgeList';
import Analysis from './pages/Analysis';
import History from './pages/History';
import Machines from './pages/Machines';
import { ThemeProvider } from "@/components/theme-provider";

const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Link
          to="/"
          className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

const NavigationBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-blue-800">
              機械故障分析システム
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/machines"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/machines') 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
            >
              機械管理
            </Link>
            <Link
              to="/knowledge"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/knowledge') || isActive('/knowledge/upload')
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
            >
              技術ナレッジ
            </Link>
            <Link
              to="/analysis"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/analysis')
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
            >
              故障分析
            </Link>
            <Link
              to="/history"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/history')
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
            >
              履歴
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto px-6 py-8">
          <Machines />
        </main>
      </div>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  },
  {
    path: '/machines',
    element: (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto px-6 py-8">
          <Machines />
        </main>
      </div>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  },
  {
    path: '/knowledge',
    element: (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto px-6 py-8">
          <KnowledgeList />
        </main>
      </div>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  },
  {
    path: '/knowledge/upload',
    element: (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto px-6 py-8">
          <UploadKnowledge />
        </main>
      </div>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  },
  {
    path: '/analysis',
    element: (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto px-6 py-8">
          <Analysis />
        </main>
      </div>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  },
  {
    path: '/history',
    element: (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <main className="container mx-auto px-6 py-8">
          <History />
        </main>
      </div>
    ),
    errorElement: <ErrorBoundary error={new Error('ページが見つかりません')} />,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

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

export default App;
