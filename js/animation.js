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
    
    // Splash Screen Hiding
    const splash = document.getElementById('splash-screen');
    setTimeout(() => {
        if (splash) {
            splash.classList.add('hidden');
        }
    }, 2000);

    const mainHeading = document.querySelector('.reveal-text');
    if (mainHeading) {
        typeWriter(mainHeading, "Designing the Future, Together.");
    }

    // Initialize Animations
    initHeroCanvas();
    initHeroParallax();
    initProjectWheel();
});

// Hero Canvas Constellation System
const initHeroCanvas = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let mouse = { x: null, y: null, radius: 150 };

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 2 + 1;
            this.baseSize = this.size;
        }

        update() {
            // Mouse Interaction
            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= (dx / distance) * force * 5;
                    this.y -= (dy / distance) * force * 5;
                }
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
            ctx.fill();
        }
    }

    const init = () => {
        particles = [];
        let numberOfParticles = (width * height) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    };

    const connect = () => {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.hypot(dx, dy);

                if (distance < 150) {
                    opacityValue = 1 - (distance / 150);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${opacityValue * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connect();
        requestAnimationFrame(animate);
    };

    init();
    animate();
};


// Parallax Effect for Hero
const initHeroParallax = () => {
    const hero = document.querySelector('.hero-section');
    const floatingImg = document.querySelector('.floating-img');
    const mainOrb = document.querySelector('.main-orb');
    const secondaryOrb = document.querySelector('.secondary-orb');

    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        if (floatingImg) floatingImg.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px)`;
        if (mainOrb) mainOrb.style.transform = `translate(${moveX * 5}px, ${moveY * 5}px)`;
        if (secondaryOrb) secondaryOrb.style.transform = `translate(${moveX * -3}px, ${moveY * -3}px)`;
    });
};

// Removed duplicate listener

// 3D Orbital Project Wheel Logic
const initProjectWheel = () => {
    const wheel = document.querySelector('.wheel-inner');
    const cards = document.querySelectorAll('.wheel-card');
    const nextBtn = document.getElementById('wheel-next');
    const prevBtn = document.getElementById('wheel-prev');
    const progressBar = document.getElementById('wheel-bar');

    if (!wheel || cards.length === 0) {
        console.warn("Orbital Wheel: Initial elements missing!", { wheel, cards_count: cards.length });
        return;
    }

    console.log("Orbital Wheel: Initializing...", {
        cards: cards.length,
        nextBtn: !!nextBtn,
        prevBtn: !!prevBtn
    });

    let currentIndex = 1; // Start at first original card (not clone)
    let isAutoScrolling = true;
    let autoScrollTimer;
    let isTransitioning = false;

    // --- INFINITE CLONING LOGIC ---
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);
    
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    
    wheel.appendChild(firstClone);
    wheel.prepend(lastClone);
    
    // Re-query cards to include clones
    const allCards = document.querySelectorAll('.wheel-card');
    const totalOriginals = cards.length;
    
    const getLayout = () => {
        const firstCard = allCards[0];
        const style = window.getComputedStyle(firstCard);
        const cardWidth = firstCard.offsetWidth;
        const gap = parseInt(window.getComputedStyle(wheel).gap) || 0;
        return { cardWidth, gap };
    };

    const updateWheel = (withTransition = true) => {
        const { cardWidth, gap } = getLayout();
        const containerWidth = wheel.parentElement.offsetWidth;
        
        if (!withTransition) {
            wheel.classList.add('no-transition');
            allCards.forEach(c => c.style.transition = 'none');
        } else {
            wheel.classList.remove('no-transition');
            allCards.forEach(c => c.style.transition = '');
        }

        // logical index for indicators
        let logicalIndex = (currentIndex - 1) % totalOriginals;
        if (logicalIndex < 0) logicalIndex = totalOriginals + logicalIndex;
        
        // Exact centering math: 
        // Half container - half card - current card position
        const centerOffset = (containerWidth / 2) - (cardWidth / 2);
        const scrollOffset = -currentIndex * (cardWidth + gap);
        wheel.style.transform = `translateX(${centerOffset + scrollOffset}px)`;

        allCards.forEach((card, index) => {
            const distance = index - currentIndex;
            const absDistance = Math.abs(distance);
            
            if (index === currentIndex) {
                card.classList.add('active');
                card.style.transform = `scale(1.1) translateZ(50px) rotateY(0deg)`;
            } else {
                card.classList.remove('active');
                // Calculate curved 3D position
                const rotateAngle = distance * -20; // Rotate towards the center
                const zTranslate = absDistance * -150; // Move back as it moves away
                const scaleVal = 1 - (absDistance * 0.1); // Slightly shrink
                
                card.style.transform = `scale(${scaleVal}) translateZ(${zTranslate}px) rotateY(${rotateAngle}deg)`;
            }
        });

        if (progressBar) {
            progressBar.style.width = `${((logicalIndex + 1) / totalOriginals) * 100}%`;
        }

        if (!withTransition) {
            // Force reflow
            wheel.offsetHeight;
            wheel.classList.remove('no-transition');
            allCards.forEach(c => c.style.transition = '');
        }
    };

    // Teleportation Logic
    wheel.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === 0) {
            currentIndex = totalOriginals;
            updateWheel(false);
        } else if (currentIndex === totalOriginals + 1) {
            currentIndex = 1;
            updateWheel(false);
        }
    });

    const stopAutoScroll = () => {
        isAutoScrolling = false;
        clearInterval(autoScrollTimer);
    };

    const startAutoScroll = () => {
        if (autoScrollTimer) clearInterval(autoScrollTimer);
        isAutoScrolling = true;
        autoScrollTimer = setInterval(() => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateWheel();
        }, 4000);
    };

    nextBtn?.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        stopAutoScroll();
        currentIndex++;
        updateWheel();
        startAutoScroll();
    });

    prevBtn?.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        stopAutoScroll();
        currentIndex--;
        updateWheel();
        startAutoScroll();
    });

    // Interaction handling
    let startX = 0;
    let isDragging = false;

    wheel.addEventListener('mousedown', (e) => {
        stopAutoScroll();
        startX = e.pageX;
        isDragging = true;
    });
    
    wheel.addEventListener('mouseenter', stopAutoScroll);
    wheel.addEventListener('mouseleave', (e) => {
        if (!isDragging) startAutoScroll();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.pageX - startX;
        if (Math.abs(diff) > 50) { // Lower threshold for better responsiveness
            if (diff > 0) currentIndex--;
            else currentIndex++;
            updateWheel();
            startX = e.pageX;
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    wheel.addEventListener('touchstart', (e) => {
        stopAutoScroll();
        startX = e.touches[0].pageX;
    });

    wheel.addEventListener('touchend', (e) => {
        if (isTransitioning) return;
        const diff = e.changedTouches[0].pageX - startX;
        if (Math.abs(diff) > 30) {
            isTransitioning = true;
            if (diff > 0) currentIndex--;
            else currentIndex++;
            updateWheel();
        }
        startAutoScroll();
    });

    // Handle Resize
    window.addEventListener('resize', () => updateWheel(false));

    // --- INTERACTIVE SCROLLBAR LOGIC ---
    const progressContainer = document.querySelector('.wheel-progress');
    if (progressContainer) {
        const handleScrollbarClick = (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const posX = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, posX / rect.width));
            
            // Map percentage to our index range [1, totalOriginals]
            // percentage 0 -> index 1
            // percentage 1 -> index totalOriginals
            const newIndex = Math.round(percentage * (totalOriginals - 1)) + 1;
            
            if (newIndex !== currentIndex && !isTransitioning) {
                isTransitioning = true;
                stopAutoScroll();
                currentIndex = newIndex;
                updateWheel();
                startAutoScroll();
            }
        };

        progressContainer.addEventListener('mousedown', (e) => {
            handleScrollbarClick(e);
            const onMouseMove = (moveEvent) => handleScrollbarClick(moveEvent);
            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });

        // Touch support for scrollbar
        progressContainer.addEventListener('touchstart', (e) => {
            handleScrollbarClick(e.touches[0]);
            const onTouchMove = (moveEvent) => {
                e.preventDefault();
                handleScrollbarClick(moveEvent.touches[0]);
            };
            const onTouchEnd = () => {
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
            };
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);
        });
    }

    // Initial call
    updateWheel();
    startAutoScroll();
};

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