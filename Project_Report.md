# ConvertPro - Project Architecture Report

## Overview
ConvertPro is a modern, full-stack image processing web application built with a React (Vite) frontend and a Node.js (Express) backend. It features dynamic dark mode, glassmorphism UI design, and 12+ professional image processing tools.

## Frontend Architecture (React / Vite)
The frontend uses TailwindCSS for styling and Axios for API communication.

### Core Files
* **`frontend/src/main.jsx`**: The entry point of the React application.
* **`frontend/src/App.jsx`**: Configures React Router, mapping `/` to the Home page and `/tool/:id` to the dynamic ToolPage.
* **`frontend/src/index.css`**: Contains global Tailwind directives and custom CSS variables for the light/dark themes and animations.
* **`frontend/tailwind.config.js`**: Configures the Tailwind theme, extending colors (using `#4A90E2` for the primary accent) and enabling `class` based dark mode.

### Pages
* **`frontend/src/pages/Home.jsx`**: The landing page that displays a responsive grid of `ToolCard` components for all available image tools.
* **`frontend/src/pages/ToolPage.jsx`**: The core dynamic engine. It reads the URL parameter (e.g., `crop`, `ocr`) and dynamically renders the appropriate UI settings (sliders, text inputs) and handles API routing based on the selected tool.

### Components
* **`frontend/src/components/ui/UploadArea.jsx`**: A reusable Drag & Drop component that handles file selection and dynamically injects custom tool configurations before submission.
* **`frontend/src/components/ui/ToolCard.jsx`**: A stylistic card component used on the Home page.
* **`frontend/src/components/layout/Navbar.jsx`**: Contains the logo and the global Dark/Light mode toggle switch.
* **`frontend/src/components/layout/Footer.jsx`**: Displays copyright and credits (Website by HEMU).

## Backend Architecture (Node.js / Express)
The backend leverages `multer` for multipart form data uploads and powerful processing libraries like `sharp`, `tesseract.js`, and `potrace`.

### Core Files
* **`backend/server.js`**: The main Express server file. It configures CORS, initializes the server on port 5000, and mounts all the individual router modules.

### API Routes
* **`backend/routes/convert.js`**: Handles format conversions (JPG, PNG, WEBP). Supports batch uploads and uses `archiver` to return a ZIP file.
* **`backend/routes/compress.js`**: Uses `sharp` to reduce image quality and file size based on a user-defined percentage.
* **`backend/routes/edit.js`**: Contains endpoints for Resizing (width/height), Cropping (x/y coordinates), and Rotating/Flipping images natively.
* **`backend/routes/pdf.js`**: Stitches multiple uploaded images into a single PDF document.
* **`backend/routes/advanced.js`**: The powerhouse module containing 6 advanced features:
  * `/exif`: Extracts hidden EXIF metadata via `exifr`.
  * `/strip-exif`: Uses `sharp` to remove all metadata.
  * `/upscale`: Uses `sharp`'s Lanczos3 kernel to double or quadruple image resolution.
  * `/to-svg`: Traces pixels into scalable vectors using `potrace`.
  * `/favicon`: Generates a ZIP of web-ready `.ico` and `.png` icons in standard sizes.
  * `/ocr`: Extracts English text from screenshots using `tesseract.js`.
  * `/make-gif`: Compiles multiple images into an animated GIF using `gif-encoder-2`.
