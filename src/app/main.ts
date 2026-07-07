import '@shared/styles/style.css';
import { initHeader } from '@widgets/header';
import { loadProjects } from '@widgets/projects/projects';

initHeader();

if (document.getElementById('projects-container')) {
  loadProjects('#projects-container');
}
