export function initReadingProgress(): void {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}
