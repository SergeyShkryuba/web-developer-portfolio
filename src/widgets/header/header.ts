interface HeaderOptions {
  activePage?: string;
}

export class Header {
  private header: HTMLElement | null;
  private burger: HTMLElement | null;
  private mobileMenu: HTMLElement | null;
  private links: NodeListOf<HTMLElement>;

  constructor(options: HeaderOptions = {}) {
    this.header = document.querySelector('.header');
    this.burger = document.querySelector('#burger');
    this.mobileMenu = document.querySelector('#mobile-menu');
    this.links = document.querySelectorAll('[data-page]');

    this.init();
    this.setActivePage(options.activePage);
  }

  private init(): void {
    if (this.burger && this.mobileMenu) {
      this.burger.addEventListener('click', () => this.toggleMenu());
    }

    this.links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (this.header && !this.header.contains(e.target as Node)) {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    this.mobileMenu?.classList.toggle('hidden');
    this.burger?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  private closeMenu(): void {
    this.mobileMenu?.classList.add('hidden');
    this.burger?.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  private setActivePage(pageName?: string): void {
    if (!pageName) {
      const path = window.location.pathname;
      if (path.includes('about')) pageName = 'about';
      else if (path.includes('contact')) pageName = 'contact';
      else pageName = 'home';
    }

    this.links.forEach(link => {
      const linkPage = link.getAttribute('data-page');
      if (linkPage === pageName) {
        link.classList.add('text-blue-600');
      } else {
        link.classList.remove('text-blue-600');
      }
    });
  }
}

export function initHeader(options?: HeaderOptions): Header {
  return new Header(options);
}

export default initHeader;
