import React, { useState, useCallback } from 'react';
import { DataProcessor } from '@/lib/data-processor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ExternalData: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [machineId, setMachineId] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [processedData, setProcessedData] = useState<any>(null);

  const dataProcessor = DataProcessor.getInstance();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProcessingStatus('idle');
      setErrorMessage('');
    }
  }, []);

  const handleProcessData = useCallback(async () => {
    if (!selectedFile || !machineId) return;

    setProcessingStatus('processing');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('machineId', machineId);

      const response = await fetch('http://localhost:3001/api/process-external', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process external data');
      }

      const data = await response.json();
      await dataProcessor.addExternalData(data);
      
      setProcessedData(data);
      setProcessingStatus('success');
    } catch (error) {
      console.error('Error processing external data:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setProcessingStatus('error');
    }
  }, [selectedFile, machineId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">外部データ統合</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">データファイルのアップロード</h2>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".json,.png,.jpg,.jpeg,.mp4"
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
              <Button 
                onClick={handleProcessData} 
                disabled={!machineId || !selectedFile || processingStatus === 'processing'}
              >
                {processingStatus === 'processing' ? '処理中...' : 'データ統合'}
              </Button>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-600">
              {errorMessage}
            </div>
          )}

          {processingStatus === 'success' && processedData && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">概要</TabsTrigger>
                <TabsTrigger value="details">詳細</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">処理結果概要</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">処理されたデータ数</h4>
                      <p>{processedData.technicalDocuments?.length || 0}件</p>
                    </div>
                    <div>
                      <h4 className="font-medium">統合された機械情報</h4>
                      <p>{processedData.type} - {processedData.model}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">詳細情報</h3>
                  <div className="space-y-4">
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                      {JSON.stringify(processedData, null, 2)}
                    </pre>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExternalData; 