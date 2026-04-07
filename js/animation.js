// scroll-reveal.js logic
const revealElements = () => {
    const observerOptions = {
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Target sections and cards for a professional entry
    const targets = document.querySelectorAll('.info-container, .service-card, .hero-content, .faq-card, .about-content, .project-card');
    targets.forEach(target => observer.observe(target));
};

// Typewriter effect for the Hero Heading
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    const timer = setInterval(() => {
        if (i < text.length) {
            element.append(text.charAt(i));
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

document.addEventListener('DOMContentLoaded', () => {
    revealElements();
    const mainHeading = document.querySelector('.reveal-text');
    if (mainHeading) typeWriter(mainHeading, "Excellence Web Services");
});

// Add this helper to trigger animations smoothly
const checkReveal = () => {
    const triggerBottom = window.innerHeight / 5 * 4;
    const targets = document.querySelectorAll('.info-container, .service-card, .hero-content, .faq-card, .about-content, .slide-in-right, .slide-in-left, .project-card');

    targets.forEach(target => {
        const targetTop = target.getBoundingClientRect().top;
        if (targetTop < triggerBottom) {
            target.classList.add('active');
        }
    });
};

// Listen for scroll events
window.addEventListener('scroll', checkReveal);