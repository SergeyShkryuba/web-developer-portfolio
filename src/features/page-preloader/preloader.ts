export function initPreloader(): void {
  const preloader = document.getElementById('preloader');

  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  };

  if (document.readyState === 'complete') return hidePreloader();
  
  window.addEventListener('load', hidePreloader);
}
