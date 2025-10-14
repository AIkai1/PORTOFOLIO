// OPTIMIZED Canvas video text effect - FAST & SMOOTH
import { gsap } from "../../../gsap-public/esm/index.js";

// Store video player globally
let globalPlayer = null;
let globalVideo = null;
let globalCanvas = null;
let globalCtx = null;

export function initVideoTextEffect() {
    console.log('Initializing Video.js OPTIMIZED video text effect with adaptive quality...');
    
    const greetElement = document.querySelector('.greet');
    
    if (!greetElement) {
        console.error('Greet element not found!');
        return;
    }
    
    // Detect connection speed and choose best quality
    function getOptimalVideoSource() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isMobile = window.innerWidth < 768;
        
        // Default to medium quality
        let quality = 'background-medium.mp4'; // 9.5 MB
        
        if (isMobile) {
            // Mobile always gets lowest quality
            quality = 'background-low.mp4'; // 5 MB
            console.log('Mobile detected - using LOWEST quality (5MB)');
        } else if (connection) {
            const effectiveType = connection.effectiveType;
            const saveData = connection.saveData;
            
            if (saveData) {
                // User has data saver on
                quality = 'background-low.mp4'; // 5 MB
                console.log('Data saver ON - using LOWEST quality (5MB)');
            } else if (effectiveType === '4g') {
                // 4G connection - highest quality
                quality = 'background-high.mp4'; // 30 MB
                console.log('4G detected - using HIGHEST quality (30MB)');
            } else if (effectiveType === '3g') {
                // 3G connection - high-medium quality
                quality = 'background-medium-high.mp4'; // 17.7 MB
                console.log('3G detected - using HIGH-MEDIUM quality (17.7MB)');
            } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
                // Slow connection - lowest quality
                quality = 'background-low.mp4'; // 5 MB
                console.log('Slow connection (2G) - using LOWEST quality (5MB)');
            } else {
                // Default medium
                quality = 'background-medium.mp4'; // 9.5 MB
                console.log('Standard connection - using MEDIUM quality (9.5MB)');
            }
        } else {
            // Can't detect connection - use medium as safe default
            console.log('Connection detection unavailable - using MEDIUM quality (9.5MB)');
        }
        
        return `src/assets/videos/${quality}`;
    }
    
    // Initialize Video.js with optimal source
    const player = videojs('text-video', {
        controls: false,
        autoplay: true,
        loop: true,
        muted: true,
        preload: 'auto',
        fluid: false,
        sources: [{
            src: getOptimalVideoSource(),
            type: 'video/mp4'
        }]
    });
    
    // Wait for Video.js to be ready
    player.ready(function() {
        console.log('Video.js player is ready!');
        
        // Get the actual HTML5 video element from Video.js
        const video = player.el().querySelector('video');
        
        if (!video) {
            console.error('Video element not found!');
            return;
        }
        
        // Store globally
        globalPlayer = player;
        globalVideo = video;
        
        // Keep video hidden - only used as source
        video.style.opacity = '0';
        video.style.visibility = 'hidden';
        
        // Play the video
        player.play().then(() => {
            console.log('Video playing with Video.js!');
        }).catch(err => {
            console.error('Video play failed:', err);
        });
        
        // Set the text content first
        greetElement.innerHTML = 'MALIKHAI<br>FELIX';
        
        // Import and use SplitText for the original animation
        import('../../../gsap-public/esm/SplitText.js').then(({ SplitText }) => {
            gsap.registerPlugin(SplitText);
            
            // Create the original character animation
            const welcomeSplit = SplitText.create(".greet", { type: "chars" });
            gsap.from(welcomeSplit.chars, {
                x: () => gsap.utils.random(-150, 150),
                y: () => gsap.utils.random(-550, 550),
                stagger: 0.1,
                duration: 1.5,
                opacity: 0,
                ease: "power2.out",
                delay: 0.5
            });
        });
        
        // Wait for SplitText animation to complete (3 seconds total)
        setTimeout(() => {
        console.log('Animation complete! Replacing with plain text...');
        
        // Replace all the SplitText spans with simple plain text
        greetElement.innerHTML = 'MALIKHAI<br>FELIX';
        
        console.log('Plain text set! Now applying video effect...');
        
        // Create optimized canvas (reuse if exists)
        if (!globalCanvas) {
            globalCanvas = document.createElement('canvas');
            globalCtx = globalCanvas.getContext('2d', { 
                alpha: false,
                willReadFrequently: false
            });
        }
        const canvas = globalCanvas;
        const ctx = globalCtx;
        
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
    });
}

// Function to replay the greet animation - does EXACTLY what happens on initial load
export function replayGreetAnimation() {
    console.log('=== REPLAY GREET ANIMATION CALLED ===');
    
    const greetElement = document.querySelector('.greet');
    
    if (!greetElement) {
        console.error('Greet element not found!');
        return;
    }
    
    console.log('Before reset - color:', greetElement.style.color, 'background:', greetElement.style.background);
    
    // RESET all video effect styles to normal white text FIRST
    greetElement.style.background = 'none';
    greetElement.style.backgroundClip = 'border-box';
    greetElement.style.webkitBackgroundClip = 'border-box';
    greetElement.style.webkitTextFillColor = 'white';
    greetElement.style.color = 'white';
    greetElement.style.opacity = '1';
    
    console.log('After reset - color:', greetElement.style.color, 'text:', greetElement.textContent);
    
    // Set the text content
    greetElement.innerHTML = 'MALIKHAI<br>FELIX';
    
    console.log('Text set, starting SplitText animation...');
    
    // Import and use SplitText for the animation (EXACT SAME AS INITIAL LOAD)
    import('../../../gsap-public/esm/SplitText.js').then(({ SplitText }) => {
        gsap.registerPlugin(SplitText);
        
        console.log('SplitText loaded, creating animation...');
        
        // Create the character animation
        const welcomeSplit = SplitText.create(".greet", { type: "chars" });
        console.log('Split into', welcomeSplit.chars.length, 'characters');
        
        gsap.from(welcomeSplit.chars, {
            x: () => gsap.utils.random(-150, 150),
            y: () => gsap.utils.random(-550, 550),
            stagger: 0.1,
            duration: 1.5,
            opacity: 0,
            ease: "power2.out",
            delay: 0.5,
            onStart: () => console.log('Character animation STARTED'),
            onComplete: () => console.log('Character animation COMPLETE')
        });
    });
}
