const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/ask', async (req, res) => {
  const { query } = req.body;
  const response = await axios.post(process.env.PYTHON_API_URL + '/predict', { query });
  const answer = response.data.answer;

  // 保存処理
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const savePath = path.join(__dirname, '../../data/responses', `${date}.json`);
  const entry = { timestamp: new Date().toISOString(), query, answer };

  let history = [];
  if (fs.existsSync(savePath)) {
    history = JSON.parse(fs.readFileSync(savePath));
  }
  history.push(entry);
  fs.writeFileSync(savePath, JSON.stringify(history, null, 2));

  res.send({ answer });
});

module.exports = router;
