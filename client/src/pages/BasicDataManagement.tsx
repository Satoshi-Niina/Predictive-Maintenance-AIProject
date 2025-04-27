import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  role: string;
  department: string;
  division: string;
}

const BasicDataManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("basic-data");
  const [users, setUsers] = useState<User[]>([]);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user',
    department: '',
    division: '',
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('ユーザー一覧の取得に失敗しました');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/auth/register', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('ユーザーを登録しました');
      setIsRegisterDialogOpen(false);
      setNewUser({
        username: '',
        password: '',
        role: 'user',
        department: '',
        division: '',
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'ユーザー登録に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">基礎データ管理</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50 p-1 rounded-lg">
          <TabsTrigger 
            value="basic-data" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
          >
            基礎資料
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:scale-105 transition-all duration-200 rounded-md"
          >
            ユーザー管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-data" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">GPTナレッジデータ管理</h3>
                <Button variant="outline">新規アップロード</Button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="ナレッジデータを検索..." />
                  <Button>検索</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ファイル名</TableHead>
                      <TableHead>アップロード日時</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* ナレッジデータ一覧を表示 */}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">ユーザー管理</h3>
                <Button variant="outline" onClick={() => setIsRegisterDialogOpen(true)}>
                  新規ユーザー登録
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="ユーザーを検索..." />
                  <Button>検索</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ユーザー名</TableHead>
                      <TableHead>所属</TableHead>
                      <TableHead>部署</TableHead>
                      <TableHead>権限</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.division}</TableCell>
                        <TableCell>{user.role === 'admin' ? '管理者' : '一般'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            編集
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="bg-blue-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-800">新規ユーザー登録</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ユーザー名</label>
              <Input
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="mt-1 bg-white border border-blue-500 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">パスワード</label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="mt-1 bg-white border border-blue-500 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">権限</label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="mt-1 bg-white border border-blue-500 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="権限を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">一般</SelectItem>
                  <SelectItem value="admin">管理者</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">所属</label>
              <Input
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                className="mt-1 bg-white border border-blue-500 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">部署</label>
              <Input
                value={newUser.division}
                onChange={(e) => setNewUser({ ...newUser, division: e.target.value })}
                className="mt-1 bg-white border border-blue-500 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleRegister}>
              登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BasicDataManagement; 