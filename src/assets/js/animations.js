import { gsap } from '/gsap-public/esm/index.js';
import { SplitText } from '/gsap-public/esm/SplitText.js';

// Initialize GSAP animations
export function initAnimations() {
    gsap.set("div", { opacity: 1 });
    gsap.registerPlugin(SplitText);
    
    // Animate navigation menu
    const navSplit = SplitText.create("#wel", { type: "chars" });
    gsap.from(navSplit.chars, {
        y: 50,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 2, 
        ease: "power4"
    });
    
    // Animate welcome text letters
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
}

// Function to animate box transitions
export function animateBoxTransition(contentElement, xValue) {
    // Show and animate the selected box
    gsap.set(contentElement, { 
        display: "flex",
        x: xValue,
    });
    
    gsap.to(contentElement, {
        ease: "power1.outin",
        x: 0,
    });
}
