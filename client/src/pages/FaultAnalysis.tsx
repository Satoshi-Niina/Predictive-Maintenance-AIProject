// React コンポーネント：機械故障分析画面に故障予測と対策予測を統合表示
import React, { useState } from 'react';
import { CountermeasurePrediction } from './CountermeasurePrediction';
import { AnalyzeInspection } from './AnalyzeInspection';

const FaultAnalysis = () => {
  const [selectedMode, setSelectedMode] = useState('');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">機械故障分析</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedMode('原因予測')}
          className={`px-4 py-2 rounded ${selectedMode === '原因予測' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          原因予測
        </button>
        <button
          onClick={() => setSelectedMode('対策予測')}
          className={`px-4 py-2 rounded ${selectedMode === '対策予測' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          対策予測
        </button>
      </div>

      {/* コンテンツ切り替え */}
      {selectedMode === '原因予測' && <AnalyzeInspection />}
      {selectedMode === '対策予測' && <CountermeasurePrediction />}

      {!selectedMode && (
        <div className="p-4 border rounded bg-white text-gray-600">
          上のボタンから機能を選択してください。
        </div>
      )}
    </div>
  );
};

export default FaultAnalysis;
