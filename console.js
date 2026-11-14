document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    if (!slider || slides.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    const intervalMs = 3500;

    function goToSlide(index) {
        slider.scrollTo({
            left: slides[index].offsetLeft - slides[0].offsetLeft,
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

    let interval;
    const stop = () => clearInterval(interval);
    const start = () => { stop(); if (!document.hidden) interval = setInterval(nextSlide, intervalMs); };
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('touchstart', stop, { passive: true });
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    start();
});

