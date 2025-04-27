import React, { useEffect, useState } from 'react';
import { reportService, ReportTemplate, ReportData, ReportOptions } from '../services/reportService';
import { faultService, FaultData } from '../services/faultService';
import { analysisService, AnalysisResult } from '../services/analysisService';
import { historyService, HistoryData } from '../services/historyService';
import { predictionService, PredictionResult } from '../services/predictionService';

const ReportGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'html'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await reportService.getTemplates();
        setTemplates(fetchedTemplates);
        if (fetchedTemplates.length > 0) {
          setSelectedTemplate(fetchedTemplates[0].id);
        }
      } catch (err) {
        setError('テンプレートの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      setError('テンプレートを選択してください');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // 必要なデータを取得
      const [faultData, analysisResult, historyData, predictionResult] = await Promise.all([
        faultService.getFaultData(),
        analysisService.analyzeFaultData(await faultService.getFaultData()),
        historyService.getFaultHistory(),
        predictionService.getPredictions()
      ]);

      if (!faultData) {
        throw new Error('故障データが見つかりません');
      }

      const reportData: ReportData = {
        faultData,
        analysisResult,
        historyData,
        predictionResult
      };

      const options: ReportOptions = {
        template: selectedTemplate,
        format,
        includeCharts,
        includeImages,
        dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined
      };

      const blob = await reportService.generateReport(reportData, options);

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
    } catch (err) {
      setError('レポートの生成に失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">レポート生成</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              テンプレート
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">テンプレートを選択</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              フォーマット
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel' | 'html')}
              className="w-full p-2 border rounded-md"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="html">HTML</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="mr-2"
              />
              <span>グラフを含める</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="mr-2"
              />
              <span>画像を含める</span>
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

          <div className="flex justify-end">
            <button
              onClick={handleGenerateReport}
              disabled={generating || !selectedTemplate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {generating ? '生成中...' : 'レポートを生成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator; 