export const config = {
  port: process.env.PORT || 3001,
  dataDir: process.env.DATA_DIR || './data',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  allowedFileTypes: ['.json', '.txt', '.xlsx', '.xls'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
}; 