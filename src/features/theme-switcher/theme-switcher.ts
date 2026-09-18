const STORAGE_KEY = 'theme';

function applyTheme(isLight: boolean): void {
  document.documentElement.classList.toggle('light', isLight);
  localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
  updateButtonIcon(isLight);
}

function toggleTheme(): void {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
  updateButtonIcon(isLight);
}

function updateButtonIcon(isLight: boolean): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '#theme-toggle, #theme-toggle-mobile'
  );
  buttons.forEach((button) => {
    const icon = button.querySelector('span');
    if (icon) icon.textContent = isLight ? '🌙' : '☀️';
    button.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
  });
}

export function initThemeSwitcher(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const prefersLight = stored
    ? stored === 'light'
    : window.matchMedia('(prefers-color-scheme: light)').matches;

  applyTheme(prefersLight);

  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '#theme-toggle, #theme-toggle-mobile'
  );
  buttons.forEach((button) => button.addEventListener('click', toggleTheme));

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches);
    }
  });
}
