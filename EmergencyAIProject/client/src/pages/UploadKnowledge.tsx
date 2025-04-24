import React, { useState } from 'react';
import axios from 'axios';
import ScriptRunnerForm from '../components/ScriptRunnerForm'; // ← 追加


const UploadKnowledge = () => {
  const [files, setFiles] = useState<FileList | null>(null);
const [processing, setProcessing] = useState(false);
const acceptedFileTypes = ".txt,.pdf,.xlsx,.pptx,.docx,.json,image/*";

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('http://localhost:5500/api/upload', formData);
    alert('アップロード完了');
  };

  return (
    <div>
      {/* 既存のアップロードUIの上または下に追加 */}
      <ScriptRunnerForm />  {/* ← フォームをここに表示 */}
    </div>
  );
};

export default UploadKnowledge;