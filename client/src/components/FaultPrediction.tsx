import React, { useEffect, useState } from 'react';
import { predictionService, PredictionResult, PredictionHistory } from '../services/predictionService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FaultPrediction: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [accuracy, setAccuracy] = useState<{
    overall: number;
    byComponent: Record<string, number>;
    bySeverity: Record<string, number>;
  }>({
    overall: 0,
    byComponent: {},
    bySeverity: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [preds, hist, acc] = await Promise.all([
          predictionService.getPredictions(),
          predictionService.getPredictionHistory(),
          predictionService.getPredictionAccuracy()
        ]);
        setPredictions(preds);
        setHistory(hist);
        setAccuracy(acc);
      } catch (err) {
        setError('予測データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateModel = async () => {
    setUpdating(true);
    try {
      const success = await predictionService.updatePredictionModel();
      if (success) {
        // モデル更新後にデータを再取得
        const [preds, hist, acc] = await Promise.all([
          predictionService.getPredictions(),
          predictionService.getPredictionHistory(),
          predictionService.getPredictionAccuracy()
        ]);
        setPredictions(preds);
        setHistory(hist);
        setAccuracy(acc);
      } else {
        setError('モデルの更新に失敗しました');
      }
    } catch (err) {
      setError('モデルの更新に失敗しました');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!predictions) {
    return <div className="text-gray-500 p-4">予測データが見つかりません</div>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">故障予測</h2>
        <button
          onClick={handleUpdateModel}
          disabled={updating}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {updating ? '更新中...' : '予測モデルを更新'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">予測精度</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">全体精度: </span>
              <span className="text-blue-600">{(accuracy.overall * 100).toFixed(1)}%</span>
            </p>
            <div>
              <p className="font-medium mb-2">コンポーネント別精度:</p>
              <div className="space-y-1">
                {Object.entries(accuracy.byComponent).map(([component, acc]) => (
                  <p key={component} className="text-sm">
                    <span className="font-medium">{component}: </span>
                    <span className="text-blue-600">{(acc * 100).toFixed(1)}%</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">予測履歴</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#8884d8"
                  name="予測精度"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">予測される故障</h3>
        <div className="space-y-4">
          {predictions.predictedFaults.map((fault, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{fault.component}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    発生確率: {(fault.probability * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    予測発生時期: {new Date(fault.estimatedTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${getSeverityColor(fault.severity)}`}>
                    {fault.severity === 'high' ? '高' :
                     fault.severity === 'medium' ? '中' : '低'}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">推奨アクション:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {fault.recommendedActions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaultPrediction; 