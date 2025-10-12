// Keyboard and Mobile Navigation Controls

export function initNavigation(navigateCallback) {
    // Add keyboard navigation (arrow keys)
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            navigateCallback("next");
        } else if (event.key === "ArrowLeft") {
            navigateCallback("previous");
        }
    });

    // Add touch/swipe navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swiped right - go to previous page
                navigateCallback("previous");
            } else {
                // Swiped left - go to next page
                navigateCallback("next");
            }
        }
    }
}
