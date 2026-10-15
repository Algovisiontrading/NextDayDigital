/* ===========================================================
   NextDay Digital — shared behaviour
   No dependencies. Everything degrades without JS.
   =========================================================== */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var qs = new URLSearchParams(location.search);

  /* ---------- colour mode ----------
     Each demo declares its own default on <html data-default>.
     ?mode=dark deep-links; the choice then follows the visitor. */
  var html = document.documentElement;
  var KEY  = 'ndd-mode';

  function apply(mode) {
    html.setAttribute('data-theme', mode);
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    $$('.dock-seg button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    });
    var tc = $('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', getComputedStyle(document.body).backgroundColor);
  }

  var urlMode = (qs.get('mode') || '').toLowerCase();
  var stored  = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  apply(urlMode === 'dark' || urlMode === 'light' ? urlMode
        : stored || html.getAttribute('data-default') || 'light');

  $$('.dock-seg button').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.mode); });
  });
  $$('[data-toggle-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input,textarea,select')) return;
    var k = e.key.toLowerCase();
    if (k === 'l') apply('light');
    if (k === 'd') apply('dark');
  });

  /* ---------- mobile drawer ---------- */
  var burger = $('#burger'), drawer = $('#drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      drawer.classList.toggle('open', !open);
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        burger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
      }
    });
  }

  /* ---------- sticky header + read progress ---------- */
  var head = $('#head'), prog = $('#prog'), tick = false;
  function frame() {
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (head) head.classList.toggle('stuck', y > 8);
    if (prog) prog.style.setProperty('--p', h > 0 ? y / h : 0);
    tick = false;
  }
  addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(frame); }
  }, { passive: true });
  frame();

  /* ---------- reveal on scroll ---------- */
  var items = $$('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- gallery filters (themes.html) ---------- */
  var grid = $('#grid');
  if (grid) {
    var cards = $$('[data-cat]', grid), chips = $$('.chip-filter'), count = $('#count');
    function filter(key, push) {
      var n = 0;
      cards.forEach(function (c) {
        var ok = key === 'all' || c.dataset.cat === key;
        c.hidden = !ok;
        if (ok) n++;
      });
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === key)); });
      if (count) count.textContent = key === 'all'
        ? 'Showing all ' + n + ' themes'
        : 'Showing ' + n + ' of ' + cards.length + ' themes';
      if (push) try { history.replaceState(null, '', key === 'all' ? location.pathname : '?c=' + key); } catch (e) {}
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () { filter(c.dataset.filter, true); });
    });
    var start = qs.get('c');
    if (start && chips.some(function (c) { return c.dataset.filter === start; })) filter(start, false);
  }

  /* ---------- inquiry form (index.html) ---------- */
  var form = $('#inquiry');
  if (form) {
    var status = $('#status'), themeField = $('#f-theme'), note = $('#picked');
    var want = qs.get('theme');
    if (want && themeField) {
      themeField.value = want.slice(0, 80);
      if (note) { note.textContent = 'Starting from: ' + themeField.value; note.hidden = false; }
    }
    $$('[data-theme-pick]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (themeField) themeField.value = a.dataset.themePick;
      });
    });

    var DRAFT = 'ndd-draft';
    var fields = $$('input[name],textarea[name]', form).filter(function (f) { return f.type !== 'hidden'; });
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT) || '{}');
      fields.forEach(function (f) { if (d[f.name]) f.value = d[f.name]; });
    } catch (e) {}
    fields.forEach(function (f) {
      f.addEventListener('input', function () {
        var o = {};
        fields.forEach(function (g) { if (g.value) o[g.name] = g.value; });
        try { localStorage.setItem(DRAFT, JSON.stringify(o)); } catch (e) {}
        f.removeAttribute('aria-invalid');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.company_url && form.elements.company_url.value) return; // honeypot
      var biz = $('#f-business'), need = $('#f-needs');
      var miss = [biz, need].filter(function (f) { return f && !f.value.trim(); });
      if (miss.length) {
        miss.forEach(function (f) { f.setAttribute('aria-invalid', 'true'); });
        miss[0].focus();
        if (status) status.textContent = 'Add your business name and a short note, then try again.';
        return;
      }
      var fd = new FormData(form);
      var body = [
        'Name: '      + (fd.get('name')    || 'Not provided'),
        'Business: '  +  fd.get('business'),
        'Website: '   + (fd.get('website') || 'None yet'),
        'Phone: '     + (fd.get('phone')   || 'Not provided'),
        'Theme: '     + (fd.get('theme')   || 'Help me choose'),
        '', 'What I need:', fd.get('needs')
      ].join('\n');
      location.href = 'mailto:anthonyalfano157@gmail.com'
        + '?subject=' + encodeURIComponent('Website inquiry — ' + fd.get('business'))
        + '&body='    + encodeURIComponent(body);
      if (status) status.textContent = 'Your email draft is open — review it and hit send. Nothing was stored by this page.';
      try { localStorage.removeItem(DRAFT); } catch (e) {}
    });
  }

  /* ---------- anchor scrolling with header offset ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 84, behavior: reduce ? 'auto' : 'smooth' });
      try { history.replaceState(null, '', id); } catch (err) {}
    });
  });
})();
