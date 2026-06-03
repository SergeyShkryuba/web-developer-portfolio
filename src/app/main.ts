import { initThemeSwitcher } from '@features/theme-switcher';
import '@shared/styles/style.css';
import { initHeader } from '@widgets/header';
import { loadProjects } from '@widgets/projects/projects';
import { initModal } from '@widgets/modal/modal';
import { initContactForm } from '@features/contact-form/contact-form';
import { initScrollReveal } from '@features/scroll-reveal/scroll-reveal';

initThemeSwitcher();
initHeader();
initModal();
initScrollReveal();

if (document.getElementById('projects-container')) {
  loadProjects('#projects-container');
}

if (document.getElementById('contactForm')) {
  initContactForm('#contactForm');
}
