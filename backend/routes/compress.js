const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const archiver = require('archiver');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    
    const { quality = 80 } = req.body; // Compression quality
    
    if (req.files.length === 1) {
      const file = req.files[0];
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      const outputPath = path.join(__dirname, '../output', `compressed_${file.filename}${ext}`);
      await sharp(file.path, { animated: true })
        .jpeg({ quality: parseInt(quality), force: false })
        .png({ quality: parseInt(quality), force: false })
        .webp({ quality: parseInt(quality), force: false })
        .gif({ force: false })
        .toFile(outputPath);
      return res.download(outputPath, `compressed_image${ext}`);
    } else {
      res.attachment(`compressed_${Date.now()}.zip`);
      const archive = archiver('zip', { store: true });
      archive.pipe(res);
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
        
        let stream = sharp(file.path, { animated: true });
        
        if (ext === '.png') {
          stream = stream.png({ quality: parseInt(quality), force: false });
        } else if (ext === '.webp') {
          stream = stream.webp({ quality: parseInt(quality), force: false });
        } else if (ext === '.gif') {
          stream = stream.gif({ force: false });
        } else {
          stream = stream.jpeg({ quality: parseInt(quality), force: false });
        }
        
        // Prevent unhandled stream errors from crashing Node.js
        stream.on('error', err => console.error("Sharp stream error:", err));

        archive.append(stream, { name: `compressed_${i + 1}${ext}` });
      }
      
      // Prevent unhandled archiver errors
      archive.on('error', err => console.error("Archiver error:", err));
      archive.finalize();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Compression failed' });
  }
});

module.exports = router;
