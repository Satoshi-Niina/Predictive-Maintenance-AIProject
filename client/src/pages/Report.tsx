import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface ReportData {
  id: string;
  title: string;
  generatedAt: string;
  type: string;
  status: string;
}

export const Report: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: '1',
      title: '月次故障分析レポート',
      generatedAt: '2024-03-01',
      type: '定期レポート',
      status: '完了'
    },
    // 他のサンプルデータ
  ]);

  const handleGenerateReport = () => {
    // 実際のレポート生成処理をここに実装
    console.log('レポート生成:', { startDate, endDate });
  };

  const handleDownload = (reportId: string) => {
    // 実際のダウンロード処理をここに実装
    console.log('レポートダウンロード:', reportId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">レポート出力</h2>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">新規レポート生成</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                終了日
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerateReport}>レポート生成</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">生成済みレポート一覧</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タイトル</TableHead>
                <TableHead>生成日時</TableHead>
                <TableHead>種類</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.generatedAt}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report.id)}
                    >
                      ダウンロード
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}; 