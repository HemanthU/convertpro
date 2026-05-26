const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { quality = 80 } = req.body; // Compression quality
    const outputPath = path.join(__dirname, '../output', `compressed_${req.file.filename}.jpg`);
    
    await sharp(req.file.path)
      .jpeg({ quality: parseInt(quality), force: false })
      .png({ quality: parseInt(quality), force: false })
      .webp({ quality: parseInt(quality), force: false })
      .toFile(outputPath);
      
    res.download(outputPath, 'compressed_image.jpg');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Compression failed' });
  }
});

module.exports = router;
