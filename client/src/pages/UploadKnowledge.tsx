import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// APIのベースURLを設定
const API_BASE_URL = 'http://localhost:3001';

export default function UploadKnowledge() {
  const [file, setFile] = useState<File | null>(null);
  const [saveOriginal, setSaveOriginal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('ファイルを選択してください');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('saveOriginal', saveOriginal.toString());

    try {
      const response = await axios.post(`${API_BASE_URL}/api/knowledge/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('アップロードが成功しました');
      setError('');
      setFile(null);
      setSaveOriginal(false);
      
      // 3秒後にナレッジ一覧ページにリダイレクト
      setTimeout(() => {
        navigate('/knowledge');
      }, 3000);
    } catch (error) {
      setError('アップロード中にエラーが発生しました');
      setMessage('');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">技術ナレッジのアップロード</h1>
      <p className="text-gray-600 mb-4">
        共通の技術情報をアップロードします。JSON、テキスト、Excelファイルが利用可能です。
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ファイル
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept=".json,.txt,.xlsx,.xls"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveOriginal"
            checked={saveOriginal}
            onChange={(e) => setSaveOriginal(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="saveOriginal" className="ml-2 block text-sm text-gray-700">
            元のファイルを保存する
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          アップロード
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
