(function () {
  try {
    if ('animate' in Element.prototype && window.matchMedia &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('intro');
    }
  } catch (e) {}
})();
