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
    
    // Note: .greet animation is now handled in videoTextEffect.js
    // so it can be replayed when returning to the home page
}

// Function to animate box transitions
export function animateBoxTransition(contentElement, xValue, onComplete) {
    // Show and animate the selected box
    gsap.set(contentElement, { 
        display: "flex",
        x: xValue,
    });
    
    gsap.to(contentElement, {
        ease: "power1.outin",
        x: 0,
        onComplete: onComplete
    });
}

// Function to animate content exiting (moving up and out)
export function animateContentExit(contentElement, callback) {
    gsap.to(contentElement, {
        y: -window.innerHeight,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: callback
    });
}

// Function to reset content position
export function resetContentPosition(contentElement) {
    gsap.set(contentElement, { y: 0, opacity: 1 });
}
