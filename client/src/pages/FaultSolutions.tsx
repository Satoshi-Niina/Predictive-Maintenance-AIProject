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

interface SolutionResult {
  recommendedSolutions: {
    title: string;
    description: string;
    estimatedCost: string;
    estimatedTime: string;
    priority: 'high' | 'medium' | 'low';
    implementationSteps: string[];
    requiredParts: string[];
    successRate: number;
  }[];
  gptAnalysis: {
    solutionAnalysis: string;
    costBenefitAnalysis: string;
    longTermRecommendations: string[];
  };
  similarSolutions: {
    id: string;
    title: string;
    description: string;
    effectiveness: number;
    implementationTime: string;
  }[];
}

interface FaultSolutionsProps {
  selectedFault: FaultRecord | null;
}

const FaultSolutions: React.FC<FaultSolutionsProps> = ({ selectedFault }) => {
  const [solutions, setSolutions] = useState<SolutionResult | null>(null);
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

  const handleGenerateSolutions = async () => {
    if (!editedFault) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/generate-solutions', {
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
        throw new Error('対策案の生成に失敗しました');
      }

      const result = await response.json();
      setSolutions(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : '対策案生成中にエラーが発生しました');
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
        <h3 className="text-xl font-semibold">対策予測</h3>
        <Button onClick={handleGenerateSolutions} disabled={loading}>
          {loading ? '生成中...' : '対策案生成'}
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

      {solutions && (
        <div className="space-y-4">
          {solutions.recommendedSolutions.map((solution, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{solution.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{solution.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  solution.priority === 'high' ? 'bg-red-100 text-red-800' :
                  solution.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {solution.priority === 'high' ? '優先度高' :
                   solution.priority === 'medium' ? '優先度中' : '優先度低'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>推定コスト: {solution.estimatedCost}</p>
                <p>推定時間: {solution.estimatedTime}</p>
                <p>成功率: {solution.successRate}%</p>
              </div>
              <div className="mt-4">
                <h5 className="font-medium text-sm text-gray-700">実装手順</h5>
                <ul className="list-decimal list-inside space-y-1 mt-1">
                  {solution.implementationSteps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h5 className="font-medium text-sm text-gray-700">必要な部品</h5>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  {solution.requiredParts.map((part, partIndex) => (
                    <li key={partIndex}>{part}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}

          <Card className="p-4">
            <h4 className="font-medium mb-2">GPT分析結果</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-sm text-gray-700">対策分析</h5>
                <p className="mt-1">{solutions.gptAnalysis.solutionAnalysis}</p>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-700">コストベネフィット分析</h5>
                <p className="mt-1">{solutions.gptAnalysis.costBenefitAnalysis}</p>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-700">長期的な推奨事項</h5>
                <ul className="list-disc list-inside space-y-1">
                  {solutions.gptAnalysis.longTermRecommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2">類似対策事例</h4>
            <div className="space-y-4">
              {solutions.similarSolutions.map((solution, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <p className="font-medium">{solution.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{solution.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <p>効果: {solution.effectiveness}%</p>
                    <p>実装時間: {solution.implementationTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FaultSolutions; 