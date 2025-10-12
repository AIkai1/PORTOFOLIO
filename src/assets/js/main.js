import { initLetterAnimation } from './letter.js';
import { initAnimations, animateBoxTransition} from './animations.js';
import { initNavigation } from './navigation.js';

// Initialize all animations
initLetterAnimation();
initAnimations();

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
    
    // If already active, don't do anything
    if (window.getComputedStyle(navPages[targetIndex].content).display === "flex") return;
    if (navPages[targetIndex].button.id === "namel") {initLetterAnimation()};
    // Hide all boxes and reset button colors
    navPages.forEach(page => {
        page.button.style.color = "#b5b5b5";
        page.content.style.display = "none";
    });

    // Determine slide direction based on current vs target page
    let xAnimationValue = targetIndex > currentPageIndex ? -1500 : 1500;
    
    // Update current page index
    currentPageIndex = targetIndex;
    
    console.log(`Navigating to: ${navPages[targetIndex].button.textContent}, Index: ${targetIndex}, Direction: ${xAnimationValue > 0 ? 'from left' : 'from right'}`);
    
    navPages[targetIndex].button.style.color = "#ffffff";
    animateBoxTransition(navPages[targetIndex].content, xAnimationValue);
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