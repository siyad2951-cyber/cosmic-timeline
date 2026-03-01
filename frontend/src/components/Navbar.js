export class Navbar {
  constructor() {
    this.element = document.createElement('nav');
    this.element.className = 'fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50';
    this.element.setAttribute('role', 'navigation');
    this.element.setAttribute('aria-label', 'Main navigation');
    this.isMenuOpen = false;
    this.render();
    this.bindEvents();
  }

  render() {
    this.element.innerHTML = `
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" class="flex items-center gap-2 group">
          <div class="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 group-hover:scale-105 transition duration-300">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <div class="absolute inset-0 bg-white/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition duration-300"></div>
          </div>
          <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-400 to-purple-400 tracking-tight group-hover:opacity-100 transition">
            Cosmic Timeline
          </span>
        </a>
        <div id="desktop-nav" class="hidden md:flex space-x-8 text-slate-300">
          <a href="#apod" class="hover:text-blue-400 transition font-medium">APOD</a>
          <a href="#sky-events" class="hover:text-blue-400 transition font-medium">Sky Events</a>

          <a href="#discoveries" class="hover:text-blue-400 transition font-medium">Discoveries</a>
          <a href="#history" class="hover:text-blue-400 transition font-medium">History</a>
        </div>
        <button id="mobile-menu-btn" class="md:hidden text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
          <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div id="mobile-menu" class="md:hidden hidden bg-slate-900/98 border-t border-slate-700/50">
        <div class="container mx-auto px-4 py-4 space-y-3">
          <a href="#apod" class="block py-3 px-4 text-slate-200 hover:bg-slate-800 rounded-lg transition font-medium">🔭 APOD</a>
          <a href="#sky-events" class="block py-3 px-4 text-slate-200 hover:bg-slate-800 rounded-lg transition font-medium">🌠 Sky Events</a>

          <a href="#discoveries" class="block py-3 px-4 text-slate-200 hover:bg-slate-800 rounded-lg transition font-medium">🚀 Discoveries</a>
          <a href="#history" class="block py-3 px-4 text-slate-200 hover:bg-slate-800 rounded-lg transition font-medium">📜 History</a>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const btn = this.element.querySelector('#mobile-menu-btn');
    const menu = this.element.querySelector('#mobile-menu');
    const menuIcon = this.element.querySelector('#menu-icon');
    const closeIcon = this.element.querySelector('#close-icon');
    const mobileLinks = this.element.querySelectorAll('#mobile-menu a');

    if (btn && menu) {
      btn.addEventListener('click', () => {
        this.isMenuOpen = !this.isMenuOpen;
        menu.classList.toggle('hidden', !this.isMenuOpen);
        menuIcon.classList.toggle('hidden', this.isMenuOpen);
        closeIcon.classList.toggle('hidden', !this.isMenuOpen);
        btn.setAttribute('aria-expanded', this.isMenuOpen);
      });

      // Close menu when a link is clicked
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.isMenuOpen = false;
          menu.classList.add('hidden');
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
}
