interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  links: { demo: string; source: string };
  featured: boolean;
  previewLabel: string;
}

export async function loadProjects(containerSelector: string): Promise<void> {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const loading = document.createElement('p');
  loading.className = 'text-muted';
  loading.textContent = 'Loading projects…';
  container.appendChild(loading);

  try {
    const response = await fetch('/src/widgets/projects/projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const projects: Project[] = await response.json();
    loading.remove();

    if (projects.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'text-muted';
      empty.textContent = 'No projects yet.';
      container.appendChild(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'projects__list';

    const featured = projects.find((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);

    if (featured) {
      list.appendChild(buildFeaturedCard(featured));
    }

    if (rest.length > 0) {
      const grid = document.createElement('div');
      grid.className = 'projects__grid';
      rest.forEach((p) => grid.appendChild(buildCard(p)));
      list.appendChild(grid);
    }

    container.appendChild(list);
  } catch {
    loading.remove();
    const error = document.createElement('p');
    error.className = 'text-muted';
    error.textContent = 'Failed to load projects. Please try again later.';
    container.appendChild(error);
  }
}

function buildFeaturedCard(project: Project): HTMLElement {
  const article = document.createElement('article');
  article.className = 'project project--featured';
  article.tabIndex = 0;
  article.setAttribute('role', 'button');
  article.setAttribute('aria-label', `Open details for ${project.title}`);

  const preview = document.createElement('div');
  preview.className = 'project__preview';
  preview.setAttribute('aria-hidden', 'true');
  preview.textContent = project.previewLabel;

  const body = document.createElement('div');
  body.className = 'project__body';

  const title = document.createElement('h3');
  title.className = 'project__title';
  title.textContent = project.title;

  const desc = document.createElement('p');
  desc.className = 'project__desc';
  desc.textContent = project.description;

  const tags = document.createElement('ul');
  tags.className = 'project__tags';
  project.tags.forEach((tag) => {
    const li = document.createElement('li');
    li.textContent = tag;
    tags.appendChild(li);
  });

  const links = document.createElement('div');
  links.className = 'project__links';

  const demoLink = document.createElement('a');
  demoLink.href = project.links.demo;
  demoLink.textContent = 'Live demo →';

  const sourceLink = document.createElement('a');
  sourceLink.href = project.links.source;
  sourceLink.textContent = 'GitHub →';

  links.appendChild(demoLink);
  links.appendChild(sourceLink);

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(tags);
  body.appendChild(links);

  const open = () => window.openProjectModal(article, { title: project.title, description: project.description });
  article.addEventListener('click', open);
  article.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

  article.appendChild(preview);
  article.appendChild(body);

  return article;
}

function buildCard(project: Project): HTMLElement {
  const article = document.createElement('article');
  article.className = 'project';
  article.tabIndex = 0;
  article.setAttribute('role', 'button');
  article.setAttribute('aria-label', `Open details for ${project.title}`);

  const preview = document.createElement('div');
  preview.className = 'project__preview';
  preview.setAttribute('aria-hidden', 'true');
  preview.textContent = project.previewLabel;

  const body = document.createElement('div');
  body.className = 'project__body';

  const title = document.createElement('h3');
  title.className = 'project__title';
  title.textContent = project.title;

  const desc = document.createElement('p');
  desc.className = 'project__desc';
  desc.textContent = project.description;

  const tags = document.createElement('ul');
  tags.className = 'project__tags';
  project.tags.forEach((tag) => {
    const li = document.createElement('li');
    li.textContent = tag;
    tags.appendChild(li);
  });

  const links = document.createElement('div');
  links.className = 'project__links';

  const demoLink = document.createElement('a');
  demoLink.href = project.links.demo;
  demoLink.textContent = 'Live demo →';

  const sourceLink = document.createElement('a');
  sourceLink.href = project.links.source;
  sourceLink.textContent = 'Code →';

  links.appendChild(demoLink);
  links.appendChild(sourceLink);

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(tags);
  body.appendChild(links);

  article.appendChild(preview);
  article.appendChild(body);

  return article;
}
