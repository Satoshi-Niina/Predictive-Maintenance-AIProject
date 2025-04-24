import React, { useState } from 'react';
import axios from 'axios';

const ScriptRunnerForm = () => {
  const [chunkChecked, setChunkChecked] = useState(false);
  const [qaChecked, setQaChecked] = useState(false);
  const [result, setResult] = useState('');

  const handleRunScripts = async () => {
    const tasks = [];
    if (chunkChecked) tasks.push('chunk');
    if (qaChecked) tasks.push('qa');

    try {
      const res = await axios.post('/api/run-scripts', { tasks });
      setResult(`✅ 完了: ${res.data.message}`);
    } catch (error: any) {
      setResult(`❌ エラー: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">スクリプト実行フォーム</h2>
      <div>
        <label className="mr-4">
          <input
            type="checkbox"
            checked={chunkChecked}
            onChange={() => setChunkChecked(!chunkChecked)}
          />
          チャンク生成
        </label>
        <label>
          <input
            type="checkbox"
            checked={qaChecked}
            onChange={() => setQaChecked(!qaChecked)}
          />
          Q＆A生成
        </label>
      </div>
      <button
        onClick={handleRunScripts}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        実行
      </button>
      <div>
        <p>保存先: <code>/data/processed/</code></p>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default ScriptRunnerForm;
