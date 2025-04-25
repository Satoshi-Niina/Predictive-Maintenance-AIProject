import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadKnowledge from './UploadKnowledge';
import History from './History';
import Analysis from './Analysis';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Emergency AI Dashboard</h1>
          <p className="text-gray-600">機械故障分析と予防保全のためのAI支援システム</p>
        </div>
        
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-blue-50 p-1 rounded-lg">
            <TabsTrigger 
              value="analysis" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
            >
              分析
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
            >
              ナレッジアップロード
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
            >
              履歴
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Analysis />
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <UploadKnowledge />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <History />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard; 