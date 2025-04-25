import React, { useState } from 'react';
import axios from 'axios';

const RequestResponseView = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    const res = await axios.post('http://localhost:5500/api/ask', { query: input });
    setResponse(res.data.answer);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">AI分析・応答</h2>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例：この状態を分析して"
          className="border border-gray-300 p-2 w-full mb-4 rounded"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          送信
        </button>
        {response && (
          <div className="mt-6 border border-gray-300 p-4 rounded bg-gray-50">
            <strong>AIからの応答:</strong>
            <p className="mt-2 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestResponseView;
