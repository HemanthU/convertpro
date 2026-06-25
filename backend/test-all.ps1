$ErrorActionPreference = "Stop"

$endpoints = @(
    @{ name="Convert to PNG"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"images=@test-render.jpg`" -F `"toFormat=png`" http://localhost:5000/api/convert" }
    @{ name="Convert to WEBP"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"images=@test-render.jpg`" -F `"toFormat=webp`" http://localhost:5000/api/convert" }
    @{ name="Convert to AVIF"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"images=@test-render.jpg`" -F `"toFormat=avif`" http://localhost:5000/api/convert" }
    @{ name="Convert to TIFF"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"images=@test-render.jpg`" -F `"toFormat=tiff`" http://localhost:5000/api/convert" }
    @{ name="Compress"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"quality=80`" http://localhost:5000/api/compress" }
    @{ name="Resize"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"width=300`" -F `"height=300`" http://localhost:5000/api/edit/resize" }
    @{ name="Crop"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"top=1`" -F `"left=1`" -F `"width=2`" -F `"height=2`" http://localhost:5000/api/edit/crop" }
    @{ name="Rotate"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"angle=90`" http://localhost:5000/api/edit/rotate-flip" }
    
    @{ name="Upscale"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"factor=2`" http://localhost:5000/api/advanced/upscale" }
    @{ name="To SVG"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" http://localhost:5000/api/advanced/to-svg" }
    @{ name="Favicon Generator"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" http://localhost:5000/api/advanced/favicon" }
    @{ name="OCR"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" http://localhost:5000/api/advanced/ocr" }
    @{ name="Grid Splitter"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" http://localhost:5000/api/advanced/grid-splitter" }
    @{ name="Color Extractor"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" http://localhost:5000/api/advanced/extract-colors" }
    @{ name="Social Packager"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" http://localhost:5000/api/advanced/social-packager" }
    @{ name="Image to Base64"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" http://localhost:5000/api/advanced/image-to-base64" }
    @{ name="Watermark"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"text=Test`" http://localhost:5000/api/advanced/watermark" }
    @{ name="Meme Generator"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"topText=TOP`" -F `"bottomText=BOTTOM`" http://localhost:5000/api/advanced/meme" }
    @{ name="Filters"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"filter=grayscale`" http://localhost:5000/api/advanced/filters" }
    @{ name="Stego Encode"; cmd="curl.exe -s -o /dev/null -w `"%{http_code}`" -X POST -F `"image=@test-render.jpg`" -F `"message=Secret`" http://localhost:5000/api/advanced/stego-encode" }
)

Write-Host "--- Running Comprehensive Endpoint Tests ---"
$successCount = 0
$failCount = 0

foreach ($endpoint in $endpoints) {
    Write-Host "Testing $($endpoint.name)... " -NoNewline
    $result = Invoke-Expression $endpoint.cmd
    
    if ($result -eq "200") {
        Write-Host "✅ PASSED" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "❌ FAILED (HTTP $result)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "--------------------------------------------"
Write-Host "Results: $successCount Passed | $failCount Failed"
