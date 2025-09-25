function page() {
const nameElement = document.getElementById("namel");
const targetText = "Malikhai Felix";
const initialText = 'abcdefghijklmn';
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&* ";

const charAnimationDuration = 200;
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
    setTimeout(startLetterByLetterAnimation, 500);
};

document.addEventListener("DOMContentLoaded", () => setTimeout(startLetterByLetterAnimation, 1000));

nameElement.addEventListener("click", nameLoad);
};
page();