const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// 50MB limit, up to 100 files
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/', upload.array('images', 100), async (req, res) => {
  try {
    const { toFormat } = req.body; // e.g., 'png', 'jpeg', 'webp', 'gif', 'bmp', 'tiff'
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    if (req.files.length === 1) {
      // Single file conversion
      const file = req.files[0];
      const outputPath = path.join(__dirname, '../output', `${file.filename}.${toFormat}`);
      
      let inputBuffer = fs.readFileSync(file.path);
      if (file.originalname.toLowerCase().endsWith('.heic')) {
        const heicConvert = require('heic-convert');
        inputBuffer = await heicConvert({ buffer: inputBuffer, format: 'JPEG', quality: 1 });
      }
      
      await sharp(inputBuffer).toFormat(toFormat).toFile(outputPath);
      return res.download(outputPath, `converted.${toFormat}`);
    } else {
      // Multiple files - return ZIP
      const zipPath = path.join(__dirname, '../output', `${Date.now()}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        res.download(zipPath, 'converted_images.zip');
      });
      
      archive.pipe(output);
      
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        let inputBuffer = fs.readFileSync(file.path);
        
        if (file.originalname.toLowerCase().endsWith('.heic')) {
          const heicConvert = require('heic-convert');
          inputBuffer = await heicConvert({ buffer: inputBuffer, format: 'JPEG', quality: 1 });
        }
        
        const processedBuffer = await sharp(inputBuffer).toFormat(toFormat).toBuffer();
        archive.append(processedBuffer, { name: `image_${i + 1}.${toFormat}` });
      }
      
      archive.finalize();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

module.exports = router;
