const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/resize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { width, height, maintainAspectRatio } = req.body;
    const outputPath = path.join(__dirname, '../output', `resized_${req.file.filename}.jpg`);
    
    let transform = sharp(req.file.path);
    if (width || height) {
      transform = transform.resize({
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        fit: maintainAspectRatio === 'true' ? sharp.fit.inside : sharp.fit.fill
      });
    }
    
    await transform.toFile(outputPath);
    res.download(outputPath, 'resized_image.jpg');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resize failed' });
  }
});

router.post('/crop', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { left, top, width, height } = req.body;
    const outputPath = path.join(__dirname, '../output', `cropped_${req.file.filename}.jpg`);
    
    const image = sharp(req.file.path);
    const metadata = await image.metadata();
    
    // Safely bound the crop area to the image's actual dimensions to prevent crashes
    const safeLeft = Math.max(0, Math.min(parseInt(left) || 0, metadata.width - 1));
    const safeTop = Math.max(0, Math.min(parseInt(top) || 0, metadata.height - 1));
    const safeWidth = Math.max(1, Math.min(parseInt(width) || metadata.width, metadata.width - safeLeft));
    const safeHeight = Math.max(1, Math.min(parseInt(height) || metadata.height, metadata.height - safeTop));
    
    await image
      .extract({ 
        left: safeLeft, 
        top: safeTop, 
        width: safeWidth, 
        height: safeHeight 
      })
      .toFile(outputPath);
      
    res.download(outputPath, 'cropped_image.jpg');
  } catch (error) {
    console.error("Crop error:", error);
    res.status(500).json({ error: 'Crop failed' });
  }
});

router.post('/rotate-flip', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { angle, flipH, flipV } = req.body;
    const outputPath = path.join(__dirname, '../output', `modified_${req.file.filename}.jpg`);
    
    let transform = sharp(req.file.path);
    if (angle) transform = transform.rotate(parseInt(angle));
    if (flipH === 'true') transform = transform.flop();
    if (flipV === 'true') transform = transform.flip();
    
    await transform.toFile(outputPath);
    res.download(outputPath, 'modified_image.jpg');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Modification failed' });
  }
});

module.exports = router;
