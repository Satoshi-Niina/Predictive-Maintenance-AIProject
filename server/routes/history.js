const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/history', (req, res) => {
  const dir = path.join(__dirname, '../../data/responses');
  const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let allEntries = [];

  allFiles.forEach(file => {
    const contents = JSON.parse(fs.readFileSync(path.join(dir, file)));
    allEntries.push(...contents);
  });

  // 時系列で並べ替え
  allEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.send(allEntries);
});

module.exports = router;
