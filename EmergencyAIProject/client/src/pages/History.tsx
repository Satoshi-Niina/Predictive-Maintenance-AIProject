import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5500/api/history')
      .then(res => {
        console.log('API Response:', res.data); // デバッグ用ログ
        setEntries(res.data);
      })
      .catch(err => {
        console.error('API Error:', err); // エラーログ
      });
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">履歴一覧</h2>
        {entries.map((entry, i) => (
          <div key={i} className="mb-4 p-4 border rounded bg-gray-50">
            <div className="text-sm text-gray-500">{entry.timestamp}</div>
            <div><strong>質問:</strong> {entry.query}</div>
            <div><strong>応答:</strong> {entry.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
