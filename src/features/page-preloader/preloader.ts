export function initPreloader(): void {
  const preloader = document.getElementById('preloader');

  if (!preloader) {
    return;
  }

  const hidePreloader = () => {
    preloader.classList.add('hidden');

    setTimeout(() => {
      preloader.remove();
    }, 400);
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
}
