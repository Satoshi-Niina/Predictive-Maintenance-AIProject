import React, { useEffect, useState } from 'react';
import { faultService, FaultData } from '../services/faultService';
import { analysisService, AnalysisResult } from '../services/analysisService';
import { historyService, HistoryData } from '../services/historyService';
import ExportDialog from './ExportDialog';

const FaultAnalysis: React.FC = () => {
  const [faultData, setFaultData] = useState<FaultData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, history] = await Promise.all([
          faultService.getFaultData(),
          historyService.getFaultHistory()
        ]);
        setFaultData(data);
        setHistoryData(history);
        if (data) {
          const result = await analysisService.analyzeFaultData(data);
          setAnalysisResult(result);
        }
      } catch (err) {
        setError('故障情報の分析に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">分析中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!faultData || !analysisResult) {
    return <div className="text-gray-500 p-4">分析データが見つかりません</div>;
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
        <h2 className="text-xl font-bold">故障分析結果</h2>
        <button
          onClick={() => setIsExportDialogOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          レポートをエクスポート
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">故障パターン</h3>
            <p className="mt-1">{analysisResult.faultPattern}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">重要度</h3>
            <p className={`mt-1 ${getSeverityColor(analysisResult.severity)}`}>
              {analysisResult.severity === 'high' ? '高' : 
               analysisResult.severity === 'medium' ? '中' : '低'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">推奨アクション</h3>
            <ul className="list-disc list-inside mt-1">
              {analysisResult.recommendedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg">類似事例</h3>
            <div className="space-y-2 mt-1">
              {analysisResult.similarCases.map((case_) => (
                <div key={case_.id} className="border-b pb-2">
                  <p className="font-medium">{case_.description}</p>
                  <p className="text-sm text-gray-600 mt-1">{case_.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        faultData={faultData}
        analysisResult={analysisResult}
        historyData={historyData}
      />
    </div>
  );
};

export default FaultAnalysis; 