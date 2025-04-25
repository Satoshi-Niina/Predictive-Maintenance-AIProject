const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Mount routes
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/ask'));
app.use('/api', require('./routes/history'));
app.use('/api', require('./routes/machines'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});