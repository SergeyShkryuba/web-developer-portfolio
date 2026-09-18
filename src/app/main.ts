import { initThemeSwitcher } from '@features/theme-switcher';
// Self-hosted fonts. They used to come from fonts.googleapis.com, which cost a
// render-blocking round trip to a third party on every page load and sent every
// visitor's IP to Google.
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/hanken-grotesk';
import '@shared/styles/style.css';
import { initHeader } from '@widgets/header';
import { loadProjects } from '@widgets/projects/projects';
import { initModal } from '@widgets/modal/modal';
import { initContactForm } from '@features/contact-form/contact-form';
import { initScrollReveal } from '@features/scroll-reveal/scroll-reveal';
import { initBackToTop } from '@features/back-to-top';
import { initReadingProgress } from '@features/reading-progress';
import { initPreloader } from '@features/page-preloader';

initThemeSwitcher();
initPreloader();
initHeader();
initModal();
initScrollReveal();
initBackToTop();
initReadingProgress();

if (document.getElementById('projects-container')) {
  loadProjects('#projects-container');
}

if (document.getElementById('contactForm')) {
  initContactForm('#contactForm');
}
