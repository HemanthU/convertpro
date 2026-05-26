const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const exifr = require('exifr');
const potrace = require('potrace');
const Tesseract = require('tesseract.js');
const GIFEncoder = require('gif-encoder-2');

const upload = multer({ dest: 'uploads/' });

// 1. EXIF Viewer
router.post('/exif', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const metadata = await exifr.parse(req.file.path, { tiff: true, xmp: true, icc: true, iptc: true, exif: true, gps: true });
    res.json({ metadata: metadata || { message: "No EXIF data found" } });
  } catch (error) {
    res.status(500).json({ error: 'EXIF parse failed' });
  }
});

// 1.b EXIF Stripper
router.post('/strip-exif', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const outputPath = path.join(__dirname, '../output', `stripped_${req.file.filename}.jpg`);
    // Sharp strips EXIF by default
    await sharp(req.file.path).jpeg().toFile(outputPath);
    res.download(outputPath, 'stripped_image.jpg');
  } catch (error) {
    res.status(500).json({ error: 'EXIF stripping failed' });
  }
});

// 2. Image Upscaler
router.post('/upscale', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { factor = 2 } = req.body;
    const metadata = await sharp(req.file.path).metadata();
    const outputPath = path.join(__dirname, '../output', `upscaled_${req.file.filename}.png`);
    
    await sharp(req.file.path)
      .resize({
        width: Math.round(metadata.width * parseInt(factor)),
        kernel: sharp.kernel.lanczos3
      })
      .png()
      .toFile(outputPath);
      
    res.download(outputPath, `upscaled_${factor}x.png`);
  } catch (error) {
    res.status(500).json({ error: 'Upscale failed' });
  }
});

// 3. Raster to Vector (SVG)
router.post('/to-svg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const outputPath = path.join(__dirname, '../output', `vector_${req.file.filename}.svg`);
    
    potrace.trace(req.file.path, function(err, svg) {
      if (err) return res.status(500).json({ error: 'Trace failed' });
      fs.writeFileSync(outputPath, svg);
      res.download(outputPath, 'vectorized.svg');
    });
  } catch (error) {
    res.status(500).json({ error: 'SVG conversion failed' });
  }
});

// 4. Favicon Generator
router.post('/favicon', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const sizes = [16, 32, 192, 512];
    const zipPath = path.join(__dirname, '../output', `favicon_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver.create('zip', { zlib: { level: 9 } });
    
    output.on('close', () => res.download(zipPath, 'favicons.zip'));
    archive.pipe(output);
    
    for (let size of sizes) {
      const buffer = await sharp(req.file.path).resize(size, size).png().toBuffer();
      archive.append(buffer, { name: `favicon-${size}x${size}.png` });
      if (size === 32) archive.append(buffer, { name: 'favicon.ico' }); // mock ico
    }
    
    const appleBuffer = await sharp(req.file.path).resize(180, 180).png().toBuffer();
    archive.append(appleBuffer, { name: 'apple-touch-icon.png' });
    
    archive.finalize();
  } catch (error) {
    console.error("Favicon Error:", error);
    res.status(500).json({ error: 'Favicon generation failed' });
  }
});

// 5. OCR
router.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    res.json({ text: text || 'No text recognized.' });
  } catch (error) {
    res.status(500).json({ error: 'OCR failed' });
  }
});

// 6. GIF Maker
router.post('/make-gif', upload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    const { delay = 500 } = req.body;
    
    const metadata = await sharp(req.files[0].path).metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    const encoder = new GIFEncoder(width, height);
    encoder.setDelay(parseInt(delay));
    encoder.start();
    
    for (let file of req.files) {
      const buffer = await sharp(file.path)
        .resize(width, height)
        .ensureAlpha()
        .raw()
        .toBuffer();
      encoder.addFrame(buffer);
    }
    
    encoder.finish();
    const buffer = encoder.out.getData();
    
    const outputPath = path.join(__dirname, '../output', `animated_${Date.now()}.gif`);
    fs.writeFileSync(outputPath, buffer);
    
    res.download(outputPath, 'animated.gif');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'GIF making failed' });
  }
});

module.exports = router;
