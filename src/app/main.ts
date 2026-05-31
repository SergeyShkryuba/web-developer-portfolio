import '@shared/styles/style.css';
import { initHeader } from '@widgets/header';
import { loadProjects } from '@widgets/projects/projects';
import { initModal } from '@widgets/modal/modal';

initHeader();
initModal();

if (document.getElementById('projects-container')) {
  loadProjects('#projects-container');
}
