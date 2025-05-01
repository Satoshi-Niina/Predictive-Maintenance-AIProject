const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const analyzeInspection = require('./routes/analyze-inspection');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Mount routes
app.use('/api', require('./routes/machines'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/history'));
app.use('/api', require('./routes/ask'));
app.use('/api', require('./routes/fault'));
app.use('/api', require('./routes/prediction'));
app.use('/api', require('./routes/knowledge'));
app.use('/api', analyzeInspection);

// 静的ファイルの提供
app.use('/data', express.static(path.join(__dirname, '../data')));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});