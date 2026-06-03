type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored) {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function toggleTheme(): void {
  const current = document.documentElement.getAttribute('data-theme') as Theme || 'dark';
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  updateButtonIcon(next);
}

function updateButtonIcon(theme: Theme): void {
  const buttons = [
    document.getElementById('theme-toggle'),
    document.getElementById('theme-toggle-mobile')
  ];

  buttons.forEach(button => {
    if (!button) return;

    const icon = button.querySelector('span');
    if (!icon) return;

    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  });
}

export function initThemeSwitcher(): void {
  const theme = getPreferredTheme();
  applyTheme(theme);
  updateButtonIcon(theme);

  const buttons = [
    document.getElementById('theme-toggle'),
    document.getElementById('theme-toggle-mobile')
  ];

  buttons.forEach(button => {
    if (button) {
      button.addEventListener('click', toggleTheme);
    }
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const newTheme = e.matches ? 'light' : 'dark';
      applyTheme(newTheme);
      updateButtonIcon(newTheme);
    }
  });
}
