import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildCard, getProjects, loadProjects, type Project } from '@widgets/projects/projects';

const base: Project = {
  id: 'demo',
  title: 'Demo project',
  description: 'A description long enough to be realistic.',
  tags: ['TypeScript', 'Vite'],
  links: { source: 'https://github.com/example/demo' },
  featured: false,
  previewLabel: 'Demo',
};

describe('projects data', () => {
  const projects = getProjects();

  it('ships at least one project', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('has exactly one featured project', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it('uses unique ids', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never links to a placeholder URL', () => {
    // Two entries used to ship with `"demo": "#"`, which rendered a dead
    // "Live demo" link on a page whose job is to prove the work exists.
    for (const project of projects) {
      expect(project.links.source).toMatch(/^https:\/\//);
      if (project.links.demo !== undefined) {
        expect(project.links.demo).toMatch(/^https:\/\//);
      }
    }
  });

  it('describes every project and tags it', () => {
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(project.description.trim().length).toBeGreaterThan(20);
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });
});

describe('buildCard', () => {
  it('omits the demo link when a project has no deployment', () => {
    const card = buildCard(base, false);
    const labels = [...card.querySelectorAll('a')].map((a) => a.textContent);

    expect(labels).toEqual(['Code ↗']);
  });

  it('renders both links when a demo exists', () => {
    const card = buildCard(
      { ...base, links: { ...base.links, demo: 'https://example.com' } },
      false
    );
    const labels = [...card.querySelectorAll('a')].map((a) => a.textContent);

    expect(labels).toEqual(['Live demo ↗', 'Code ↗']);
  });

  it('opens external links safely', () => {
    const card = buildCard(
      { ...base, links: { ...base.links, demo: 'https://example.com' } },
      false
    );

    for (const link of card.querySelectorAll('a')) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener noreferrer');
    }
  });

  it('exposes the title as a single focusable control, not a clickable card', () => {
    const card = buildCard(base, false);

    expect(card.getAttribute('role')).toBeNull();
    expect(card.tabIndex).toBe(-1);

    const button = card.querySelector('.project__title-btn');
    expect(button?.tagName).toBe('BUTTON');
    expect(button?.textContent).toBe('Demo project');
  });

  it('opens the modal with the project details when the title is activated', () => {
    const openProjectModal = vi.fn();
    window.openProjectModal = openProjectModal;

    const card = buildCard(base, false);
    card.querySelector<HTMLButtonElement>('.project__title-btn')?.click();

    expect(openProjectModal).toHaveBeenCalledWith(expect.any(HTMLElement), {
      title: base.title,
      description: base.description,
    });
  });

  it('marks the decorative preview as hidden from assistive tech', () => {
    const card = buildCard({ ...base, preview: '/projects/demo.png' }, false);
    const preview = card.querySelector('.project__preview');
    const img = card.querySelector('img');

    expect(preview?.getAttribute('aria-hidden')).toBe('true');
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('loading')).toBe('lazy');
  });
});

describe('loadProjects', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="projects-container"></div>';
  });

  it('does nothing when the container is missing', async () => {
    document.body.innerHTML = '';
    await expect(loadProjects('#projects-container')).resolves.toBeUndefined();
  });

  it('renders the featured project first, then the grid', async () => {
    await loadProjects('#projects-container');

    const list = document.querySelector('.projects__list');
    expect(list).not.toBeNull();
    expect(list?.firstElementChild?.classList.contains('project--featured')).toBe(true);
    expect(document.querySelectorAll('.project')).toHaveLength(getProjects().length);
  });

  it('leaves no loading placeholder behind', async () => {
    await loadProjects('#projects-container');
    expect(document.body.textContent).not.toContain('Loading projects');
  });
});
