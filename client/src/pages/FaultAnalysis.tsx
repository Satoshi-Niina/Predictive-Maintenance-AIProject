import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FaultSearch from './FaultSearch';
import FaultPrediction from './FaultPrediction';
import FaultSolutions from './FaultSolutions';

const FaultAnalysis: React.FC = () => {
  const [selectedFault, setSelectedFault] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">機械故障分析</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50 p-1 rounded-lg">
          <TabsTrigger 
            value="search" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
          >
            検索
          </TabsTrigger>
          <TabsTrigger 
            value="prediction" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
          >
            故障原因予測
          </TabsTrigger>
          <TabsTrigger 
            value="solutions" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
          >
            対策予測
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <Card className="p-6">
            <FaultSearch onSelectFault={setSelectedFault} />
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <Card className="p-6">
            <FaultPrediction selectedFault={selectedFault} />
          </Card>
        </TabsContent>

        <TabsContent value="solutions" className="mt-6">
          <Card className="p-6">
            <FaultSolutions selectedFault={selectedFault} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FaultAnalysis; 