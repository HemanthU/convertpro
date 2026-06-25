const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
const testImagePath = 'test-render.jpg';

async function testEndpoint(name, url, appendFormData, isMultiple = false) {
  try {
    const formData = new FormData();
    if (isMultiple) {
      formData.append('images', fs.createReadStream(testImagePath));
      formData.append('images', fs.createReadStream(testImagePath));
    } else {
      formData.append('image', fs.createReadStream(testImagePath));
    }
    
    if (appendFormData) appendFormData(formData);
    
    const res = await axios.post(url, formData, {
      headers: formData.getHeaders(),
      responseType: 'arraybuffer'
    });
    
    console.log(`✅ [PASS] ${name} -> Status: ${res.status}, Type: ${res.headers['content-type']}`);
  } catch (err) {
    const errData = err.response && err.response.data ? Buffer.from(err.response.data).toString('utf8') : err.message;
    console.error(`❌ [FAIL] ${name} -> ${errData}`);
  }
}

async function runTests() {
  console.log("--- Starting Comprehensive Node.js Test ---");
  
  // Format Conversion
  await testEndpoint("Convert Single", `${API_URL}/convert`, fd => fd.append('toFormat', 'png'));
  await testEndpoint("Convert Multiple", `${API_URL}/convert`, fd => fd.append('toFormat', 'png'), true);
  
  // Advanced
  await testEndpoint("Favicon Generator", `${API_URL}/advanced/favicon`, null);
  await testEndpoint("Grid Splitter", `${API_URL}/advanced/grid-splitter`, null);
  await testEndpoint("Social Packager", `${API_URL}/advanced/social-packager`, null);
  await testEndpoint("Color Extractor", `${API_URL}/advanced/extract-colors`, null);
  await testEndpoint("EXIF", `${API_URL}/advanced/exif`, null);
  await testEndpoint("Image to Base64", `${API_URL}/advanced/image-to-base64`, null);
  await testEndpoint("Watermark", `${API_URL}/advanced/watermark`, fd => fd.append('text', 'Test'));
  await testEndpoint("Meme", `${API_URL}/advanced/meme`, fd => { fd.append('topText', 'Top'); fd.append('bottomText', 'Bottom'); });
  await testEndpoint("Filters", `${API_URL}/advanced/filters`, fd => fd.append('filter', 'grayscale'));
  await testEndpoint("GIF Maker", `${API_URL}/advanced/make-gif`, fd => fd.append('delay', '500'), true);
  await testEndpoint("Stego Encode", `${API_URL}/advanced/stego-encode`, fd => fd.append('message', 'Secret'));
  await testEndpoint("Stego Decode", `${API_URL}/advanced/stego-decode`, null);
  
  console.log("--- Finished Tests ---");
}

runTests();
