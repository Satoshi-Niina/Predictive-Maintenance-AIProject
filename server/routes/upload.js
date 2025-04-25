const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const savedFiles = [];

    for (const file of files) {
      const savePath = path.join(__dirname, '../../data/raw', file.name);
      await file.mv(savePath);
      savedFiles.push(savePath);
    }

    // Process files through Python scripts
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../../scripts/chunk_generator.py')
    ]);

    pythonProcess.on('close', async (code) => {
      if (code === 0) {
        const qaProcess = spawn('python', [
          path.join(__dirname, '../../scripts/qa_generator.py')
        ]);
        
        qaProcess.on('close', (qaCode) => {
          res.send({ 
            status: 'ok', 
            message: 'Files uploaded and processed successfully',
            files: savedFiles 
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

module.exports = router;