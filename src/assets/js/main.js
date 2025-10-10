import { initLetterAnimation } from './letter.js';
import { initAnimations, animateBoxTransition} from './animations.js';

// Initialize all animations
initLetterAnimation();
initAnimations();

const navPages = [
    {button: document.getElementById("namel"), content: document.getElementById("startbox1")},
    {button: document.getElementById("abo"), content: document.getElementById("aboutbox2")},
    {button: document.getElementById("proj"), content: document.getElementById("projectbox3")},
    {button: document.getElementById("con"), content: document.getElementById("contactbox4")}
];

for (let i = 0; i < navPages.length; i++) {
    navPages[i].button.addEventListener("click", () => {
        // Hide all boxes and reset button colors
        navPages.forEach(page => {
            page.button.style.color = "#b5b5b5";
            page.content.style.display = "none";
        });
        
        // Update active button color
        navPages[i].button.style.color = "#ffffff";
        
        // Animate the selected box
        animateBoxTransition(navPages[i].content);
        
        console.log("Active button:", navPages[i].button.textContent);
        console.log(navPages[i].content);
    });
}