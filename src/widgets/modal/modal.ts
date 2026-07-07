export function initModal(): void {
  const modal = document.getElementById('project-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !overlay || !closeBtn) return;

  let lastFocused: HTMLElement | null = null;
  let focusable: HTMLElement[] = [];

  function trap(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open(trigger: HTMLElement): void {
    lastFocused = trigger;
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    focusable = Array.from(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
    focusable[0]?.focus();
    document.addEventListener('keydown', onKey);
  }

  function close(): void {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    lastFocused?.focus();
  }

  function onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') close();
    trap(e);
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  window.openProjectModal = (trigger: HTMLElement, data: Record<string, string>): void => {
    const title = modal.querySelector('[data-modal="title"]');
    const desc = modal.querySelector('[data-modal="desc"]');
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.description;
    open(trigger);
  };
}

declare global {
  interface Window {
    openProjectModal: (trigger: HTMLElement, data: Record<string, string>) => void;
  }
}
