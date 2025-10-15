import { gsap } from '/gsap-public/esm/index.js';
import { SplitText } from '/gsap-public/esm/SplitText.js';

// Initialize GSAP animations
export function initAnimations() {
    gsap.set("div:not(.meimage)", { opacity: 1 });
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
    
    // Reset meimage opacity to 0
    const meImage = document.querySelector('.meimage');
    if (meImage) {
        gsap.set(meImage, { opacity: 0 });
    }
}

// Store the current split instance
let currentAboutSplit = null;

// Function to animate about text with scatter and implosion effect
// fromPageIndex: 0 = home, 2 = project, 3 = contact
export function animateAboutText(fromPageIndex = 0) {
    const aboutText = document.querySelector('.about');
    if (!aboutText) return;
    
    // Capture Malikhai's current position BEFORE changing text
    const originalMalikhaiRect = aboutText.getBoundingClientRect();
    const parentRect = aboutText.parentElement.getBoundingClientRect();
    const originalMalikhaiX = originalMalikhaiRect.left - parentRect.left;
    
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
    
    // Store original positions BEFORE making them absolute
    const originalPositions = words.map(word => {
        const rect = word.getBoundingClientRect();
        const textParentRect = aboutText.getBoundingClientRect();
        return {
            x: rect.left - textParentRect.left,
            y: rect.top - textParentRect.top
        };
    });
    
    // Set initial state for all words - position absolute with original positions
    words.forEach((word, i) => {
        gsap.set(word, {
            position: "absolute",
            left: originalPositions[i].x,
            top: originalPositions[i].y
        });
    });
    
    // Determine if coming from project or contact page (should animate from right)
    const shouldAnimateFromRight = fromPageIndex === 2 || fromPageIndex === 3;
    
    // Set Malikhai and other words initial positions
    words.forEach((word, i) => {
        if (i === malikhaiIndex) {
            if (shouldAnimateFromRight) {
                // Malikhai starts from the right side of the page
                gsap.set(word, {
                    opacity: 1,
                    x: window.innerWidth - originalPositions[i].x,
                    y: 0
                });
            } else {
                // Malikhai starts from the bottom of the page (when coming from home)
                gsap.set(word, {
                    opacity: 1,
                    x: 0,
                    y: window.innerHeight - originalPositions[i].y
                });
            }
        } else {
            // Other words start off-screen horizontally
            const direction = Math.random() > 0.5 ? 1 : -1;
            const distance = gsap.utils.random(window.innerWidth * 2, window.innerWidth * 5);
            gsap.set(word, {
                opacity: 1,
                x: direction * distance
            });
        }
    });
    
    // Animate Malikhai smoothly to its correct position
    if (malikhaiIndex !== -1) {
        gsap.to(words[malikhaiIndex], {
            duration: 0.1,
            x: 0,
            y: 0,
            ease: "power2.out"
        });
    }
    
    // Wait for page transition to complete, then animate only the other words
    const otherWords = words.filter((_, i) => i !== malikhaiIndex);
    
    gsap.to(otherWords, {
        duration: 0.2,
        delay: 0.5,
        x: 0,
        ease: "power4.inOut",
        stagger: {
            amount: 0.3,
            from: "start"
        },
        onComplete: () => {
            // Temporarily switch to relative to get natural flow positions
            words.forEach(word => {
                gsap.set(word, {
                    position: 'relative',
                    left: 'auto',
                    top: 'auto',
                    x: 0,
                    y: 0
                });
            });
            
            // Force a reflow to get accurate positions
            aboutText.offsetHeight;
            
            // Store new positions
            const newPositions = words.map(word => {
                const rect = word.getBoundingClientRect();
                const textParentRect = aboutText.getBoundingClientRect();
                return {
                    x: rect.left - textParentRect.left,
                    y: rect.top - textParentRect.top
                };
            });
            
            // Switch back to absolute with new positions
            words.forEach((word, i) => {
                gsap.set(word, {
                    position: 'absolute',
                    left: newPositions[i].x,
                    top: newPositions[i].y,
                    x: 0,
                    y: 0
                });
            });
            
            // Add resize handler for responsiveness
            let resizeTimeout;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    // Temporarily switch to relative
                    words.forEach(word => {
                        gsap.set(word, {
                            position: 'relative',
                            left: 'auto',
                            top: 'auto',
                            x: 0,
                            y: 0
                        });
                    });
                    
                    // Force reflow
                    aboutText.offsetHeight;
                    
                    // Get new positions
                    const updatedPositions = words.map(word => {
                        const rect = word.getBoundingClientRect();
                        const textParentRect = aboutText.getBoundingClientRect();
                        return {
                            x: rect.left - textParentRect.left,
                            y: rect.top - textParentRect.top
                        };
                    });
                    
                    // Switch back to absolute with updated positions
                    words.forEach((word, i) => {
                        gsap.set(word, {
                            position: 'absolute',
                            left: updatedPositions[i].x,
                            top: updatedPositions[i].y,
                            x: 0,
                            y: 0
                        });
                    });
                }, 150);
            };
            
            window.addEventListener('resize', handleResize);
            
            // Smoothly fade in the meimage div after text animation completes
            const meImage = document.querySelector('.meimage');
            if (meImage) {
                gsap.to(meImage, {
                    opacity: 1,
                    duration: 1,
                    ease: "power2.inOut"
                });
            }
        }
    });
}
