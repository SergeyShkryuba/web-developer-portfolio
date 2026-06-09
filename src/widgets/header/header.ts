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
      desktopNav.innerHTML = NAV_LINKS.map(link => `
        <a href="${link.href}" class="px-4 py-2 text-ink hover:text-accent font-medium transition-colors relative group" data-page="${link.id}">
          ${link.text}
          <span class="absolute bottom-0 left-4 right-4 h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </a>
      `).join('');
    }

    if (mobileNav) {
      mobileNav.innerHTML = NAV_LINKS.map(link => `
        <a href="${link.href}" class="block px-4 py-2 text-ink hover:text-accent hover:bg-surface-2 rounded-lg font-medium" data-page="${link.id}">
          ${link.text}
        </a>
      `).join('');
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
      if (path.includes('about')) pageName = 'about';
      else if (path.includes('skills')) pageName = 'skills';
      else if (path.includes('projects')) pageName = 'projects';
      else if (path.includes('experience')) pageName = 'experience';
      else if (path.includes('contact')) pageName = 'contact';
      else pageName = 'home';
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
