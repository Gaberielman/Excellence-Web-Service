/* ============================================================
   THEME TOGGLE — Light ⇄ Dark
   ============================================================ */
(function () {
    const html  = document.documentElement;
    const saved = localStorage.getItem('ews-theme');

    // Apply saved theme immediately (before DOM ready) to prevent flash
    if (saved === 'dark') html.setAttribute('data-theme', 'dark');
})();

const initThemeToggle = () => {
    const btn   = document.getElementById('theme-toggle');
    const thumb = btn?.querySelector('.theme-toggle-thumb');
    const html  = document.documentElement;

    if (!btn || !thumb) return;

    const isDark = () => html.getAttribute('data-theme') === 'dark';

    const applyTheme = (dark) => {
        if (dark) {
            html.setAttribute('data-theme', 'dark');
            thumb.textContent = '🌙';
            thumb.title = 'Switch to Light Mode';
            localStorage.setItem('ews-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
            thumb.textContent = '☀️';
            thumb.title = 'Switch to Dark Mode';
            localStorage.setItem('ews-theme', 'light');
        }
    };

    // Set initial icon based on current theme
    applyTheme(isDark());

    btn.addEventListener('click', () => applyTheme(!isDark()));
};

document.addEventListener('DOMContentLoaded', initThemeToggle);


const serviceDetails = {
    web: {
        title: "Website Designing",
        icon: "<img src='assets/service_web.png' class='modal-service-img'>",
        desc: "We focus on creating modern, responsive, and visually appealing designs that perfectly align with your brand identity. Our designs ensure fast-loading pages and seamless navigation across all devices, including mobile, tablets, and desktops."
    },
    seo: {
        title: "SEO & Digital Marketing",
        icon: "<img src='assets/service_seo.png' class='modal-service-img'>",
        desc: "Grow your online presence with our advanced SEO and social media marketing strategies. We specialize in Google local listing optimization, targeted Facebook/Instagram ad campaigns, and YouTube marketing to drive high-quality customers to your business."
    },
    webdev: {
        title: "Web Development",
        icon: "<img src='assets/service_marketing.png' class='modal-service-img'>",
        desc: "Build a secure, scalable, and high-performance foundation for your business. Our expert development team uses pure, clean code and the latest technologies to create custom web applications and robust platforms tailored to your specific needs."
    },
    it: {
        title: "Comprehensive IT Services",
        icon: "<img src='assets/service_ecommerce.png' class='modal-service-img'>",
        desc: "Your trusted partner for all technical IT needs. From troubleshooting and secure system maintenance to network, hardware, and software support. We provide ongoing monitoring to minimize downtime and keep your business running smoothly."
    }
};

const openModal = (serviceId) => {
    const modal = document.getElementById('serviceModal');
    const data = serviceDetails[serviceId];
    if (data && modal) {
        document.getElementById('modalIcon').innerHTML = data.icon;
        document.getElementById('modalTitle').innerText = data.title;
        document.getElementById('modalDesc').innerText = data.desc;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

const closeModal = () => {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
};

window.addEventListener('click', (e) => {
    const modal = document.getElementById('serviceModal');
    if (e.target === modal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});