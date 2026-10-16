/* ===========================================================
   NextDay Digital — themed cursors + ambient backgrounds
   Theme is detected from the page's theme-*.css link, so the
   same file works on every page. No dependencies.
   =========================================================== */
(function () {
  'use strict';
  if (window.__ndFx) return;
  window.__ndFx = true;

  var root = document.documentElement;
  var link = document.querySelector('link[rel="stylesheet"][href*="theme-"]');
  var found = link && /theme-([a-z]+)\.css/.exec(link.getAttribute('href'));
  var theme = found ? found[1] : 'nextday';
  root.setAttribute('data-fx', theme);

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var TAU = Math.PI * 2, R = Math.random;
  function rand(a, b) { return a + R() * (b - a); }
  function pick(a) { return a[(R() * a.length) | 0]; }

  /* ---------- colours ---------- */
  var SECOND = {
    restaurant: [217, 184, 106], landscape: [150, 190, 120], auto: [200, 214, 208],
    bakery: [236, 186, 120], fitness: [255, 106, 94], salon: [232, 170, 185],
    contractor: [90, 140, 200], professional: [176, 141, 68], nextday: [160, 205, 110]
  };
  var col = { a: [128, 128, 128], f: [20, 20, 20], w: SECOND[theme] || [180, 180, 180] };
  function parse(v) {
    v = (v || '').trim();
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
    if (!m) {
      var r = /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(v);
      return r ? [+r[1], +r[2], +r[3]] : null;
    }
    var h = m[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function readColors() {
    var cs = getComputedStyle(root);
    col.a = parse(cs.getPropertyValue('--accent')) || col.a;
    col.f = parse(cs.getPropertyValue('--fg')) || col.f;
  }
  function C(k) { return k === 'a' ? col.a : k === 'f' ? col.f : col.w; }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, a).toFixed(3) + ')'; }

  /* ===========================================================
     CURSORS — 48×48 artwork, tools drawn upright then rotated
     so the working end points to the top-left hotspot.
     =========================================================== */
  var TILT = 'transform="rotate(-45 24 24)"';
  var CURSORS = {
    restaurant: { hs: [9, 9], svg: // fork
      '<g ' + TILT + '><path class="fx-sb" stroke-width="2.4" stroke-linecap="round" d="M19 3v10M24 3v10M29 3v10M19 12.5c0 4.5 2.2 6.5 5 6.5s5-2 5-6.5"/>' +
      '<rect class="fx-a" x="21.6" y="18.5" width="4.8" height="27" rx="2.4"/></g>' },
    landscape: { hs: [9, 9], svg: // pruning shears
      '<g ' + TILT + '><path class="fx-b fx-blade-a" d="M22.5 25 L19 4.5 Q21 2.5 23.8 4.6 L25.6 25 Z"/>' +
      '<path class="fx-b fx-blade-b" d="M25.5 25 L29 4.5 Q27 2.5 24.2 4.6 L22.4 25 Z"/>' +
      '<path class="fx-sa" stroke-width="3.2" stroke-linecap="round" d="M23 25 L17 36 M25 25 L31 36"/>' +
      '<circle class="fx-sa" stroke-width="3" cx="15.5" cy="40" r="4.3"/><circle class="fx-sa" stroke-width="3" cx="32.5" cy="40" r="4.3"/>' +
      '<circle class="fx-a" cx="24" cy="25" r="2.1"/></g>' },
    contractor: { hs: [9, 9], svg: // hammer
      '<g ' + TILT + '><rect class="fx-a" x="21.5" y="12" width="5" height="33" rx="2.2"/>' +
      '<rect class="fx-b" x="11" y="3" width="22" height="9" rx="1.6"/><rect class="fx-b" x="7.5" y="4.2" width="4.5" height="6.6" rx="1"/>' +
      '<path class="fx-b" d="M32.5 4 q6.5 .8 7.8 5.6 l-2.2 .6 q-2-2.8-5.6-2.6z"/><rect class="fx-b" x="20.5" y="11" width="7" height="4" rx="1"/></g>' },
    auto: { hs: [9, 9], svg: // wrench
      '<g ' + TILT + '><path class="fx-sb" stroke-width="5" stroke-linecap="round" d="M19.2 4.2 A8 8 0 1 0 28.8 4.2"/>' +
      '<rect class="fx-b" x="21.5" y="17" width="5" height="28" rx="2.5"/><rect class="fx-a" x="21.5" y="33" width="5" height="10" rx="2"/></g>' },
    bakery: { hs: [9, 9], svg: // whisk
      '<g ' + TILT + '><g class="fx-sb" stroke-width="1.8"><path d="M24 22 C14 16 16 2 24 2 C32 2 34 16 24 22Z"/>' +
      '<path d="M24 22 C18.5 16 19.5 3 24 2 C28.5 3 29.5 16 24 22Z"/><path d="M24 22V2"/></g>' +
      '<rect class="fx-a" x="21.6" y="21" width="4.8" height="24" rx="2.4"/></g>' },
    fitness: { hs: [9, 9], svg: // dumbbell
      '<g ' + TILT + '><rect class="fx-b" x="22.6" y="6" width="2.8" height="36" rx="1.2"/>' +
      '<rect class="fx-a" x="15" y="3" width="18" height="6" rx="1.5"/><rect class="fx-a" x="17" y="9" width="14" height="4" rx="1.2"/>' +
      '<rect class="fx-a" x="17" y="35" width="14" height="4" rx="1.2"/><rect class="fx-a" x="15" y="39" width="18" height="6" rx="1.5"/></g>' },
    salon: { hs: [9, 9], svg: // comb
      '<g ' + TILT + '><rect class="fx-a" x="18" y="3" width="7" height="42" rx="3"/>' +
      '<path class="fx-sb" stroke-width="1.6" stroke-linecap="round" d="M25 6h6M25 9.5h6M25 13h6M25 16.5h6M25 20h6M25 23.5h6M25 27h6M25 30.5h6M25 34h6M25 37.5h6M25 41h6"/></g>' },
    professional: { hs: [9, 9], svg: // fountain pen
      '<g ' + TILT + '><path class="fx-a" d="M24 2 L18.5 15 H29.5 Z"/><path class="fx-sb" stroke-width="1.1" d="M24 6.5v7"/>' +
      '<rect class="fx-b" x="18.5" y="15" width="11" height="29" rx="4"/><rect class="fx-a" x="18.5" y="20" width="11" height="2.5"/></g>' },
    nextday: { hs: [8, 6], svg: // pointer
      '<path class="fx-a" d="M8 6 L8 37 L16.5 29 L22 41.5 L27.5 39 L22 27 L33.5 27 Z"/>' }
  };

  var cursorEl = null;
  if (fine) {
    var def = CURSORS[theme] || CURSORS.nextday;
    var SIZE = 40, hx = def.hs[0] * SIZE / 48, hy = def.hs[1] * SIZE / 48;
    cursorEl = document.createElement('div');
    cursorEl.className = 'fx-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.style.setProperty('--fx-hx', hx + 'px');
    cursorEl.style.setProperty('--fx-hy', hy + 'px');
    cursorEl.innerHTML = '<div class="fx-cursor-hover"><div class="fx-cursor-inner">' +
      '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' + def.svg + '</svg></div></div>';
    document.body.appendChild(cursorEl);
    root.classList.add('fx-has-cursor');

    var mx = -100, my = -100, moveRaf = 0, clickTimer = 0;
    var NATIVE = 'input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]):not([type=range]),textarea,select,[contenteditable="true"]';
    var HOVER = 'a,button,summary,label,[role="button"],.tcard';
    function place() { moveRaf = 0; cursorEl.style.transform = 'translate3d(' + (mx - hx) + 'px,' + (my - hy) + 'px,0)'; }

    addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      cursorEl.classList.add('is-visible');
      if (!moveRaf) moveRaf = requestAnimationFrame(place);
      var t = e.target && e.target.closest ? e.target : null;
      var native = !!(t && t.closest(NATIVE));
      cursorEl.classList.toggle('is-native', native);
      cursorEl.classList.toggle('is-hover', !native && !!(t && t.closest(HOVER)));
    }, { passive: true });

    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget) cursorEl.classList.remove('is-visible'); });

    addEventListener('pointerdown', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (e.button !== 0) return;
      cursorEl.classList.remove('is-click');
      void cursorEl.offsetWidth; // restart the animation on rapid clicks
      cursorEl.classList.add('is-click');
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { cursorEl.classList.remove('is-click'); }, 520);
    }, { passive: true });
  }

  /* ===========================================================
     CANVASES
     =========================================================== */
  var bg = document.createElement('canvas');
  bg.className = 'fx-bg';
  bg.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(bg, document.body.firstChild);
  var ctx = bg.getContext('2d');

  var fx = document.createElement('canvas');
  fx.className = 'fx-burst';
  fx.setAttribute('aria-hidden', 'true');
  document.body.appendChild(fx);
  var fctx = fx.getContext('2d');
  if (!ctx || !fctx) { root.classList.remove('fx-has-cursor'); if(cursorEl) cursorEl.remove(); bg.remove(); fx.remove(); return; }

  var W = 0, H = 0, DPR = 1, parts = [], sparks = [], fxDirty = false;

  /* ---------- drawing helpers ---------- */
  function glow(x, y, r, c, a) {
    if (r <= 0) return;
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(c, a));
    g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  function leaf(c, x, y, s, rot, fill, rib) {
    c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = fill;
    c.beginPath(); c.moveTo(0, -s);
    c.quadraticCurveTo(s * .75, 0, 0, s); c.quadraticCurveTo(-s * .75, 0, 0, -s); c.fill();
    if (rib) { c.strokeStyle = fill; c.lineWidth = .8; c.beginPath(); c.moveTo(0, -s); c.lineTo(0, s * 1.3); c.stroke(); }
    c.restore();
  }
  function star(c, x, y, s, rot, fill) {
    c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = fill; c.beginPath();
    for (var i = 0; i < 8; i++) { var r = i % 2 ? s * .32 : s * 1.4, a = i * Math.PI / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    c.closePath(); c.fill(); c.restore();
  }

  /* ===========================================================
     AMBIENT BACKGROUND SYSTEMS — one per theme
     =========================================================== */
  var SYS = {
    /* Candlelit bokeh drifting upward */
    restaurant: {
      n: 12,
      make: function (p, init) { p.r = rand(60, 170); p.x = rand(0, W); p.y = init ? rand(0, H) : H + p.r; p.vx = rand(-.08, .08); p.vy = -rand(.06, .22); p.al = rand(.05, .12); p.ph = rand(0, TAU); p.ck = R() < .65 ? 'w' : 'a'; },
      draw: function (p, t) { glow(p.x, p.y, p.r, C(p.ck), p.al * (.6 + .4 * Math.sin(t * .0011 + p.ph))); }
    },
    /* Leaves drifting down on a breeze */
    landscape: {
      n: 16,
      make: function (p, init) { p.s = rand(7, 15); p.x = rand(0, W); p.y = init ? rand(0, H) : -30; p.vy = rand(.25, .6); p.vx = rand(-.15, .25); p.rot = rand(0, TAU); p.vr = rand(-.012, .012); p.ph = rand(0, TAU); p.al = rand(.13, .24); p.ck = R() < .6 ? 'a' : 'w'; },
      move: function (p, dt, t) { p.y += p.vy * dt; p.x += (p.vx + Math.sin(t * .0009 + p.ph) * .35) * dt; p.rot += p.vr * dt; },
      draw: function (p) { leaf(ctx, p.x, p.y, p.s, p.rot, rgba(C(p.ck), p.al), true); }
    },
    /* Studio light reflections sweeping across a dot grid */
    auto: {
      n: 5,
      make: function (p, init) { p.len = rand(220, 520); p.x = init ? rand(-W * .2, W) : -p.len - rand(0, W * .6); p.y = rand(-H * .3, H); p.v = rand(1.2, 2.6); p.al = rand(.07, .14); p.w = rand(1, 2.4); p.ck = R() < .5 ? 'a' : 'w'; },
      move: function (p, dt) { p.x += p.v * dt; p.y += p.v * .36 * dt; },
      out: function (p) { return p.x > W + 40 || p.y > H + 300; },
      under: function () {
        ctx.fillStyle = rgba(col.f, .06);
        for (var y = 18; y < H; y += 36) for (var x = 18; x < W; x += 36) ctx.fillRect(x, y, 1.2, 1.2);
      },
      draw: function (p) {
        var x2 = p.x + p.len, y2 = p.y + p.len * .36, c = C(p.ck), g = ctx.createLinearGradient(p.x, p.y, x2, y2);
        g.addColorStop(0, rgba(c, 0)); g.addColorStop(.5, rgba(c, p.al)); g.addColorStop(1, rgba(c, 0));
        ctx.strokeStyle = g; ctx.lineWidth = p.w; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(x2, y2); ctx.stroke();
      }
    },
    /* Flour dust rising through warm oven glow */
    bakery: {
      n: 46,
      make: function (p, init) { p.s = rand(.8, 2.6); p.x = rand(0, W); p.y = init ? rand(0, H) : H + 10; p.vy = -rand(.08, .3); p.ph = rand(0, TAU); p.al = rand(.18, .4); p.ck = R() < .7 ? 'w' : 'a'; },
      move: function (p, dt, t) { p.y += p.vy * dt; p.x += Math.sin(t * .0007 + p.ph) * .18 * dt; },
      under: function (t) {
        var big = Math.max(W, H);
        glow(W * .15 + Math.sin(t * .0002) * 60, H * .25, big * .35, col.w, .1);
        glow(W * .85 + Math.cos(t * .00017) * 80, H * .8, big * .32, col.a, .07);
      },
      draw: function (p) { ctx.fillStyle = rgba(C(p.ck), p.al); ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, TAU); ctx.fill(); }
    },
    /* Speed lines + a heartbeat pulse */
    fitness: {
      n: 16,
      make: function (p, init) { p.len = rand(50, 160); p.x = init ? rand(0, W) : W + rand(20, 300); p.y = rand(0, H); p.v = rand(1.6, 3.6); p.w = rand(1.5, 4); p.al = rand(.06, .13); },
      move: function (p, dt) { p.x -= p.v * dt; },
      out: function (p) { return p.x < -p.len - 80; },
      under: function (t) {
        var beat = (t % 1100) / 1100, pulse = Math.exp(-Math.pow((beat - .1) * 14, 2)) + .6 * Math.exp(-Math.pow((beat - .3) * 14, 2));
        glow(W * .82, H * .72, Math.max(W, H) * .42, col.a, .04 + .06 * pulse);
      },
      draw: function (p) {
        var g = ctx.createLinearGradient(p.x, p.y, p.x + p.len, p.y);
        g.addColorStop(0, rgba(col.a, p.al)); g.addColorStop(1, rgba(col.a, 0));
        ctx.strokeStyle = g; ctx.lineWidth = p.w; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.len, p.y); ctx.stroke();
      }
    },
    /* Petals and soft bubbles floating up */
    salon: {
      n: 18,
      make: function (p, init) { p.r = rand(4, 16); p.x = rand(0, W); p.y = init ? rand(0, H) : H + 30; p.vy = -rand(.12, .35); p.ph = rand(0, TAU); p.al = rand(.12, .22); p.ck = R() < .6 ? 'w' : 'a'; p.petal = R() < .45; p.rot = rand(0, TAU); p.vr = rand(-.008, .008); },
      move: function (p, dt, t) { p.y += p.vy * dt; p.x += Math.sin(t * .0008 + p.ph) * .3 * dt; p.rot += p.vr * dt; },
      draw: function (p) {
        var c = C(p.ck);
        if (p.petal) { leaf(ctx, p.x, p.y, p.r * .9, p.rot, rgba(c, p.al), false); return; }
        ctx.strokeStyle = rgba(c, p.al * 1.4); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.stroke();
        glow(p.x - p.r * .3, p.y - p.r * .3, p.r, c, p.al * .6);
      }
    },
    /* Moving blueprint grid with survey crosshairs */
    contractor: {
      n: 7,
      make: function (p, init) { p.s = rand(10, 22); p.x = rand(0, W); p.y = init ? rand(0, H) : H + 40; p.vy = -rand(.05, .14); p.rot = rand(0, TAU); p.vr = rand(-.004, .004); p.al = rand(.16, .3); },
      move: function (p, dt) { p.y += p.vy * dt; p.rot += p.vr * dt; },
      under: function (t) {
        var step = 48, off = (t * .006) % step, i = 0, x, y;
        ctx.lineWidth = 1;
        for (x = -step + off; x < W + step; x += step, i++) {
          ctx.strokeStyle = rgba(col.w, i % 4 === 0 ? .11 : .055);
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (i = 0, y = -step + off; y < H + step; y += step, i++) {
          ctx.strokeStyle = rgba(col.w, i % 4 === 0 ? .11 : .055);
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
      },
      draw: function (p) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.strokeStyle = rgba(col.a, p.al); ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(0, 0, p.s, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(-p.s * 1.5, 0); ctx.lineTo(p.s * 1.5, 0); ctx.moveTo(0, -p.s * 1.5); ctx.lineTo(0, p.s * 1.5); ctx.stroke();
        ctx.restore();
      }
    },
    /* Ledger paper with figures drifting upward */
    professional: {
      n: 14,
      make: function (p, init) { p.s = rand(14, 30); p.x = rand(0, W); p.y = init ? rand(0, H) : H + 30; p.vy = -rand(.06, .16); p.ch = pick(['$', '%', '§', '¶', '+', '=', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']); p.al = rand(.05, .09); p.ck = R() < .5 ? 'f' : 'w'; },
      under: function (t) {
        var step = 34, off = (t * .008) % step;
        ctx.strokeStyle = rgba(col.f, .045); ctx.lineWidth = 1;
        for (var y = -off; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        ctx.strokeStyle = rgba(col.w, .14);
        ctx.beginPath(); ctx.moveTo(W * .07, 0); ctx.lineTo(W * .07, H); ctx.stroke();
      },
      draw: function (p) { ctx.fillStyle = rgba(C(p.ck), p.al); ctx.font = '300 ' + p.s.toFixed(0) + 'px Merriweather, Georgia, serif'; ctx.fillText(p.ch, p.x, p.y); }
    },
    /* Agency pages: slow-moving soft orbs */
    nextday: {
      n: 5,
      make: function (p) { p.r = rand(180, 360); p.x = rand(0, W); p.y = rand(0, H); p.vx = rand(-.18, .18); p.vy = rand(-.14, .14); p.al = rand(.06, .11); p.ck = R() < .5 ? 'a' : 'w'; },
      move: function (p, dt) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      },
      out: function () { return false; },
      draw: function (p) { glow(p.x, p.y, p.r, C(p.ck), p.al); }
    }
  };
  var sys = SYS[theme] || SYS.nextday;

  function drift(p, dt) { p.x += (p.vx || 0) * dt; p.y += (p.vy || 0) * dt; }
  function outside(p) { var m = (p.r || p.s || 20) + 40; return p.x < -m || p.x > W + m || p.y < -m || p.y > H + m; }

  function seed() {
    var scale = Math.min(1.4, Math.max(.45, (W * H) / (1440 * 900)));
    var count = Math.round(sys.n * scale);
    parts = [];
    for (var i = 0; i < count; i++) { var p = {}; sys.make(p, true); parts.push(p); }
  }

  function drawBg(t, dt) {
    ctx.clearRect(0, 0, W, H);
    if (sys.under) sys.under(t);
    var move = sys.move || drift, out = sys.out || outside;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (dt) { move(p, dt, t); if (out(p)) sys.make(p, false); }
      sys.draw(p, t);
    }
  }

  /* ===========================================================
     CLICK BURSTS — themed particles on every click
     =========================================================== */
  var BURST = {
    restaurant:   { shape: 'dot',   n: 10, ck: 'w', g: .05,  sp: [1, 3] },
    landscape:    { shape: 'leaf',  n: 7,  ck: 'a', g: .04,  sp: [1, 2.6] },
    contractor:   { shape: 'spark', n: 14, ck: 'a', g: .12,  sp: [2, 5] },
    auto:         { shape: 'star',  n: 7,  ck: 'a', g: 0,    sp: [.8, 2.4] },
    bakery:       { shape: 'dot',   n: 14, ck: 'w', g: .14,  sp: [1.2, 3.4] },
    fitness:      { shape: 'spark', n: 10, ck: 'a', g: 0,    sp: [3, 6] },
    salon:        { shape: 'star',  n: 8,  ck: 'a', g: -.01, sp: [.8, 2.2] },
    professional: { shape: 'dot',   n: 7,  ck: 'f', g: .08,  sp: [.6, 2] },
    nextday:      { shape: 'dot',   n: 10, ck: 'a', g: 0,    sp: [1, 3] }
  };

  function burst(x, y) {
    if (reduce) return;
    var b = BURST[theme] || BURST.nextday;
    if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
    sparks.push({ ring: true, x: x, y: y, r: 4, life: 1 });
    for (var i = 0; i < b.n; i++) {
      var a = rand(0, TAU), s = rand(b.sp[0], b.sp[1]);
      sparks.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: b.g, life: 1, decay: rand(.018, .032),
        s: rand(2, 5), rot: rand(0, TAU), vr: rand(-.2, .2), shape: b.shape, ck: b.ck });
    }
  }
  addEventListener('pointerdown', function (e) { if (e.button === 0 || e.pointerType !== 'mouse') burst(e.clientX, e.clientY); }, { passive: true });

  function drawBurst(dt) {
    if (!sparks.length) {
      if (fxDirty) { fctx.clearRect(0, 0, W, H); fxDirty = false; }
      return;
    }
    fxDirty = true;
    fctx.clearRect(0, 0, W, H);
    for (var i = sparks.length - 1; i >= 0; i--) {
      var p = sparks[i];
      if (p.ring) { p.r += 2.4 * dt; p.life -= .05 * dt; }
      else {
        p.vy += p.g * dt; p.vx *= .985; p.vy *= .985;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life -= p.decay * dt;
      }
      if (p.life <= 0) { sparks.splice(i, 1); continue; }
      if (p.ring) {
        fctx.strokeStyle = rgba(col.a, p.life * .55); fctx.lineWidth = 1.5;
        fctx.beginPath(); fctx.arc(p.x, p.y, p.r, 0, TAU); fctx.stroke();
        continue;
      }
      var fill = rgba(C(p.ck), p.life * .9);
      if (p.shape === 'leaf') leaf(fctx, p.x, p.y, p.s * 1.6, p.rot, fill, true);
      else if (p.shape === 'star') star(fctx, p.x, p.y, p.s, p.rot, fill);
      else if (p.shape === 'spark') {
        fctx.strokeStyle = fill; fctx.lineWidth = 2; fctx.lineCap = 'round';
        fctx.beginPath(); fctx.moveTo(p.x, p.y); fctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); fctx.stroke();
      } else { fctx.fillStyle = fill; fctx.beginPath(); fctx.arc(p.x, p.y, p.s * .7, 0, TAU); fctx.fill(); }
    }
  }

  /* ===========================================================
     LOOP, RESIZE, VISIBILITY, COLOUR-MODE CHANGES
     =========================================================== */
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    [bg, fx].forEach(function (c) { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); });
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
    if (reduce) drawBg(0, 0);
  }

  var running = !document.hidden, last = performance.now();
  var motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  function motionChanged(){ reduce=motionQuery.matches; sparks=[]; running=!reduce&&!document.hidden; last=performance.now(); if(running) queueFrame(); else {drawBg(0,0); fctx.clearRect(0,0,W,H);} }
  if(motionQuery.addEventListener) motionQuery.addEventListener('change',motionChanged);
  var frameHandle=0;
  function queueFrame(){if(!frameHandle) frameHandle=requestAnimationFrame(frame);}
  function frame(now) {
    frameHandle=0;
    if (!running || reduce || document.hidden) return;
    var dt = Math.min(50, now - last) / 16.667;
    last = now;
    drawBg(now, dt);
    drawBurst(dt);
    queueFrame();
  }

  readColors();
  resize();

  var resizeTimer = 0;
  addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

  new MutationObserver(function () { readColors(); if (reduce) drawBg(0, 0); })
    .observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden && !reduce;
    if (running) { last = performance.now(); queueFrame(); }
  });
  if (!reduce) queueFrame();
})();

