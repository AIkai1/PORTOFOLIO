export function initLetterAnimation() {
    const nameElement = document.getElementById("namel");
    const targetText = "MDF";
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&* ";
    
    const getRandomChar = () => charset[Math.floor(Math.random() * charset.length)];
    
    const animateCharacter = (position, callback) => {
        let iterations = 0;
        const maxIterations = 4;
        
        const interval = setInterval(() => {
            const textArray = nameElement.textContent.split('');
            textArray[position] = getRandomChar();
            nameElement.textContent = textArray.join('');
            
            if (++iterations >= maxIterations) {
                clearInterval(interval);
                textArray[position] = targetText[position];
                nameElement.textContent = textArray.join('');
                setTimeout(callback, 50);
            }
        }, 50);
    };
    
    const animateAllCharacters = (position = 0) => {
        if (position < targetText.length) {
            animateCharacter(position, () => animateAllCharacters(position + 1));
        }
    };
    
    const resetAndAnimate = () => {
        nameElement.textContent = 'abc';
        setTimeout(animateAllCharacters, 50);
    };
    document.addEventListener("DOMContentLoaded", () => setTimeout(animateAllCharacters, 100));
    nameElement.addEventListener("click", resetAndAnimate);
}
