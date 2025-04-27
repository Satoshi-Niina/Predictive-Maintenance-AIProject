import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import FaultInfo from '../pages/FaultInfo';
import FaultAnalysis from '../pages/FaultAnalysis';
import ReportOutput from '../pages/ReportOutput';
import BasicDataManagement from '../pages/BasicDataManagement';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || "fault-info";
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('ログアウトしました');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">機械故障管理システム</h1>
              <p className="text-gray-600">機械故障の分析、予測、管理のための統合システム</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              ログアウト
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50 p-1 rounded-lg">
            <TabsTrigger 
              value="fault-info" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
            >
              機械故障情報
            </TabsTrigger>
            <TabsTrigger 
              value="fault-analysis" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
            >
              機械故障分析
            </TabsTrigger>
            <TabsTrigger 
              value="report-output" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
            >
              レポート出力
            </TabsTrigger>
            <TabsTrigger 
              value="basic-data" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
            >
              基礎データ管理
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fault-info" className="mt-6">
            <Card className="p-6">
              <FaultInfo />
            </Card>
          </TabsContent>
          
          <TabsContent value="fault-analysis" className="mt-6">
            <Card className="p-6">
              <FaultAnalysis />
            </Card>
          </TabsContent>
          
          <TabsContent value="report-output" className="mt-6">
            <Card className="p-6">
              <ReportOutput />
            </Card>
          </TabsContent>
          
          <TabsContent value="basic-data" className="mt-6">
            <Card className="p-6">
              <BasicDataManagement />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default React.memo(MainLayout); 