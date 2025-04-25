import React, { useState, useCallback } from 'react';
import DataProcessor from '@/services/data-processor';
import { GPTService } from '@/services/gpt-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [machineId, setMachineId] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const dataProcessor = DataProcessor.getInstance();
  const gptService = GPTService.getInstance();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('machineId', machineId);
        await dataProcessor.processData(machineId, formData);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  }, [machineId]);

  const handleAnalysis = useCallback(async () => {
    if (!machineId) return;

    setLoading(true);
    try {
      const machineData = await dataProcessor.loadInitialData();
      const machineInfo = machineData.find(data => data.machineId === machineId);

      if (machineInfo) {
        const analysis = await gptService.analyze(JSON.stringify(machineInfo));
        setAnalysisResult({
          prediction: analysis,
          schedule: "メンテナンススケジュールは分析結果に基づいて生成されます。"
        });
      }
    } catch (error) {
      console.error('Error in analysis:', error);
    } finally {
      setLoading(false);
    }
  }, [machineId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">機械故障分析と予防保全システム</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">技術文書のアップロード</h2>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".json,.txt,.xlsx"
              className="max-w-md"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">機械IDの入力</h2>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="機械IDを入力"
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="max-w-md"
              />
              <Button onClick={handleAnalysis} disabled={!machineId || loading}>
                {loading ? '分析中...' : '分析開始'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {analysisResult && (
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList>
            <TabsTrigger value="prediction">故障予測</TabsTrigger>
            <TabsTrigger value="schedule">メンテナンス計画</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prediction">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">故障予測結果</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">予測される故障</h4>
                  <p className="mt-2">{analysisResult.prediction}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">メンテナンス計画</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">推奨されるメンテナンス</h4>
                  <p className="mt-2">{analysisResult.schedule}</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Analysis; 