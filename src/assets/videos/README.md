# Video Background for Text Effect

## Setup Instructions

1. Add your video file to this directory
2. Name it `background.mp4` (or update the source path in `index.html`)
3. The video will automatically play and display through the text letters

## Recommended Video Specifications

- Format: MP4 (H.264 codec recommended)
- Resolution: 1920x1080 or higher
- Aspect Ratio: 16:9
- File Size: Keep under 10MB for optimal loading
- Duration: 10-30 seconds (since it loops)

## Example Video Sources

You can use free stock videos from:
- Pexels: https://www.pexels.com/videos/
- Pixabay: https://pixabay.com/videos/
- Coverr: https://coverr.co/

## Current Implementation

The video is displayed through the text using CSS `background-clip: text` with JavaScript canvas to capture and update video frames in real-time.
