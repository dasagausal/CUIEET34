/* Mejora progresiva: el contenido y los desplegables funcionan sin JavaScript. */
(() => {
  const menu = document.querySelector('#navegacion');
  const toggle = document.querySelector('.menu-toggle');
  if (!menu || !toggle) return;
  document.documentElement.classList.add('js');
  toggle.hidden = false;
  const groups = [...menu.querySelectorAll('details')];
  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    groups.forEach(group => { group.open = false; });
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    if (!open) groups.forEach(group => { group.open = false; });
  });
  groups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (group.open) groups.forEach(other => { if (other !== group) other.open = false; });
    });
  });
  menu.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const destination = link.getAttribute('href');
    // Abrir también los recursos que tienen su propia sección desplegable.
    if (destination?.startsWith('#')) {
      const target = document.getElementById(destination.slice(1));
      if (target?.tagName === 'DETAILS') target.open = true;
      closeMenu();
      // Al ocultar el menú móvil, mantener el foco en el destino del enlace.
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) groups.forEach(group => { group.open = false; });
    const link = event.target.closest('a[href^="#"]');
    if (link) {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target?.tagName === 'DETAILS') target.open = true;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const active = document.activeElement;
      const group = active?.closest('.nav-group');
      if (menu.classList.contains('is-open') || group) {
        const focusTarget = menu.classList.contains('is-open') ? toggle : group.querySelector('summary');
        closeMenu();
        focusTarget.focus();
      }
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
})();
