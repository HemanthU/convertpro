const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// 100MB limit, up to 20 files
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Image to PDF
router.post('/images-to-pdf', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const imageBytes = fs.readFileSync(file.path);
      let image;
      
      // Attempt to embed based on mimetype
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (file.mimetype === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        // Unsuported format for direct embed, could use sharp to convert to jpeg first, but keeping simple for now
        continue;
      }
      
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, '../output', `${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'converted.pdf');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

module.exports = router;
