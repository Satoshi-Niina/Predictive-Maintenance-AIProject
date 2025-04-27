import React, { useState } from 'react';
import { Card, Upload, Button, Form, Input, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

interface KnowledgeData {
  title: string;
  description: string;
  category: string;
  files: UploadFile[];
}

const KnowledgeUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: KnowledgeData) => {
    try {
      // TODO: Implement file upload logic
      message.success('ナレッジデータが正常にアップロードされました');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('アップロード中にエラーが発生しました');
    }
  };

  return (
    <Card className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="タイトル"
          rules={[{ required: true, message: 'タイトルを入力してください' }]}
        >
          <Input placeholder="ナレッジデータのタイトル" />
        </Form.Item>

        <Form.Item
          name="description"
          label="説明"
          rules={[{ required: true, message: '説明を入力してください' }]}
        >
          <TextArea
            placeholder="ナレッジデータの詳細な説明"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="カテゴリー"
          rules={[{ required: true, message: 'カテゴリーを選択してください' }]}
        >
          <Select placeholder="カテゴリーを選択">
            <Option value="maintenance">メンテナンス</Option>
            <Option value="repair">修理</Option>
            <Option value="operation">運転</Option>
            <Option value="safety">安全</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="files"
          label="ファイル"
          rules={[{ required: true, message: 'ファイルをアップロードしてください' }]}
        >
          <Upload
            multiple
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>ファイルを選択</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            アップロード
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default KnowledgeUpload; 