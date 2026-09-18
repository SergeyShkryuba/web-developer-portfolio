const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type ProjectModalData = {
  title: string;
  description: string;
};

export function initModal(): void {
  const modal = document.getElementById('project-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !overlay || !closeBtn) return;

  // Narrowed once here so the closures below do not have to re-check; TypeScript
  // widens the outer `const` back to `HTMLElement | null` inside a function.
  const modalEl: HTMLElement = modal;
  const overlayEl: HTMLElement = overlay;

  let lastFocused: HTMLElement | null = null;
  let focusable: HTMLElement[] = [];

  function trap(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      close();
      return;
    }
    trap(e);
  }

  function open(trigger: HTMLElement): void {
    lastFocused = trigger;
    modalEl.classList.remove('hidden');
    overlayEl.classList.remove('hidden');
    overlayEl.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    focusable = Array.from(modalEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    focusable[0]?.focus();
    document.addEventListener('keydown', onKey);
  }

  function close(): void {
    modalEl.classList.add('hidden');
    overlayEl.classList.add('hidden');
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    lastFocused?.focus();
    lastFocused = null;
  }

  closeBtn.addEventListener('click', close);
  overlayEl.addEventListener('click', close);

  window.openProjectModal = (trigger: HTMLElement, data: ProjectModalData): void => {
    const title = modalEl.querySelector('[data-modal="title"]');
    const desc = modalEl.querySelector('[data-modal="desc"]');
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.description;
    open(trigger);
  };
}

declare global {
  interface Window {
    openProjectModal: (trigger: HTMLElement, data: ProjectModalData) => void;
  }
}
