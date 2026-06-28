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
    const buffer = await transformFn(file);
    const ext = path.extname(file.originalname) || '.jpg';
    archive.append(buffer, { name: `${actionName}_${i + 1}${ext}` });
  }
  archive.finalize();
};

router.post('/resize', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No file uploaded' });
    const { width, height, maintainAspectRatio } = req.body;
    
    const transformFn = async (file) => {
      let transform = sharp(file.path);
      if (width || height) {
        transform = transform.resize({
          width: width ? parseInt(width) : null,
          height: height ? parseInt(height) : null,
          fit: maintainAspectRatio === 'true' ? sharp.fit.inside : sharp.fit.fill
        });
      }
      return transform.toBuffer();
    };

    if (req.files.length === 1) {
      const outputPath = path.join(__dirname, '../output', `resized_${req.files[0].filename}.jpg`);
      await fs.promises.writeFile(outputPath, await transformFn(req.files[0]));
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
    
    const transformFn = async (file) => {
      const image = sharp(file.path);
      const metadata = await image.metadata();
      const safeLeft = Math.max(0, Math.min(parseInt(left) || 0, metadata.width - 1));
      const safeTop = Math.max(0, Math.min(parseInt(top) || 0, metadata.height - 1));
      const safeWidth = Math.max(1, Math.min(parseInt(width) || metadata.width, metadata.width - safeLeft));
      const safeHeight = Math.max(1, Math.min(parseInt(height) || metadata.height, metadata.height - safeTop));
      return image.extract({ left: safeLeft, top: safeTop, width: safeWidth, height: safeHeight }).toBuffer();
    };

    if (req.files.length === 1) {
      const outputPath = path.join(__dirname, '../output', `cropped_${req.files[0].filename}.jpg`);
      await fs.promises.writeFile(outputPath, await transformFn(req.files[0]));
      return res.download(outputPath, 'cropped_image.jpg');
    } else {
      await processMultiple(req, res, 'cropped', transformFn);
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
    
    const transformFn = async (file) => {
      let transform = sharp(file.path);
      if (angle) transform = transform.rotate(parseInt(angle));
      if (flipH === 'true') transform = transform.flop();
      if (flipV === 'true') transform = transform.flip();
      return transform.toBuffer();
    };

    if (req.files.length === 1) {
      const outputPath = path.join(__dirname, '../output', `modified_${req.files[0].filename}.jpg`);
      await fs.promises.writeFile(outputPath, await transformFn(req.files[0]));
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
