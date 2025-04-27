import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  error: Error;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error }) => {
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