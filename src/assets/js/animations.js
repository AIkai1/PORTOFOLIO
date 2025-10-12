import { gsap } from '/gsap-public/esm/index.js';
import { SplitText } from '/gsap-public/esm/SplitText.js';

// Initialize GSAP animations
export function initAnimations() {
    // Set initial opacity for divs
    gsap.set("div", { opacity: 1 });
    
    // Create split text animation for welcome text
    let split = SplitText.create("#wel", { type: "chars" });
    gsap.registerPlugin(SplitText);
    gsap.from(split.chars, {
        y: 50,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 2, 
        ease: "power4"
    });
}

// Function to animate box transitions
export function animateBoxTransition(contentElement) {
    // Show and animate the selected box
    gsap.set(contentElement, { 
        display: "flex",
        x: -1500,
        opacity: 0
    });
    
    gsap.to(contentElement, {
        ease: "power4.out",
        x: 0,
        opacity: 1
    });
}
