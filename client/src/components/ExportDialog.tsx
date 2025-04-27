import React, { useState } from 'react';
import { exportService, ExportOptions } from '../services/exportService';
import { FaultData } from '../services/faultService';
import { AnalysisResult } from '../services/analysisService';
import { HistoryData } from '../services/historyService';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  faultData: FaultData | null;
  analysisResult: AnalysisResult | null;
  historyData: HistoryData[];
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  faultData,
  analysisResult,
  historyData
}) => {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(true);
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!faultData) {
      setError('故障データが見つかりません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options: ExportOptions = {
        format,
        includeAnalysis,
        includeHistory,
        includeDiagnostics,
        dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined
      };

      const blob = await exportService.exportReport(
        faultData,
        analysisResult,
        historyData,
        options
      );

      // ファイル名の生成
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `fault-report-${timestamp}.${format}`;

      // ファイルのダウンロード
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onClose();
    } catch (err) {
      setError('エクスポートに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">レポートのエクスポート</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              フォーマット
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
              className="w-full p-2 border rounded-md"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeAnalysis}
                onChange={(e) => setIncludeAnalysis(e.target.checked)}
                className="mr-2"
              />
              <span>分析結果を含める</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeHistory}
                onChange={(e) => setIncludeHistory(e.target.checked)}
                className="mr-2"
              />
              <span>履歴データを含める</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeDiagnostics}
                onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                className="mr-2"
              />
              <span>診断情報を含める</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                終了日
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'エクスポート中...' : 'エクスポート'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog; 