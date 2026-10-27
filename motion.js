(() => {
  window.initSiteMotion = () => {
    const page = document.documentElement;
    if (page.classList.contains('motion-ready')) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = document.querySelector('.hero-photo');
    const heroImage = hero?.querySelector('img');
    const progress = document.createElement('div');
    progress.className = 'motion-reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    let reduced = preference.matches;
    let heroVisible = false;
    let scheduledFrame = 0;
    let enterObserver;
    const targets = new Set();
    const entranceSelectors = [
      '.hero-deck', '.chapter-links>p', '.chapter-links>a',
      '.section-heading .side-note', '.section-heading h2', '.section-heading .lead',
      '.survey-contrast>div', '.survey-detail', '.source-note',
      '.interview-layout>div:first-child>h3', '.interview-layout>div:first-child>p',
      '.interview-layout blockquote', '.interview-list>details',
      '.opark-copy>h2', '.opark-copy>p', '.large-fact', '.opark-copy>.text-link',
      '.process-interactive', '.resource-branches>a',
      '.compost-heading>h2', '.compost-heading>.lead', '.compost-fact',
      '.compost-layout>div>p', '.compost-layout>div>h3', '.soil-mix',
      '.energy-path>span', '.energy-estimate', '.record-strip>p', '.record-strip>div',
      '.world-list>article', '.location-heading>div', '.location-heading>p',
      '.howto-list>li', '.sorting-guide>div',
      '.footer-title', '.footer-details>p', '.footer-details>div'
    ].join(',');
    const imageSelectors = '.opark-photo>img,.compost-layout figure>img,.board-figure>img';
    function reveal(element) {
      element.classList.add('is-visible');
      enterObserver?.unobserve(element);
    }
    if ('IntersectionObserver' in window) {
      enterObserver = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
      }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    }
    function prepare(element, index, image = false) {
      if (targets.has(element)) return;
      targets.add(element);
      element.classList.add(image ? 'motion-image' : 'motion-enter');
      // Sibling delays keep the page's existing editorial order.
      element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 85}ms`);
      if (element.matches('details')) element.classList.add('motion-detail');
      const bounds = element.getBoundingClientRect();
      if (reduced || !enterObserver || bounds.bottom < 0) reveal(element);
      else enterObserver.observe(element);
    }
    function collect(scope = document) {
      scope.querySelectorAll(entranceSelectors).forEach((element, index) => prepare(element, index));
      scope.querySelectorAll(imageSelectors).forEach((element, index) => prepare(element, index, true));
    }
    function updateScrollMotion() {
      scheduledFrame = 0;
      const travel = Math.max(0, page.scrollHeight - window.innerHeight);
      const amount = travel ? Math.max(0, Math.min(1, window.scrollY / travel)) : 0;
      progress.style.transform = `scaleX(${amount})`;
      if (heroImage && heroVisible && !reduced) {
        const bounds = hero.getBoundingClientRect();
        const offset = Math.max(-22, Math.min(22, -bounds.top * .065));
        heroImage.style.setProperty('--motion-hero-y', `${offset.toFixed(2)}px`);
      }
    }
    function requestScrollMotion() {
      if (!scheduledFrame) scheduledFrame = window.requestAnimationFrame(updateScrollMotion);
    }
    function updatePreference() {
      reduced = preference.matches;
      page.classList.toggle('motion-reduced', reduced);
      if (reduced) {
        targets.forEach(reveal);
        heroImage?.style.removeProperty('--motion-hero-y');
      }
      requestScrollMotion();
    }
    page.classList.toggle('motion-reduced', reduced);
    collect();
    page.classList.add('motion-ready');
    if (hero && 'IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting;
        requestScrollMotion();
      });
      heroObserver.observe(hero);
    } else heroVisible = Boolean(hero);
    // Research details arrive asynchronously; only this list is observed.
    const interviews = document.querySelector('#interview-list');
    if (interviews && 'MutationObserver' in window) {
      new MutationObserver(() => {
        interviews.querySelectorAll(':scope>details').forEach((element, index) => prepare(element, index));
      }).observe(interviews, { childList: true });
    }
    document.addEventListener('focusin', event => {
      const target = event.target.closest?.('.motion-enter,.motion-image');
      if (target) reveal(target);
    });
    window.addEventListener('scroll', requestScrollMotion, { passive: true });
    window.addEventListener('resize', requestScrollMotion, { passive: true });
    window.addEventListener('load', requestScrollMotion, { once: true });
    if (preference.addEventListener) preference.addEventListener('change', updatePreference);
    else preference.addListener(updatePreference);
    requestScrollMotion();
  };
})();
