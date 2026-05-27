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
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      res.download(zipPath, 'favicons.zip');
    });
    
    archive.on('error', (err) => {
      throw err;
    });

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

// 11. Image to Base64
router.post('/image-to-base64', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const base64 = fs.readFileSync(req.file.path, 'base64');
    const ext = path.extname(req.file.originalname).substring(1) || 'png';
    res.json({ base64: `data:image/${ext};base64,${base64}` });
  } catch (error) { res.status(500).json({ error: 'Base64 failed' }); }
});

module.exports = router;
