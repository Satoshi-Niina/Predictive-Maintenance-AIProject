const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/upload', (req, res) => {
  const file = req.files.file;
  const savePath = path.join(__dirname, '../../data/raw', file.name);
  file.mv(savePath, () => res.send({ status: 'ok' }));
});

module.exports = router;