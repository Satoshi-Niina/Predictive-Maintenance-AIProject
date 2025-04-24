const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/ask'));
app.use('/api', require('./routes/history'));

const PORT = 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));