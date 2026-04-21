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

