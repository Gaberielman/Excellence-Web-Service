// sticky-header-logic
const handleNavScroll = () => {
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = "10px 5%";
            nav.style.background = "rgba(255, 255, 255, 0.95)"; // Light tint on scroll
            nav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
        } else {
            nav.style.padding = "20px 5%";
            nav.style.background = "rgba(255, 255, 255, 0.7)";
            nav.style.boxShadow = "none";
        }
    });
};

// Smooth scroll for professional UX
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    handleNavScroll();
    smoothScroll();
    
    // Mobile Hamburger Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });

        // Close menu when a link is clicked
        const navAnchorLinks = navLinks.querySelectorAll('a');
        navAnchorLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    hamburger.classList.remove('toggle');
                }
            });
        });
    }
});

// Modal Logic & Content Engine
const serviceDetails = {
    web: {
        title: "Website Design & Development",
        icon: "<img src='assets/service_web.png' class='modal-service-img'>",
        desc: "Our web development process focuses on creating stunning, fast, and responsive websites that serve as a powerful digital storefront. We use the latest technologies alongside meticulous UX/UI frameworks to ensure your site is secure, scalable, and fully optimized for explosive traffic conversions."
    },
    seo: {
        title: "Advanced SEO Services",
        icon: "<img src='assets/service_seo.png' class='modal-service-img'>",
        desc: "Search Engine Optimization is the lifeblood of online visibility. We go beyond basic keyword insertion—our local SEO engineering encompasses deep technical audits, high-quality authoritative backlink building, rich content strategy, and precise Google My Business optimization to secure you at the top of search results."
    },
    marketing: {
        title: "Dominant Digital Marketing",
        icon: "<img src='assets/service_marketing.png' class='modal-service-img'>",
        desc: "Maximize your immediate ROI with our data-driven digital marketing campaigns. From hyper-targeted social media advertising on Meta to comprehensive inbound email marketing and brand management, we create custom psychological funnels designed to bring high-quality leads straight to your business."
    },
    ecommerce: {
        title: "E-commerce Frameworks",
        icon: "<img src='assets/service_ecommerce.png' class='modal-service-img'>",
        desc: "We engineer robust, easily manageable online stores that offer frictionless shopping experiences. Whether you need a powerful Shopify/WooCommerce setup or a fully custom e-commerce web application with integrated global payment gateways and automated abandoned cart recovery, we have you fully covered."
    }
};

const openModal = (serviceId) => {
    const modal = document.getElementById('serviceModal');
    const data = serviceDetails[serviceId];
    
    if(data && modal) {
        document.getElementById('modalIcon').innerHTML = data.icon;
        document.getElementById('modalTitle').innerText = data.title;
        document.getElementById('modalDesc').innerText = data.desc;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent background scroll
    }
};

const closeModal = () => {
    const modal = document.getElementById('serviceModal');
    if(modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
};

// Close modal when clicking on the frosted glass background
window.addEventListener('click', (e) => {
    const modal = document.getElementById('serviceModal');
    if(e.target === modal) {
        closeModal();
    }
});