import '@shared/styles/style.css';
import { initHeader } from '@widgets/header';
import { loadProjects } from '@widgets/projects/projects';
import { initModal } from '@widgets/modal/modal';
import { initContactForm } from '@features/contact-form/contact-form';

initHeader();
initModal();

if (document.getElementById('projects-container')) {
  loadProjects('#projects-container');
}

if (document.getElementById('contactForm')) {
  initContactForm('#contactForm');
}
