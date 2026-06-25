const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const imagePath = path.join(__dirname, 'test-render.jpg');

async function testEndpoint(name, url, formDataParams = {}) {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    for (const [k, v] of Object.entries(formDataParams)) {
      form.append(k, v);
    }
    
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
      responseType: 'arraybuffer'
    });
    console.log(`✅ ${name}: Success (${response.status}) - Size: ${response.data.length} bytes`);
  } catch (error) {
    const errMsg = error.response ? error.response.data.toString() : error.message;
    console.error(`❌ ${name}: Failed - ${errMsg}`);
  }
}

async function runTests() {
  console.log('--- Running Tests ---');
  await testEndpoint('favicon', 'http://localhost:5000/api/advanced/favicon');
  await testEndpoint('heic-to-jpg', 'http://localhost:5000/api/advanced/heic-to-jpg');
  await testEndpoint('svg-to-png', 'http://localhost:5000/api/svg-to-png');
  await testEndpoint('convert', 'http://localhost:5000/api/convert', { toFormat: 'png' });
}

runTests();
