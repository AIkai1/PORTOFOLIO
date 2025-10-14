# Video File Setup Instructions

You have 4 video files. Rename them like this:

## Rename Your Files:

1. **5 MB file** → `background-low.mp4` (for mobile & slow connections)
2. **9.5 MB file** → `background-medium.mp4` (for normal connections)
3. **17.7 MB file** → `background-medium-high.mp4` (for 3G)
4. **30 MB file** → `background-high.mp4` (for fast WiFi/4G)

## How to Rename:

In your terminal, go to your videos folder:
```bash
cd src/assets/videos
```

Then rename (adjust the original filenames):
```bash
mv your-5mb-file.mp4 background-low.mp4
mv your-9.5mb-file.mp4 background-medium.mp4
mv your-17.7mb-file.mp4 background-medium-high.mp4
mv your-30mb-file.mp4 background-high.mp4
```

## What Happens Now:

✅ **Mobile users** → Get 5MB (SUPER fast load!)
✅ **Slow connections (2G)** → Get 5MB (instant)
✅ **Normal connections** → Get 9.5MB (fast & good quality)
✅ **Medium-fast (3G)** → Get 17.7MB (great quality)
✅ **Fast connections (4G)** → Get 30MB (BEST quality)
✅ **Data saver mode** → Get 5MB (respects user preference)

**Result:** Lightning fast on mobile, gorgeous on desktop! 🚀✨
