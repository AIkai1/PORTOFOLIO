import { gsap } from '/gsap-public/esm/index.js';
import { SplitText } from '/gsap-public/esm/SplitText.js';
import { initLetterAnimation } from './letter.js';

initLetterAnimation();

gsap.set("div", { opacity: 1 });
let split = SplitText.create("#wel", { type: "chars" });
gsap.registerPlugin(SplitText);
gsap.from(split.chars, {
  y: 50,
  autoAlpha: 0,
  stagger: 0.05,
  duration: 2, 
  ease: "circ"
});

const navPages = [
    {button: document.getElementById("namel"), content: document.getElementById("startbox1")},
    {button: document.getElementById("abo"), content: document.getElementById("aboutbox2")},
    {button: document.getElementById("proj"), content: document.getElementById("projectbox3")},
    {button: document.getElementById("con"), content: document.getElementById("contactbox4")}
];

for (let i = 0; i < navPages.length; i++) {
    navPages[i].button.addEventListener("click", () => {
        navPages.forEach(page => {
            page.button.style.color = "#b5b5b5";
            page.content.style.display = "none"
        });
        navPages[i].button.style.color = "#ffffff";
        navPages[i].content.style.display = "block";
        console.log("Active button:", navPages[i].button.textContent);
        console.log(navPages[i].content);
    });
}