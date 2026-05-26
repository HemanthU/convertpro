const fs = require('fs');
const path = require('path');

const cleanup = () => {
  const dirs = [path.join(__dirname, '../uploads'), path.join(__dirname, '../output')];
  
  // Cleanup files older than 1 hour
  const CLEANUP_INTERVAL = 15 * 60 * 1000; // 15 mins
  const MAX_AGE = 60 * 60 * 1000; // 1 hour

  setInterval(() => {
    const now = Date.now();
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) return;
      fs.readdir(dir, (err, files) => {
        if (err) return console.error('Cleanup error:', err);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          fs.stat(filePath, (err, stats) => {
            if (err) return;
            if (now - stats.mtimeMs > MAX_AGE) {
              fs.unlink(filePath, err => {
                if (err) console.error('Failed to delete file:', filePath, err);
              });
            }
          });
        });
      });
    });
  }, CLEANUP_INTERVAL);
};

module.exports = cleanup;
