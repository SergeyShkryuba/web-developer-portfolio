export class Menu {
  private buttonBurger: HTMLElement | null;
  private mobileMenu: HTMLElement | null;
  private header: HTMLElement | null;

  constructor(headerSelector: string, burgerSelector: string, mobileMenuSelector: string) {
    this.header = document.querySelector(headerSelector);
    this.buttonBurger = document.querySelector(burgerSelector);
    this.mobileMenu = document.querySelector(mobileMenuSelector);

    this.init();
  }

  private init(): void {
    if (this.buttonBurger && this.mobileMenu) {
      this.buttonBurger.addEventListener('click', () => this.toggleMenu());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });

    document.addEventListener('click', (e) => {
      const target = e.target as Node;
      if (this.header && !this.header.contains(target) && !this.mobileMenu?.contains(target)) {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    const isOpen = !this.mobileMenu?.classList.contains('hidden');
    this.mobileMenu?.classList.toggle('hidden');
    this.buttonBurger?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    this.buttonBurger?.setAttribute('aria-expanded', String(isOpen));
  }

  public closeMenu(): void {
    this.mobileMenu?.classList.add('hidden');
    this.buttonBurger?.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.buttonBurger?.setAttribute('aria-expanded', 'false');
  }
}
