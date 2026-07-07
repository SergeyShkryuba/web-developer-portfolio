const SCROLL_THRESHOLD = 500;

export function initBackToTop(): void {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  const toggleVisibility = () => {
    const isVisible = window.scrollY > SCROLL_THRESHOLD;
    button.classList.toggle('hidden', !isVisible);
    button.classList.toggle('flex', isVisible);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  button.addEventListener('click', scrollToTop);
  toggleVisibility();
}
