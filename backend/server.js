const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads and output directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Routes
app.use('/api/convert', require('./routes/convert'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/compress', require('./routes/compress'));
app.use('/api/edit', require('./routes/edit'));
app.use('/api/advanced', require('./routes/advanced'));

// Test Route
app.get('/', (req, res) => {
  res.send('Image Converter API is running...');
});

// Clean up utility task every 15 minutes (or as needed)
require('./utils/cleanup')();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
