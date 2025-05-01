import React, { useState } from 'react';
import axios from 'axios';

const AnalyzeInspection = () => {
  const [inspectionData, setInspectionData] = useState([
    { date: '', pressure: '', voltage: '', wear: '' },
  ]);
  const [machineId, setMachineId] = useState('');
  const [note, setNote] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [diagramUrl, setDiagramUrl] = useState('');

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...inspectionData];
    updated[index][field] = value;
    setInspectionData(updated);
  };

  const addRow = () => {
    setInspectionData([
      ...inspectionData,
      { date: '', pressure: '', voltage: '', wear: '' },
    ]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/analyze-inspection', {
        machine_id: machineId,
        inspection_data: inspectionData,
        note,
      });

      const text = response.data.result;
      setResult(text);

      const lines = text.split('\n');
      const checks = lines.filter((line) => line.trim().startsWith('・'));
      setChecklist(checks);

      if (text.includes('ファンベルト')) {
        setDiagramUrl('/data/images/fanbelt_check.png');
      } else {
        setDiagramUrl('');
      }
    } catch (error) {
      console.error(error);
      setResult('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-2">故障予測（点検データ＋メモ）</h2>

      <input
        type="text"
        className="border p-2 mb-2 w-full"
        placeholder="機械IDを入力"
        value={machineId}
        onChange={(e) => setMachineId(e.target.value)}
      />

      {inspectionData.map((row, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
          <input
            type="date"
            className="border p-1"
            value={row.date}
            onChange={(e) => handleChange(index, 'date', e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            className="border p-1"
            placeholder="圧力"
            value={row.pressure}
            onChange={(e) => handleChange(index, 'pressure', e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            className="border p-1"
            placeholder="電圧"
            value={row.voltage}
            onChange={(e) => handleChange(index, 'voltage', e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            className="border p-1"
            placeholder="摩耗"
            value={row.wear}
            onChange={(e) => handleChange(index, 'wear', e.target.value)}
          />
        </div>
      ))}

      <button onClick={addRow} className="bg-gray-200 px-3 py-1 rounded mb-2">
        ＋ 行を追加
      </button>

      <textarea
        className="border p-2 w-full mb-2"
        rows={3}
        placeholder="メモ（異音、症状など）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? '送信中...' : '予測を実行'}
      </button>

      {result && (
        <div className="mt-4 p-4 border bg-white rounded shadow">
          <h3 className="font-bold mb-2">GPT予測結果：</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>

          {checklist.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">✅ チェックリスト：</h4>
              <ul className="list-disc list-inside text-sm">
                {checklist.map((item, idx) => (
                  <li key={idx}>{item.replace(/^・/, '')}</li>
                ))}
              </ul>
            </div>
          )}

          {diagramUrl && (
            <div className="mt-4">
              <h4 className="font-semibold">🖼 関連図：</h4>
              <img
                src={diagramUrl}
                alt="関連図"
                className="border rounded mt-2"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { AnalyzeInspection };