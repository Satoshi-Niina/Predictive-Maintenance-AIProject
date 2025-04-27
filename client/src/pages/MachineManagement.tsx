import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  nextMaintenance: string;
  location: string;
}

const MachineManagement: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<Machine> = [
    {
      title: '機械ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'タイプ',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          active: 'green',
          maintenance: 'orange',
          inactive: 'red',
        };
        const labels = {
          active: '稼働中',
          maintenance: 'メンテナンス中',
          inactive: '停止中',
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {labels[status as keyof typeof labels]}
          </Tag>
        );
      },
    },
    {
      title: '最終メンテナンス',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
    },
    {
      title: '次回メンテナンス',
      dataIndex: 'nextMaintenance',
      key: 'nextMaintenance',
    },
    {
      title: '設置場所',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">編集</Button>
          <Button type="link" danger>削除</Button>
        </Space>
      ),
    },
  ];

  const handleAddMachine = async (values: Machine) => {
    try {
      // TODO: Implement machine addition logic
      setMachines([...machines, values]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('機械の追加中にエラーが発生しました:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          新規機械の追加
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={machines}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="新規機械の追加"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMachine}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '名称を入力してください' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="タイプ"
            rules={[{ required: true, message: 'タイプを選択してください' }]}
          >
            <Select>
              <Select.Option value="production">生産設備</Select.Option>
              <Select.Option value="testing">検査設備</Select.Option>
              <Select.Option value="packaging">包装設備</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="location"
            label="設置場所"
            rules={[{ required: true, message: '設置場所を入力してください' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              追加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MachineManagement; 