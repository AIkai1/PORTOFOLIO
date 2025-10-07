import { gsap } from '/gsap-public/esm/index.js';
import { SplitText } from '/gsap-public/esm/SplitText.js';

function page() {
const nameElement = document.getElementById("namel");

const targetText = "Malikhai Felix";
const initialText = 'abcdefghijklmn';
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&* ";

const charAnimationDuration = 50;
const charChangeInterval = 12.5;
const delayBetweenChars = 50;

const getRandomChar = () => charset[Math.floor(Math.random() * charset.length)];

const animateSingleCharacter = (position, callback) => {
    let charIndex = 0;
    const maxChanges = charAnimationDuration / charChangeInterval;
    const interval = setInterval(() => {
        const currentText = nameElement.textContent.split('');
        currentText[position] = getRandomChar();
        nameElement.textContent = currentText.join('');
        charIndex++;
        if (charIndex >= maxChanges) {
            clearInterval(interval);
            const finalText = nameElement.textContent.split('');
            finalText[position] = targetText[position];
            nameElement.textContent = finalText.join('');
            setTimeout(callback, delayBetweenChars);
        }
    }, charChangeInterval);
};

const startLetterByLetterAnimation = () => {
    let currentPosition = 0;
    const animateNext = () => {
        if (currentPosition < targetText.length) {
            animateSingleCharacter(currentPosition, () => {
                currentPosition++;
                animateNext();
            });
        }
    };
    animateNext();
};

const nameLoad = () => {
    nameElement.textContent = initialText;
    setTimeout(startLetterByLetterAnimation, 100);
};

document.addEventListener("DOMContentLoaded", () => setTimeout(startLetterByLetterAnimation, 1000));

nameElement.addEventListener("click", nameLoad);
};
page();

gsap.set("div", { opacity: 1 });
let split = SplitText.create("#wel", { type: "chars" });
gsap.registerPlugin(SplitText);
gsap.from(split.chars, {
  y: 400,
  autoAlpha: 0,
  stagger: 0.05,
  duration: 0.1,  // Duration in seconds (1500ms)
});

const navPages = [
    {button: document.getElementById("namel"), content: document.getElementById("box1")},
    {button: document.getElementById("abo"), content: document.getElementById("box2")},
    {button: document.getElementById("proj"), content: document.getElementById("box3")},
    {button: document.getElementById("con"), content: document.getElementById("box4")}
];


for (let i = 0; i < navPages.length; i++) {
    navPages[i].button.addEventListener("click", () => {
        navPages.forEach(page => {
            page.button.style.color = "#b5b5b5";
        });
        navPages[i].button.style.color = "#ffffff";
        console.log("Active button:", navPages[i].button.textContent);
    });
}