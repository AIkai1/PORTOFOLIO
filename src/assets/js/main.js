import { initLetterAnimation } from './letter.js';
import { initAnimations, animateBoxTransition, animateContentExit, resetContentPosition, animateAboutText, clearAboutText } from './animations.js';
import { initNavigation } from './navigation.js';
import { initVideoTextEffect, replayGreetAnimation } from './videoTextEffect.js';

// Initialize all animations
initLetterAnimation();
initAnimations();
initVideoTextEffect();

const navPages = [
    {button: document.getElementById("namel"), content: document.getElementById("startbox1")},
    {button: document.getElementById("abo"), content: document.getElementById("aboutbox2")},
    {button: document.getElementById("proj"), content: document.getElementById("projectbox3")},
    {button: document.getElementById("con"), content: document.getElementById("contactbox4")}
];


let currentPageIndex = 0;

// Function to navigate to a specific page
function navigateToPage(targetIndex) {
    // Boundary check
    if (targetIndex < 0 || targetIndex >= navPages.length) return;
    
    // If clicking namel (home page), always reload
    if (targetIndex === 0) {
        location.reload();
        return;
    }
    
    // If already active, don't do anything
    if (window.getComputedStyle(navPages[targetIndex].content).display === "flex") return;
    if (navPages[targetIndex].button.id === "namel") {initLetterAnimation()};
    
    // Check if we're changing pages (not staying on the same page)
    const changingPages = targetIndex !== currentPageIndex;
    
    if (changingPages) {
        // Get the current page's content element
        const currentContent = navPages[currentPageIndex].content;
        // Animate current page content moving up and out first
        animateContentExit(currentContent, () => {
            // After content moves up, clear text if leaving about page
            if (currentPageIndex === 1) {
                clearAboutText();
            }
            // Then proceed with page transition
            proceedWithTransition(targetIndex);
        });
    } else {
        // No special animation needed, proceed normally
        proceedWithTransition(targetIndex);
    }
}

// Helper function to handle the actual page transition
function proceedWithTransition(targetIndex) {
    // Capture the previous page index before updating
    const previousPageIndex = currentPageIndex;
    
    // Hide all boxes and reset button colors
    navPages.forEach(page => {
        page.button.style.color = "#b5b5b5";
        page.content.style.display = "none";
        // Reset position for all content
        resetContentPosition(page.content);
    });

    // Determine slide direction based on current vs target page
    let xAnimationValue = targetIndex > currentPageIndex ? -1500 : 1500;
    
    console.log(`Navigating to: ${navPages[targetIndex].button.textContent}, Index: ${targetIndex}, Direction: ${xAnimationValue > 0 ? 'from left' : 'from right'}`);
    
    currentPageIndex = targetIndex;
    navPages[targetIndex].button.style.color = "#ffffff";
    
    // Animate box transition with callback
    animateBoxTransition(navPages[targetIndex].content, xAnimationValue, () => {
        // After animation completes, check if scrolling is needed
        if (targetIndex !== 0) {
            const contentElement = navPages[targetIndex].content;
            const isOverflowing = contentElement.scrollHeight > contentElement.clientHeight;
            
            if (isOverflowing) {
                // Enable scrolling only if content overflows
                contentElement.style.overflowY = 'auto';
            } else {
                contentElement.style.overflowY = 'hidden';
            }
        }
        
        // Trigger about text animation if we're on the about page
        if (targetIndex === 1) {
            // Pass the previous page index to control Malikhai's animation direction
            animateAboutText(previousPageIndex);
        }
    });
    
    // Control scrolling based on which page we're on
    if (targetIndex === 0) {
        // Disable scrolling on home page
        document.body.style.overflow = 'hidden';
    } else {
        // Initially hide overflow during animation
        navPages[targetIndex].content.style.overflowY = 'hidden';
    }
    
    // If navigating to home page (namel), just reload the page
    if (targetIndex === 0) {
        location.reload();
    }
}

for (let i = 0; i < navPages.length; i++) {
    navPages[i].button.addEventListener("click", () => {
        navigateToPage(i);
    });
}

initNavigation((direction) => {
    if (direction === "next") {
        navigateToPage(currentPageIndex + 1);
    } else if (direction === "previous") {
        navigateToPage(currentPageIndex - 1);
    }
});