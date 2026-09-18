import projectsData from './projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  /** `demo` is optional: not every project is deployed anywhere. */
  links: { demo?: string; source: string };
  featured: boolean;
  previewLabel: string;
  preview?: string;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export async function loadProjects(containerSelector: string): Promise<void> {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const projects = getProjects();

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
    list.appendChild(buildCard(featured, true));
  }

  if (rest.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'projects__grid';
    rest.forEach((p) => grid.appendChild(buildCard(p, false)));
    list.appendChild(grid);
  }

  container.appendChild(list);
}

function externalLink(href: string, text: string, className: string): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  a.className = className;
  if (href.startsWith('http')) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return a;
}

export function buildCard(project: Project, isFeatured: boolean): HTMLElement {
  const article = document.createElement('article');
  article.className = `project ${isFeatured ? 'project--featured' : ''}`.trim();

  const preview = document.createElement('div');
  preview.className = 'project__preview';
  preview.setAttribute('aria-hidden', 'true');
  if (project.preview) {
    const img = document.createElement('img');
    img.src = project.preview;
    img.alt = '';
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.className = 'project__preview-img';
    preview.appendChild(img);
  } else {
    preview.textContent = project.previewLabel;
  }

  const body = document.createElement('div');
  body.className = 'project__body';

  // The card used to be `role="button"` with links inside it — nested
  // interactive elements, which screen readers and keyboard users both handle
  // badly. Now the heading carries the only "open details" control.
  const title = document.createElement('h3');
  title.className = 'project__title';

  const detailsBtn = document.createElement('button');
  detailsBtn.type = 'button';
  detailsBtn.className = 'project__title-btn';
  detailsBtn.textContent = project.title;
  detailsBtn.addEventListener('click', () => {
    window.openProjectModal(detailsBtn, {
      title: project.title,
      description: project.description,
    });
  });
  title.appendChild(detailsBtn);

  const desc = document.createElement('p');
  desc.className = 'project__desc';
  desc.textContent = project.description;

  const tags = document.createElement('ul');
  tags.className = 'project__tags';
  tags.setAttribute('aria-label', `Technologies used in ${project.title}`);
  project.tags.forEach((tag) => {
    const li = document.createElement('li');
    li.textContent = tag;
    tags.appendChild(li);
  });

  const links = document.createElement('div');
  links.className = 'project__links';

  // A "Live demo" link pointing at "#" used to be rendered for every project
  // without a deployment, which looked broken when clicked.
  if (project.links.demo) {
    links.appendChild(externalLink(project.links.demo, 'Live demo ↗', 'project__link'));
  }
  links.appendChild(
    externalLink(project.links.source, isFeatured ? 'GitHub ↗' : 'Code ↗', 'project__link')
  );

  body.append(title, desc, tags, links);
  article.append(preview, body);

  return article;
}
