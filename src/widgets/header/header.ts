import { Menu } from './menu';

interface HeaderOptions {
  activePage?: string;
}

const NAV_LINKS = [
  { href: '/', text: 'Home', id: 'home' },
  { href: '/#about', text: 'About', id: 'about' },
  { href: '/#skills', text: 'Skills', id: 'skills' },
  { href: '/#projects', text: 'Projects', id: 'projects' },
  { href: '/#experience', text: 'Experience', id: 'experience' },
  { href: '/pages/contact.html', text: 'Contact', id: 'contact' },
];

export class Header {
  private menu: Menu;

  constructor(options: HeaderOptions = {}) {
    this.renderLinks();
    this.menu = new Menu('.header', '#burger', '#mobile-menu');
    this.setActivePage(options.activePage);
    this.bindLinkClicks();
  }

  private renderLinks(): void {
    const desktopNav = document.querySelector('#desktop-nav');
    const mobileNav = document.querySelector('#mobile-nav');

    if (desktopNav) {
      desktopNav.innerHTML = NAV_LINKS.map(
        (link) => `
        <a href="${link.href}" class="px-4 py-2 text-ink hover:text-accent font-medium transition-colors relative group" data-page="${link.id}">
          ${link.text}
          <span class="absolute bottom-0 left-4 right-4 h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </a>
      `
      ).join('');
    }

    if (mobileNav) {
      mobileNav.innerHTML = NAV_LINKS.map(
        (link) => `
        <a href="${link.href}" class="block px-4 py-2 text-ink hover:text-accent hover:bg-surface-2 rounded-lg font-medium" data-page="${link.id}">
          ${link.text}
        </a>
      `
      ).join('');
    }
  }

  private bindLinkClicks(): void {
    const links = document.querySelectorAll('[data-page]');
    links.forEach((link) => {
      link.addEventListener('click', () => this.menu.closeMenu());
    });
  }

  private setActivePage(pageName?: string): void {
    if (!pageName) {
      const path = window.location.pathname;
      const hash = window.location.hash;

      const pageMap: Record<string, string> = {
        '/': 'home',
        '/index.html': 'home',
        '/pages/about.html': 'about',
        '/pages/contact.html': 'contact',
      };

      pageName = pageMap[path] || 'home';

      if (pageName === 'home' && hash) {
        const section = hash.replace('#', '');
        const validSections = ['about', 'skills', 'projects', 'experience'];
        if (validSections.includes(section)) {
          // `this.links` never existed, so following a hash link threw
          // "Cannot read properties of undefined". The highlight colour was
          // also `text-blue-600`, which is not a token in this theme.
          document.querySelectorAll('[data-page]').forEach((link) => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === section) {
              link.classList.add('text-accent');
            } else if (linkPage !== 'home') {
              link.classList.remove('text-accent');
            }
          });
          return;
        }
      }
    }

    const links = document.querySelectorAll('[data-page]');
    links.forEach((link) => {
      const linkPage = link.getAttribute('data-page');
      if (linkPage === pageName) {
        link.classList.add('text-accent');
      } else {
        link.classList.remove('text-accent');
      }
    });
  }
}

export function initHeader(options?: HeaderOptions): Header {
  return new Header(options);
}

export default initHeader;
