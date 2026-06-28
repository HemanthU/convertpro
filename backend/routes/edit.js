const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const upload = multer({ dest: 'uploads/' });

// Helper to handle multiple files zip response
const processMultiple = async (req, res, actionName, transformFn) => {
  res.attachment(`${actionName}_${Date.now()}.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);
  
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    // transformFn now must return a sharp stream, not a Promise resolving to a buffer
    const stream = transformFn(file); 
    const ext = path.extname(file.originalname) || '.jpg';
    archive.append(stream, { name: `${actionName}_${i + 1}${ext}` });
  }
  archive.finalize();
};

router.post('/resize', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No file uploaded' });
    const { width, height, maintainAspectRatio } = req.body;
    
    const transformFn = (file) => {
      let transform = sharp(file.path);
      if (width || height) {
        transform = transform.resize({
          width: width ? parseInt(width) : null,
          height: height ? parseInt(height) : null,
          fit: maintainAspectRatio === 'true' ? sharp.fit.inside : sharp.fit.fill
        });
      }
      return transform;
    };

    if (req.files.length === 1) {
      const outputPath = path.join(__dirname, '../output', `resized_${req.files[0].filename}.jpg`);
      await transformFn(req.files[0]).toFile(outputPath);
      return res.download(outputPath, 'resized_image.jpg');
    } else {
      await processMultiple(req, res, 'resized', transformFn);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resize failed' });
  }
});

router.post('/crop', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No file uploaded' });
    const { left, top, width, height } = req.body;
    
    // We must use a Promise for metadata, but then return a stream
    const transformFn = async (file) => {
      const image = sharp(file.path);
      const metadata = await image.metadata();
      const safeLeft = Math.max(0, Math.min(parseInt(left) || 0, metadata.width - 1));
      const safeTop = Math.max(0, Math.min(parseInt(top) || 0, metadata.height - 1));
      const safeWidth = Math.max(1, Math.min(parseInt(width) || metadata.width, metadata.width - safeLeft));
      const safeHeight = Math.max(1, Math.min(parseInt(height) || metadata.height, metadata.height - safeTop));
      return image.extract({ left: safeLeft, top: safeTop, width: safeWidth, height: safeHeight });
    };

    if (req.files.length === 1) {
      const outputPath = path.join(__dirname, '../output', `cropped_${req.files[0].filename}.jpg`);
      const stream = await transformFn(req.files[0]);
      await stream.toFile(outputPath);
      return res.download(outputPath, 'cropped_image.jpg');
    } else {
      // Re-implement processMultiple locally here to await transformFn
      res.attachment(`cropped_${Date.now()}.zip`);
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);
      for (let i = 0; i < req.files.length; i++) {
        const stream = await transformFn(req.files[i]);
        const ext = path.extname(req.files[i].originalname) || '.jpg';
        archive.append(stream, { name: `cropped_${i + 1}${ext}` });
      }
      archive.finalize();
    }
  } catch (error) {
    console.error("Crop error:", error);
    res.status(500).json({ error: 'Crop failed' });
  }
});

router.post('/rotate-flip', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No file uploaded' });
    const { angle, flipH, flipV } = req.body;
    
    const transformFn = (file) => {
      let transform = sharp(file.path);
      if (angle) transform = transform.rotate(parseInt(angle));
      if (flipH === 'true') transform = transform.flop();
      if (flipV === 'true') transform = transform.flip();
      return transform;
    };

    if (req.files.length === 1) {
      const outputPath = path.join(__dirname, '../output', `modified_${req.files[0].filename}.jpg`);
      await transformFn(req.files[0]).toFile(outputPath);
      return res.download(outputPath, 'modified_image.jpg');
    } else {
      await processMultiple(req, res, 'modified', transformFn);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Modification failed' });
  }
});

module.exports = router;
