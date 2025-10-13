// GSAP Animation for letter hover effects
import { gsap } from "../../../gsap-public/esm/index.js";

// Initialize letter hover animations
function initLetterHoverEffects() {
    // Wait for the initial letter loading animation to complete
    // The SplitText animation has 0.5s delay + 1.5s duration = 2s total
    setTimeout(() => {
        const letters = document.querySelectorAll('.mane');
        
        letters.forEach(letter => {
        // Set initial state
        gsap.set(letter, {
            backgroundColor: 'rgba(0,0,0,0)',
            color: 'white',
            width: 'auto',
            height: 'auto',
            margin: '1px'
        });

        // Create hover timeline
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl.to(letter, {
            backgroundColor: 'red',
            color: 'transparent',
            width: '0.9em',
            height: '0.9em',
            margin: '15px',
            duration: 0.2,
            ease: "power2.out"
        });

        // More precise hover detection - only on text content
        letter.addEventListener('mousemove', (e) => {
            const rect = letter.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create a small buffer zone around the actual letter
            const buffer = 2;
            const textWidth = letter.scrollWidth;
            const textHeight = letter.scrollHeight;
            
            // Check if mouse is over the actual text area (with small buffer)
            if (x >= buffer && x <= textWidth - buffer && 
                y >= buffer && y <= textHeight - buffer) {
                if (hoverTl.progress() === 0) {
                    hoverTl.play();
                }
            }
        });

        // Mouse leave event
        letter.addEventListener('mouseleave', () => {
            hoverTl.reverse().eventCallback('onReverseComplete', () => {
                gsap.set(letter, { backgroundColor: 'rgba(0,0,0,0)' });
            });
        });
        });
    }, 2500); // Wait 2.5 seconds for the initial animation to complete
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLetterHoverEffects();
});

export { initLetterHoverEffects };