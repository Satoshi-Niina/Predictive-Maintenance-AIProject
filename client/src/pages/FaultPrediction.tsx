import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FaultRecord {
  id: string;
  machineId: string;
  machineType: string;
  faultType: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved';
  timestamp: string;
  affectedComponents: string[];
}

interface PredictionResult {
  possibleCauses: string[];
  confidence: number;
  recommendedChecks: string[];
  similarCases: {
    id: string;
    description: string;
    solution: string;
    effectiveness: number;
  }[];
  gptAnalysis: {
    causeAnalysis: string;
    preventiveMeasures: string[];
    maintenanceRecommendations: string[];
  };
}

interface FaultPredictionProps {
  selectedFault: FaultRecord | null;
}

const FaultPrediction: React.FC<FaultPredictionProps> = ({ selectedFault }) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedFault, setEditedFault] = useState<FaultRecord | null>(null);

  useEffect(() => {
    if (selectedFault) {
      setEditedFault(selectedFault);
    }
  }, [selectedFault]);

  const handleFaultEdit = (field: string, value: string) => {
    setEditedFault(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handlePredict = async () => {
    if (!editedFault) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/predict-fault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fault: editedFault,
          includeKnowledge: true,
          includeHistory: true
        }),
      });

      if (!response.ok) {
        throw new Error('予測に失敗しました');
      }

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : '予測中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedFault) {
    return (
      <div className="text-center text-gray-500">
        故障情報を選択してください
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">故障原因予測</h3>
        <Button onClick={handlePredict} disabled={loading}>
          {loading ? '予測中...' : '予測実行'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <h4 className="font-medium mb-4">故障情報の編集</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">機械ID</label>
            <Input
              value={editedFault?.machineId || ''}
              onChange={(e) => handleFaultEdit('machineId', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">機種</label>
            <Input
              value={editedFault?.machineType || ''}
              onChange={(e) => handleFaultEdit('machineType', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">故障タイプ</label>
            <Input
              value={editedFault?.faultType || ''}
              onChange={(e) => handleFaultEdit('faultType', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">説明</label>
            <Textarea
              value={editedFault?.description || ''}
              onChange={(e) => handleFaultEdit('description', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {prediction && (
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2">予測される原因</h4>
            <ul className="list-disc list-inside space-y-1">
              {prediction.possibleCauses.map((cause: string, index: number) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2">推奨される確認項目</h4>
            <ul className="list-disc list-inside space-y-1">
              {prediction.recommendedChecks.map((check: string, index: number) => (
                <li key={index}>{check}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2">類似事例</h4>
            <div className="space-y-4">
              {prediction.similarCases.map((case_, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="font-medium">{case_.description}</p>
                  <p className="text-sm text-gray-600 mt-1">解決策: {case_.solution}</p>
                  <p className="text-sm text-gray-500">効果: {case_.effectiveness}%</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2">GPT分析結果</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-sm text-gray-700">原因分析</h5>
                <p className="mt-1">{prediction.gptAnalysis.causeAnalysis}</p>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-700">予防対策</h5>
                <ul className="list-disc list-inside space-y-1">
                  {prediction.gptAnalysis.preventiveMeasures.map((measure, index) => (
                    <li key={index}>{measure}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-700">メンテナンス推奨事項</h5>
                <ul className="list-disc list-inside space-y-1">
                  {prediction.gptAnalysis.maintenanceRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <div className="text-right text-sm text-gray-500">
            予測確度: {prediction.confidence}%
          </div>
        </div>
      )}
    </div>
  );
};

export default FaultPrediction; 