import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const ReportOutput: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("preview");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">レポート出力</h2>
        <Button onClick={handlePrint} variant="outline">
          印刷
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50 p-1 rounded-lg">
          <TabsTrigger 
            value="preview" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
          >
            プレビュー
          </TabsTrigger>
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
          >
            ダッシュボード
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">故障分析レポート</h3>
              {selectedReport ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">機械ID</h4>
                    <p className="mt-1">{selectedReport.machineId}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">故障タイプ</h4>
                    <p className="mt-1">{selectedReport.faultType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">分析結果</h4>
                    <p className="mt-1">{selectedReport.analysis}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">推奨対策</h4>
                    <ul className="mt-1 list-disc list-inside">
                      {selectedReport.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">レポートを選択してください</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">故障分析ダッシュボード</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>機械ID</TableHead>
                    <TableHead>故障タイプ</TableHead>
                    <TableHead>発生頻度</TableHead>
                    <TableHead>平均修理時間</TableHead>
                    <TableHead>対策効果</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* ダッシュボードデータを表示 */}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportOutput; 