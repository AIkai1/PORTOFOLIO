// GSAP Animation for letter hover effects
import { gsap } from "../../../gsap-public/esm/index.js";

// Initialize video text effect  
function initVideoTextEffect() {
    console.log('Initializing video text effect...');
    const video = document.getElementById('text-video');
    const greetElement = document.querySelector('.greet');
    
    if (!video || !greetElement) {
        console.error('Video or greet element not found!');
        return;
    }
    
    // Play the video
    video.play().then(() => {
        console.log('Video playing!');
    }).catch(err => {
        console.error('Video play failed:', err);
    });
    
    // Wait for SplitText animation to complete (2.5 seconds)
    setTimeout(() => {
        console.log('Animation complete! Replacing with plain text...');
        
        // Replace all the SplitText spans with simple plain text
        greetElement.innerHTML = 'MALIKHAI<br>FELIX';
        
        console.log('Plain text set! Now applying video effect...');
        
        // Create regular canvas for better compatibility
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { 
            alpha: false,
            willReadFrequently: false 
        });
        
        // Set canvas size to match video
        canvas.width = video.videoWidth || 1920;
        canvas.height = video.videoHeight || 1080;
        
        let videoOpacity = 0;
        
        // Optimized update function
        function updateVideoBackground() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                // Draw white background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw video with fade opacity
                ctx.globalAlpha = videoOpacity;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1;
                
                // Use data URL to avoid blob flickering
                const dataURL = canvas.toDataURL('image/jpeg', 0.8);
                
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
        
        // Start updates
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
        
    }, 2500); // Wait 2.5 seconds before applying video effect
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initVideoTextEffect();
});

export { initVideoTextEffect };