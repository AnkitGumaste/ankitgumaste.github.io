(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add('in');
    }
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Scrollspy
  const links = $$('.navlinks a');
  const drawerLinks = $$('.drawer-panel a[data-spy]');
  const sections = $$('section.section[id]');

  const spy = new IntersectionObserver((entries) => {
    // pick the most visible
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    const id = visible.target.id;
    const setActive = (arr) => arr.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    setActive(links);
    setActive(drawerLinks);
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: [0.12, 0.25, 0.4]
  });
  sections.forEach(s => spy.observe(s));

  // Mobile drawer
  const drawer = $('.drawer');
  const menuBtn = $('.menu');
  const closeBtn = $('.drawer-x');

  const openDrawer = () => drawer.classList.add('open');
  const closeDrawer = () => drawer.classList.remove('open');

  menuBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Close drawer on click
  drawerLinks.forEach(a => a.addEventListener('click', () => closeDrawer()));

  // Fix sticky-header anchor offset for browsers that don't respect scroll-margin-top reliably.
  const navH = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--navH').trim();
    const n = parseInt(v.replace('px',''), 10);
    return Number.isFinite(n) ? n : 78;
  };

  const smoothToHash = (hash) => {
    const el = document.getElementById(hash.replace('#',''));
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - (navH() + 14);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const allAnchors = [...links, ...drawerLinks].filter(a => (a.getAttribute('href')||'').startsWith('#'));
  allAnchors.forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    smoothToHash(a.getAttribute('href'));
    history.replaceState(null, '', a.getAttribute('href'));
  }));

  

  // Clicking the profile badge should always scroll to the very top.
  const profile = $('.profile');
  profile?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#top');
  });
// If loaded with a hash
  window.addEventListener('load', () => {
    if (location.hash) setTimeout(() => smoothToHash(location.hash), 50);
  });
})();
