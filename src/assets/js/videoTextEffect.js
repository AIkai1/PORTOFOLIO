// OPTIMIZED Canvas video text effect - FAST & SMOOTH
import { gsap } from "../../../gsap-public/esm/index.js";

export function initVideoTextEffect() {
    console.log('Initializing OPTIMIZED video text effect...');
    const video = document.getElementById('text-video');
    const greetElement = document.querySelector('.greet');
    
    if (!video || !greetElement) {
        console.error('Video or greet element not found!');
        return;
    }
    
    // Keep video hidden - only used as source
    video.style.opacity = '0';
    video.style.visibility = 'hidden';
    
    // Play the video
    video.play().then(() => {
        console.log('Video playing!');
    }).catch(err => {
        console.error('Video play failed:', err);
    });
    
    // Wait for SplitText animation to complete (3 seconds total)
    setTimeout(() => {
        console.log('Animation complete! Replacing with plain text...');
        
        // Replace all the SplitText spans with simple plain text
        greetElement.innerHTML = 'MALIKHAI<br>FELIX';
        
        console.log('Plain text set! Now applying video effect...');
        
        // Create optimized canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { 
            alpha: false,
            willReadFrequently: false
        });
        
        // Set canvas size to match video
        canvas.width = video.videoWidth || 1920;
        canvas.height = video.videoHeight || 1080;
        
        let videoOpacity = 0;
        let lastUpdate = 0;
        const FPS = 30;
        const frameInterval = 1000 / FPS;
        
        // Keep text WHITE initially - will apply video effect gradually
        greetElement.style.color = 'white';
        
        function updateVideoBackground(currentTime) {
            // Throttle to 30 FPS
            if (currentTime - lastUpdate < frameInterval) {
                requestAnimationFrame(updateVideoBackground);
                return;
            }
            lastUpdate = currentTime;
            
            if (video.readyState === video.HAVE_ENOUGH_DATA && videoOpacity > 0) {
                // Draw white background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw video with current opacity
                ctx.globalAlpha = videoOpacity;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
                
                // Convert to data URL
                const dataURL = canvas.toDataURL('image/jpeg', 0.85);
                
                // Apply background clipping to text
                greetElement.style.background = `url(${dataURL})`;
                greetElement.style.backgroundPosition = 'center center';
                greetElement.style.backgroundSize = 'cover';
                greetElement.style.backgroundAttachment = 'fixed';
                greetElement.style.webkitBackgroundClip = 'text';
                greetElement.style.backgroundClip = 'text';
                greetElement.style.webkitTextFillColor = 'transparent';
                greetElement.style.color = 'transparent';
            }
            
            requestAnimationFrame(updateVideoBackground);
        }
        
        // Start animation loop
        requestAnimationFrame(updateVideoBackground);
        
        // Smoothly fade in the video opacity
        gsap.to({ value: 0 }, {
            value: 1,
            duration: 2.5,
            ease: 'power2.inOut',
            onUpdate: function() {
                videoOpacity = this.targets()[0].value;
            },
            onComplete: () => {
                console.log('Video effect fully transitioned!');
            }
        });
        
    }, 3000);
}
