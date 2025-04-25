import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryItem {
  id: string;
  machineId: string;
  failureDescription: string;
  analysisResult: string;
  timestamp: string;
}

const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/analysis/history');
        const data = await response.json();
        setHistory(data);
        setFilteredHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const filtered = history.filter(item =>
      item.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.failureDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-800">分析履歴</h2>
      
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="機械IDまたは故障内容で検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>機械ID</TableHead>
              <TableHead>故障内容</TableHead>
              <TableHead>分析結果</TableHead>
              <TableHead>日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.machineId}</TableCell>
                <TableCell>{item.failureDescription}</TableCell>
                <TableCell className="max-w-xs truncate">{item.analysisResult}</TableCell>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default History;
