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
      const outputPath = path.join(__dirname, '../output', `compressed_${file.filename}.jpg`);
      await sharp(file.path)
        .jpeg({ quality: parseInt(quality), force: false })
        .png({ quality: parseInt(quality), force: false })
        .webp({ quality: parseInt(quality), force: false })
        .toFile(outputPath);
      return res.download(outputPath, 'compressed_image.jpg');
    } else {
      const zipPath = path.join(__dirname, '../output', `compressed_${Date.now()}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        res.download(zipPath, 'compressed_images.zip');
      });
      archive.pipe(output);
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const buffer = await sharp(file.path)
          .jpeg({ quality: parseInt(quality), force: false })
          .png({ quality: parseInt(quality), force: false })
          .webp({ quality: parseInt(quality), force: false })
          .toBuffer();
        
        // guess extension from mimetype or originalname
        const ext = path.extname(file.originalname) || '.jpg';
        archive.append(buffer, { name: `compressed_${i + 1}${ext}` });
      }
      archive.finalize();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Compression failed' });
  }
});

module.exports = router;
