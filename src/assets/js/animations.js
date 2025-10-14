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

// Function to clear about text
export function clearAboutText() {
    const aboutText = document.querySelector('.about');
    if (!aboutText) return;
    
    // Kill any existing animations
    gsap.killTweensOf(aboutText);
    gsap.killTweensOf('.about div');
    
    // Revert split if it exists
    if (currentAboutSplit) {
        currentAboutSplit.revert();
        currentAboutSplit = null;
    }
    
    // Clear the text content
    aboutText.textContent = '';
}

// Store the current split instance
let currentAboutSplit = null;

// Function to animate about text with scatter and implosion effect
export function animateAboutText() {
    const aboutText = document.querySelector('.about');
    if (!aboutText) return;
    
    // Set the text content
    aboutText.textContent = "Hello there! I'm Malikhai. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam deleniti amet ipsam reiciendis quisquam mollitia impedit dolor optio eius! Atque voluptatibus tempore eum, labore voluptatum aliquid harum aperiam fuga veniam.";
    
    // Kill any existing animations on the about text
    gsap.killTweensOf(aboutText);
    gsap.killTweensOf('.about div');
    
    // Revert previous split if it exists
    if (currentAboutSplit) {
        currentAboutSplit.revert();
        currentAboutSplit = null;
    }
    
    // Split text into words
    const split = new SplitText(aboutText, { type: "words" });
    currentAboutSplit = split;
    const words = split.words;
    
    // Find Malikhai word
    let malikhaiIndex = -1;
    words.forEach((word, index) => {
        if (word.textContent.toLowerCase().includes('malikhai')) {
            malikhaiIndex = index;
        }
    });
    
    // Store original positions
    const originalPositions = words.map(word => {
        return {
            x: word.offsetLeft,
            y: word.offsetTop
        };
    });
    
    // Set initial state for all words
    gsap.set(words, {
        opacity: 0,
        position: "absolute",
        y: (i) => originalPositions[i].y
    });
    
    // Malikhai starts at its correct position but hidden
    if (malikhaiIndex !== -1) {
        gsap.set(words[malikhaiIndex], {
            x: originalPositions[malikhaiIndex].x,
            opacity: 1
        });
    }
    
    // Other words start far off-screen and hidden
    words.forEach((word, i) => {
        if (i !== malikhaiIndex) {
            const direction = Math.random() > 0.5 ? 1 : -1;
            gsap.set(word, {
                x: direction * gsap.utils.random(window.innerWidth * 2, window.innerWidth * 5),
                opacity: 1
            });
        }
    });
    
    // Wait for page transition to complete (0.5s delay), then animate other words
    const wordsToAnimate = words.filter((_, i) => i !== malikhaiIndex);
    
    gsap.to(wordsToAnimate, {
        duration: 1,
        delay: 0.5,
        x: (i) => {
            // Get actual index in original array
            let actualIndex = 0;
            let count = 0;
            for (let j = 0; j < words.length; j++) {
                if (j !== malikhaiIndex) {
                    if (count === i) {
                        actualIndex = j;
                        break;
                    }
                    count++;
                }
            }
            return originalPositions[actualIndex].x;
        },
        ease: "power4.inOut",
        stagger: {
            amount: 0.3,
            from: "start"
        },
        onComplete: () => {
            // Reset position styles to relative instead of absolute
            gsap.set(words, {
                position: "relative",
                x: 0,
                y: 0
            });
        }
    });
}
