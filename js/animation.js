/* ============================================================
   ANIMATION.JS — Global Particle System + Wheel v3.0
   ============================================================ */

// ─── SCROLL REVEAL ────────────────────────────────────────────
const revealElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.info-container, .service-card, .hero-content, .faq-card, .about-content, .project-card, .slide-in-left, .slide-in-right, .reveal-text'
    ).forEach(el => observer.observe(el));
};

// ─── SPLASH SCREEN ────────────────────────────────────────────
const initSplash = () => {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    setTimeout(() => splash.classList.add('hidden'), 1800);
};

// ─── GLOBAL PARTICLE BACKGROUND ───────────────────────────────
const initGlobalCanvas = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], animFrameId;
    let mouse = { x: -9999, y: -9999 };

    // Theme-reactive particle color
    const PARTICLE_COLOR = () => {
        return document.documentElement.getAttribute('data-theme') === 'dark'
            ? '212, 175, 55'    // bright gold for dark background
            : '120, 87, 10';    // deeper bronze for light background
    };
    const PARTICLE_OPACITY_SCALE = () => {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0.55;
    };
    const CONNECTION_DIST = 140;
    const MOUSE_REPEL = 130;

    const resize = () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        initParticles();
    };

    class Particle {
        constructor() { this.reset(true); }

        reset(random = false) {
            this.x = random ? Math.random() * W : (Math.random() > 0.5 ? 0 : W);
            this.y = random ? Math.random() * H : Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.6 + 0.2;
        }

        update() {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < MOUSE_REPEL) {
                const force = (MOUSE_REPEL - dist) / MOUSE_REPEL;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 3.5;
                this.y += Math.sin(angle) * force * 3.5;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
                this.reset(false);
            }
        }

        draw() {
            const col = PARTICLE_COLOR();
            const scale = PARTICLE_OPACITY_SCALE();
            ctx.save();
            ctx.globalAlpha = this.opacity * scale;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${col})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(${col}, 0.5)`;
            ctx.fill();
            ctx.restore();
        }
    }

    const initParticles = () => {
        const count = Math.max(60, Math.floor((W * H) / 9000));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const drawConnections = () => {
        ctx.save();
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.hypot(dx, dy);
                if (dist < CONNECTION_DIST) {
                    const col = PARTICLE_COLOR();
                    const scale = PARTICLE_OPACITY_SCALE();
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.22 * scale;
                    ctx.strokeStyle = `rgba(${col}, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    };

    const animate = () => {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        animFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);

    // Mouse tracking — only on non-touch devices for performance
    if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = -9999; mouse.y = -9999;
        });
    }

    resize();
    animate();
};

// ─── PARALLAX ORBS ────────────────────────────────────────────
const initHeroParallax = () => {
    const mainOrb = document.querySelector('.main-orb');
    const secondaryOrb = document.querySelector('.secondary-orb');

    if (!mainOrb || 'ontouchstart' in window) return;

    let rafId;
    window.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) * 0.015;
            const dy = (e.clientY - cy) * 0.015;
            mainOrb.style.transform = `translate(${dx * 4}px, ${dy * 4}px)`;
            if (secondaryOrb) secondaryOrb.style.transform = `translate(${dx * -3}px, ${dy * -3}px)`;
        });
    });
};

// ─── 3D ORBITAL PROJECT WHEEL ─────────────────────────────────
const initProjectWheel = () => {
    const wheel = document.querySelector('.wheel-inner');
    const cards = Array.from(document.querySelectorAll('.wheel-card'));
    const nextBtn = document.getElementById('wheel-next');
    const prevBtn = document.getElementById('wheel-prev');
    const progressBar = document.getElementById('wheel-bar');

    if (!wheel || cards.length === 0) return;

    const N = cards.length;
    let currentIndex = 1;
    let isTransitioning = false;
    let autoTimer;

    // Clone first and last for seamless loop
    const firstClone = cards[0].cloneNode(true);
    const lastClone  = cards[N - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    wheel.appendChild(firstClone);
    wheel.prepend(lastClone);

    const allCards = Array.from(document.querySelectorAll('.wheel-card'));

    const getMetrics = () => {
        const card = allCards[0];
        const cardWidth = card.offsetWidth;
        const gap = parseInt(window.getComputedStyle(wheel).gap) || 0;
        return { cardWidth, gap };
    };

    const updateWheel = (animated = true) => {
        if (!animated) {
            wheel.classList.add('no-transition');
            allCards.forEach(c => { c.style.transition = 'none'; });
        } else {
            wheel.classList.remove('no-transition');
            allCards.forEach(c => { c.style.transition = ''; });
        }

        const { cardWidth, gap } = getMetrics();
        const containerW = wheel.parentElement.offsetWidth;
        const centerOffset = (containerW / 2) - (cardWidth / 2);
        const scrollOffset = -currentIndex * (cardWidth + gap);
        wheel.style.transform = `translateX(${centerOffset + scrollOffset}px)`;

        allCards.forEach((card, idx) => {
            const dist = idx - currentIndex;
            const absDist = Math.abs(dist);

            if (idx === currentIndex) {
                card.classList.add('active');
                card.style.transform = `scale(1.08) translateZ(40px) rotateY(0deg)`;
                card.style.zIndex = '10';
            } else {
                card.classList.remove('active');
                const rot   = dist * -18;
                const depth = Math.min(absDist * 100, 200);
                const scale = Math.max(1 - absDist * 0.12, 0.7);
                card.style.transform = `scale(${scale}) translateZ(-${depth}px) rotateY(${rot}deg)`;
                card.style.zIndex = String(10 - absDist);
            }
        });

        // Progress bar
        if (progressBar) {
            const logicalIdx = ((currentIndex - 1) % N + N) % N;
            progressBar.style.width = `${((logicalIdx + 1) / N) * 100}%`;
        }

        if (!animated) {
            wheel.offsetHeight; // force reflow
            wheel.classList.remove('no-transition');
            allCards.forEach(c => { c.style.transition = ''; });
        }
    };

    // ── Teleport on transition end (seamless loop) ──
    wheel.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === 0) {
            currentIndex = N;
            updateWheel(false);
        } else if (currentIndex === N + 1) {
            currentIndex = 1;
            updateWheel(false);
        }
    });

    const navigate = (dir) => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex += dir;
        updateWheel(true);
    };

    // ── Auto Scroll ──
    const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(() => navigate(1), 4500);
    };
    const stopAuto = () => clearInterval(autoTimer);

    // ── Buttons ──
    nextBtn?.addEventListener('click', () => { navigate(1);  stopAuto(); startAuto(); });
    prevBtn?.addEventListener('click', () => { navigate(-1); stopAuto(); startAuto(); });

    // ── Mouse Drag (PC) ──
    let dragStartX = 0;
    let isDragging = false;
    let hasDragged = false;

    wheel.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true; hasDragged = false;
        dragStartX = e.pageX;
        stopAuto();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.pageX - dragStartX;
        if (Math.abs(diff) > 28) {
            hasDragged = true;
            navigate(diff > 0 ? -1 : 1);
            dragStartX = e.pageX;
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        startAuto();
    });

    // Prevent link clicks after drag
    wheel.addEventListener('click', (e) => {
        if (hasDragged) e.preventDefault();
    });

    // ── Touch Swipe (Mobile) ──
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchScrolling = false;

    wheel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouchScrolling = false;
        stopAuto();
    }, { passive: true });

    wheel.addEventListener('touchmove', (e) => {
        if (isTouchScrolling) return;
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);

        // Lock horizontally if dominant direction
        if (dx > dy && dx > 8) {
            e.preventDefault();
        } else if (dy > dx && dy > 8) {
            isTouchScrolling = true;
        }
    }, { passive: false });

    wheel.addEventListener('touchend', (e) => {
        if (isTouchScrolling) { startAuto(); return; }
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 22) {
            navigate(diff > 0 ? -1 : 1);
        }
        startAuto();
    });

    // ── Interactive Scrollbar ──
    const progressContainer = document.querySelector('.wheel-progress');
    if (progressContainer) {
        const seek = (clientX) => {
            const rect = progressContainer.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const newIdx = Math.round(pct * (N - 1)) + 1;
            if (newIdx !== currentIndex && !isTransitioning) {
                isTransitioning = true;
                stopAuto();
                currentIndex = newIdx;
                updateWheel(true);
                startAuto();
            }
        };

        progressContainer.addEventListener('mousedown', (e) => {
            seek(e.clientX);
            const move = (me) => seek(me.clientX);
            const up   = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
        });

        progressContainer.addEventListener('touchstart', (e) => {
            seek(e.touches[0].clientX);
            const move = (me) => { e.preventDefault(); seek(me.touches[0].clientX); };
            const end  = () => { window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end); };
            window.addEventListener('touchmove', move, { passive: false });
            window.addEventListener('touchend', end);
        });
    }

    // ── Resize ──
    window.addEventListener('resize', () => updateWheel(false));

    // ── Init ──
    updateWheel(false);
    startAuto();
};

// ─── STICKY NAV SCROLL EFFECT ─────────────────────────────────
const initNavScroll = () => {
    const nav = document.querySelector('.glass-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
};

// ─── MOBILE HAMBURGER ─────────────────────────────────────────
const initHamburger = () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks   = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    const close = () => {
        navLinks.classList.remove('nav-active');
        hamburger.classList.remove('toggle');
    };

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    // Close on outside tap
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) close();
    });
};

// ─── SMOOTH SCROLL ────────────────────────────────────────────
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
};

// ─── BOOTSTRAP ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSplash();
    revealElements();
    initGlobalCanvas();
    initHeroParallax();
    initProjectWheel();
    initNavScroll();
    initHamburger();
    initSmoothScroll();
});