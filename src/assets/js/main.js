// Slot machine animation for "Malikhai Felix" - LETTER BY LETTER
const nameElement = document.getElementById("namel");
const targetText = "Malikhai Felix"; // With space included in animation
const initialText = 'abcdefghijklmn'; // Starting text (14 characters to match)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&* ";

// Animation settings
const charAnimationDuration = 200; // How long each character animates (ms)
const charChangeInterval = 12.5; // How fast characters change during animation (ms)
const delayBetweenChars = 50; // Delay before next character starts (ms)

function getRandomChar() {
    return charset[Math.floor(Math.random() * charset.length)];
}

function animateSingleCharacter(position, callback) {
    let charIndex = 0;
    const maxChanges = charAnimationDuration / charChangeInterval;

    const interval = setInterval(() => {
        // Update this character's position with random char
        const currentText = nameElement.textContent.split('');
        currentText[position] = getRandomChar();
        nameElement.textContent = currentText.join('');

        charIndex++;

        // When animation time is up, set the correct character
        if (charIndex >= maxChanges) {
            clearInterval(interval);
            const finalText = nameElement.textContent.split('');
            finalText[position] = targetText[position];
            nameElement.textContent = finalText.join('');

            // Call callback to start next character
            setTimeout(callback, delayBetweenChars);
        }
    }, charChangeInterval);
}

function startLetterByLetterAnimation() {
    let currentPosition = 0;

    function animateNext() {
        if (currentPosition < targetText.length) {
            animateSingleCharacter(currentPosition, () => {
                currentPosition++;
                animateNext();
            });
        }
        // No need for final text change since space is already animated
    }

    // Start with first character
    animateNext();
}

function nameLoad() {
    // Reset to initial text
    nameElement.textContent = initialText;

    // Start animation after a brief delay
    setTimeout(() => {
        startLetterByLetterAnimation();
    }, 500);
}

// Start animation when page loads
document.addEventListener("DOMContentLoaded", () => {
    // Start animation after a brief delay
    setTimeout(() => {
        startLetterByLetterAnimation();
    }, 1000);
});

// Add click event to restart animation
nameElement.addEventListener("click", nameLoad);