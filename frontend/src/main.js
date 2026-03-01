import './style.css';
import { Navbar } from './components/Navbar';
import { APOD } from './components/APOD';
import { SkyEvents } from './components/SkyEvents';

import { Discoveries } from './components/Discoveries';
import { History } from './components/History';
import { formatTodayHeader } from './utils/dateFormat';
import { clearAllCache } from './utils/browserCache';

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('[SW] Registered:', registration.scope);
            })
            .catch((error) => {
                console.warn('[SW] Registration failed:', error);
            });
    });
}

// Auto-refresh interval (12 hours in milliseconds)
const AUTO_REFRESH_INTERVAL = 12 * 60 * 60 * 1000;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Initialize Navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        const navbar = new Navbar();
        navbarContainer.appendChild(navbar.element);
    }

    // 3. Initialize Date Display
    const dateDisplay = document.getElementById('current-date-display');
    if (dateDisplay) {
        dateDisplay.textContent = formatTodayHeader();
    }

    // 4. Initialize Components
    const apod = new APOD('apod');
    const skyEvents = new SkyEvents('sky-events-container');
    const discoveries = new Discoveries('discoveries-container');
    const history = new History('history-container');

    // 5. Load Data (initial load)
    function loadAllData() {
        const today = new Date();

        // Update date display
        if (dateDisplay) {
            dateDisplay.textContent = formatTodayHeader();
        }

        apod.init().catch(err => console.error('APOD init failed:', err));
        skyEvents.init().catch(err => console.error('SkyEvents init failed:', err));
        discoveries.init(today.getMonth() + 1, today.getDate()).catch(err => console.error('Discoveries init failed:', err));
        history.init(today.getMonth() + 1, today.getDate()).catch(err => console.error('History init failed:', err));
    }

    // Initial load
    loadAllData();

    // 6. Auto-refresh every 12 hours
    setInterval(() => {
        console.log('[Auto-Refresh] Refreshing data...');
        clearAllCache(); // Clear browser cache to force fresh data
        loadAllData();
    }, AUTO_REFRESH_INTERVAL);

});
