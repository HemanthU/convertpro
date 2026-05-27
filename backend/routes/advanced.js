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

// 7. Grid Splitter (3x3)
router.post('/grid-splitter', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const metadata = await sharp(req.file.path).metadata();
    const cellWidth = Math.floor(metadata.width / 3);
    const cellHeight = Math.floor(metadata.height / 3);
    
    const zipPath = path.join(__dirname, '../output', `grid_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => res.download(zipPath, 'instagram_grid.zip'));
    archive.pipe(output);

    let counter = 1;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const buffer = await sharp(req.file.path)
          .extract({ left: col * cellWidth, top: row * cellHeight, width: cellWidth, height: cellHeight })
          .png().toBuffer();
        archive.append(buffer, { name: `grid_${counter}.png` });
        counter++;
      }
    }
    archive.finalize();
  } catch (error) { res.status(500).json({ error: 'Grid Split failed' }); }
});

// 8. Extract Colors (5-Color Palette)
router.post('/extract-colors', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const buffer = await sharp(req.file.path).resize(5, 1, { fit: 'fill' }).raw().toBuffer();
    const colors = [];
    for (let i = 0; i < 5; i++) {
      const r = buffer[i * 3]; const g = buffer[i * 3 + 1]; const b = buffer[i * 3 + 2];
      colors.push(`#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`);
    }
    res.json({ colors });
  } catch (error) { res.status(500).json({ error: 'Color Extraction failed' }); }
});

// 9. Social Packager
router.post('/social-packager', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const zipPath = path.join(__dirname, '../output', `social_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => res.download(zipPath, 'social_pack.zip'));
    archive.pipe(output);

    const sizes = [
      { name: 'Instagram_Square.png', w: 1080, h: 1080 },
      { name: 'Twitter_Header.png', w: 1500, h: 500 },
      { name: 'YouTube_Thumbnail.png', w: 1280, h: 720 },
      { name: 'Instagram_Story.png', w: 1080, h: 1920 }
    ];
    for (let s of sizes) {
      const buf = await sharp(req.file.path).resize(s.w, s.h, { fit: 'cover' }).png().toBuffer();
      archive.append(buf, { name: s.name });
    }
    archive.finalize();
  } catch (error) { res.status(500).json({ error: 'Social Packager failed' }); }
});

// 10. HEIC to JPG
router.post('/heic-to-jpg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const heicConvert = require('heic-convert');
    const inputBuffer = fs.readFileSync(req.file.path);
    const jpegBuffer = await heicConvert({ buffer: inputBuffer, format: 'JPEG', quality: 1 });
    const outputPath = path.join(__dirname, '../output', `heic_converted_${Date.now()}.jpg`);
    fs.writeFileSync(outputPath, jpegBuffer);
    res.download(outputPath, 'converted.jpg');
  } catch (error) { res.status(500).json({ error: 'HEIC Conversion failed' }); }
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

// 12. Watermark
router.post('/watermark', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { text = "© Watermark" } = req.body;
    const metadata = await sharp(req.file.path).metadata();
    const svgText = `<svg width="${metadata.width}" height="${metadata.height}">
      <text x="95%" y="95%" text-anchor="end" fill="white" font-size="${Math.max(20, metadata.width * 0.05)}" font-family="Arial, sans-serif" font-weight="bold" opacity="0.7">${text}</text>
    </svg>`;
    const outputPath = path.join(__dirname, '../output', `watermark_${Date.now()}.png`);
    await sharp(req.file.path).composite([{ input: Buffer.from(svgText), blend: 'over' }]).png().toFile(outputPath);
    res.download(outputPath, 'watermarked.png');
  } catch (error) { res.status(500).json({ error: 'Watermark failed' }); }
});

// 13. Meme Generator
router.post('/meme', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { topText = "", bottomText = "" } = req.body;
    const metadata = await sharp(req.file.path).metadata();
    const fontSize = Math.max(30, metadata.width * 0.08);
    const svgText = `<svg width="${metadata.width}" height="${metadata.height}">
      <style> .meme { fill: white; font-family: Impact, sans-serif; font-size: ${fontSize}px; font-weight: bold; text-anchor: middle; stroke: black; stroke-width: ${fontSize * 0.05}px; } </style>
      <text x="50%" y="${fontSize * 1.2}" class="meme">${topText.toUpperCase()}</text>
      <text x="50%" y="${metadata.height - (fontSize * 0.5)}" class="meme">${bottomText.toUpperCase()}</text>
    </svg>`;
    const outputPath = path.join(__dirname, '../output', `meme_${Date.now()}.png`);
    await sharp(req.file.path).composite([{ input: Buffer.from(svgText), blend: 'over' }]).png().toFile(outputPath);
    res.download(outputPath, 'meme.png');
  } catch (error) { res.status(500).json({ error: 'Meme failed' }); }
});

// 14. Image Filters
router.post('/filters', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { filter = "grayscale" } = req.body;
    const outputPath = path.join(__dirname, '../output', `filter_${Date.now()}.png`);
    let img = sharp(req.file.path);
    if (filter === 'grayscale') img = img.grayscale();
    if (filter === 'blur') img = img.blur(10);
    if (filter === 'sepia') img = img.recomb([[0.393, 0.769, 0.189],[0.349, 0.686, 0.168],[0.272, 0.534, 0.131]]);
    await img.png().toFile(outputPath);
    res.download(outputPath, 'filtered.png');
  } catch (error) { res.status(500).json({ error: 'Filter failed' }); }
});

// 15. Steganography Encode
router.post('/stego-encode', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { message = "" } = req.body;
    const { data, info } = await sharp(req.file.path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    
    const msgBuffer = Buffer.from(message + '\0', 'utf8');
    let msgBits = [];
    for(let i=0; i<msgBuffer.length; i++){
      for(let b=7; b>=0; b--) msgBits.push((msgBuffer[i] >> b) & 1);
    }
    
    if (msgBits.length > data.length) return res.status(400).json({ error: 'Message too long for this image' });
    for(let i=0; i<msgBits.length; i++){
      data[i] = (data[i] & ~1) | msgBits[i];
    }
    
    const outputPath = path.join(__dirname, '../output', `encoded_${Date.now()}.png`);
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(outputPath);
    res.download(outputPath, 'secret_encoded.png');
  } catch (error) { res.status(500).json({ error: 'Stego Encode failed' }); }
});

// 16. Steganography Decode
router.post('/stego-decode', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { data } = await sharp(req.file.path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    
    let message = '';
    let charCode = 0;
    let bitCount = 0;
    for(let i=0; i<data.length; i++){
      charCode = (charCode << 1) | (data[i] & 1);
      bitCount++;
      if (bitCount === 8) {
        if (charCode === 0) break;
        message += String.fromCharCode(charCode);
        charCode = 0;
        bitCount = 0;
      }
    }
    res.json({ message: message || 'No secret message found.' });
  } catch (error) { res.status(500).json({ error: 'Stego Decode failed' }); }
});

module.exports = router;
