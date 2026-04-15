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