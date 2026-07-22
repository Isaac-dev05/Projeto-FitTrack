document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    const intervalMs = 3500;

    function goToSlide(index) {
        const slideWidth = slider.clientWidth;
        slider.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
    }

    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    });

    setInterval(nextSlide, intervalMs);
});

