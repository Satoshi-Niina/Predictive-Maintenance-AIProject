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
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const uploadRouter = require('./routes/upload');
const askRouter = require('./routes/ask');
const historyRouter = require('./routes/history');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/upload', uploadRouter);
app.use('/api/ask', askRouter);
app.use('/api/history', historyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const uploadRouter = require('./routes/upload');
const askRouter = require('./routes/ask');
const historyRouter = require('./routes/history');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/upload', uploadRouter);
app.use('/api/ask', askRouter);
app.use('/api/history', historyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
