import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = '/api';

interface KnowledgeItem {
  id: string;
  filename: string;
  type: string;
  uploadedAt: string;
  content: any;
}

interface DiffItem {
  timestamp: number;
  fileName: string;
  differences: Array<{
    value: string;
    added: boolean;
    removed: boolean;
  }>;
}

export default function KnowledgeList() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [knowledgeResponse, diffsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/knowledge`),
        axios.get(`${API_BASE_URL}/knowledge/diffs`)
      ]);
      setKnowledge(knowledgeResponse.data.knowledge);
      setDiffs(diffsResponse.data.diffs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('データの取得に失敗しました');
      setLoading(false);
    }
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'txt':
        return 'テキストファイル';
      case 'json':
        return 'JSONファイル';
      case 'xlsx':
      case 'xls':
        return 'Excelファイル';
      default:
        return 'その他のファイル';
    }
  };

  const getDisplayName = (item: KnowledgeItem): string => {
    const fileType = getFileType(item.filename);
    const uploadDate = new Date(item.uploadedAt);
    const dateStr = uploadDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return `${fileType} - ${dateStr}`;
  };

  const renderDiff = (diff: DiffItem) => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">変更履歴 - {new Date(diff.timestamp).toLocaleString('ja-JP')}</h4>
        <div className="space-y-1">
          {diff.differences.map((part, index) => (
            <div
              key={index}
              className={`font-mono text-sm ${
                part.added
                  ? 'bg-green-100 text-green-800'
                  : part.removed
                  ? 'bg-red-100 text-red-800'
                  : 'text-gray-600'
              }`}
            >
              {part.added && '+ '}
              {part.removed && '- '}
              {part.value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">技術ナレッジ一覧</h1>
        <Link
          to="/knowledge/upload"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          新規アップロード
        </Link>
      </div>

      {knowledge.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">アップロードされたナレッジはありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {knowledge.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{getDisplayName(item)}</h3>
                  <p className="text-sm text-gray-500">
                    元のファイル名: {item.filename}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {diffs.some(diff => diff.fileName === item.filename) && (
                    <button
                      onClick={() => setShowDiff(showDiff === item.id ? null : item.id)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                    >
                      {showDiff === item.id ? '差分を隠す' : '差分を表示'}
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200"
                  >
                    {expandedId === item.id ? '閉じる' : '詳細表示'}
                  </button>
                </div>
              </div>
              {showDiff === item.id && (
                <div>
                  {diffs
                    .filter(diff => diff.fileName === item.filename)
                    .map((diff, index) => renderDiff(diff))}
                </div>
              )}
              {expandedId === item.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {typeof item.content === 'string'
                      ? item.content
                      : JSON.stringify(item.content, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 