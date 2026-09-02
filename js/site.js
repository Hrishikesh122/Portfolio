/* =========================================================
   SITE - mobile nav, scroll reveal, boot sequence
   No scroll listeners. IntersectionObserver only.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile navigation ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.setAttribute('data-open', String(open));
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // close the menu if the viewport grows past the breakpoint
    var desktop = window.matchMedia('(min-width: 901px)');
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else desktop.addListener(onChange);
  }

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- boot sequence ----------
     Runs once per browser session, capped at roughly 1.1s,
     skipped entirely under reduced motion, and dismissable
     by click or key so it never blocks a reader.            */
  var boot = document.getElementById('boot');
  if (!boot) return;

  var seen = false;
  try { seen = sessionStorage.getItem('hh:booted') === '1'; } catch (err) { seen = false; }

  if (seen || reduceMotion) {
    boot.hidden = true;
    return;
  }

  var lineEl = boot.querySelector('.boot__line');
  var fillEl = boot.querySelector('.boot__fill');
  var skipEl = boot.querySelector('.boot__skip');
  var lines = [
    'loading profile',
    'ml + security modules ready',
    'system online'
  ];
  var timers = [];
  var finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('hh:booted', '1'); } catch (err) { /* private mode */ }
    boot.classList.add('is-done');
    setTimeout(function () { boot.hidden = true; }, 520);
    document.removeEventListener('keydown', finish);
  }

  lines.forEach(function (line, i) {
    timers.push(setTimeout(function () {
      if (lineEl) lineEl.textContent = '> ' + line;
      if (fillEl) fillEl.style.width = ((i + 1) / lines.length) * 100 + '%';
    }, i * 320));
  });

  timers.push(setTimeout(finish, lines.length * 320 + 200));

  if (skipEl) skipEl.addEventListener('click', finish);
  boot.addEventListener('click', finish);
  document.addEventListener('keydown', finish);
})();
