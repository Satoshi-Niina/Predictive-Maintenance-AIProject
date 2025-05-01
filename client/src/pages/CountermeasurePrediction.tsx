import React, { useState } from 'react';

const CountermeasurePrediction = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine_id: 'TEMP-ID',
          inspection_data: [],
          note: input,
        }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h3 className="font-bold mb-2">対策予測</h3>
      <textarea
        className="w-full border p-2 mb-2"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="故障の詳細や状況を入力してください（例：ブレーキが効きにくい）"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {loading ? '送信中...' : '対策を予測'}
      </button>

      {result && (
        <div className="mt-4">
          <h4 className="font-semibold">GPTからの対策提案：</h4>
          <pre className="whitespace-pre-wrap text-sm mt-2">{result}</pre>
        </div>
      )}
    </div>
  );
};

export { CountermeasurePrediction };
