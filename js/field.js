/* =========================================================
   FIELD - hero particle field
   Motivated: it is the page's only ambient surface and it
   carries the HUD identity. Pauses when off-screen or in a
   background tab, honours reduced motion, renders at DPR.
   ========================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('field');
  if (!canvas || !canvas.getContext) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ctx = canvas.getContext('2d', { alpha: true });

  var dpr = 1;
  var W = 0;
  var H = 0;
  var nodes = [];
  var raf = null;
  var visible = true;
  var pointer = { x: -9999, y: -9999, active: false };

  var ACCENT = '95,208,230';
  var LINK_DIST = 130;
  var MAX_NODES = 90;

  function build() {
    var target = Math.min(MAX_NODES, Math.floor((W * H) / 22000));
    nodes = [];
    for (var i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.1 + 0.4,
        a: Math.random() * 0.3 + 0.12
      });
    }
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function grid() {
    var step = 68;
    ctx.strokeStyle = 'rgba(' + ACCENT + ',0.035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (var y = step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
  }

  function links() {
    ctx.lineWidth = 1;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;
        var alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.16;
        ctx.strokeStyle = 'rgba(' + ACCENT + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    grid();

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      if (pointer.active) {
        var px = n.x - pointer.x;
        var py = n.y - pointer.y;
        var pd = Math.sqrt(px * px + py * py);
        if (pd < 120 && pd > 0.5) {
          var push = (1 - pd / 120) * 0.35;
          n.x += (px / pd) * push;
          n.y += (py / pd) * push;
        }
      }

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + ACCENT + ',' + n.a + ')';
      ctx.fill();
    }

    links();
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (raf === null && visible && !reduceMotion.matches) raf = requestAnimationFrame(step);
  }

  function stop() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  function paintStatic() {
    ctx.clearRect(0, 0, W, H);
    grid();
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + ACCENT + ',' + n.a + ')';
      ctx.fill();
    }
    links();
  }

  size();

  if (reduceMotion.matches) {
    paintStatic();
  } else {
    start();
  }

  // pause when the hero scrolls away
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 }).observe(canvas);
  }

  // pause in background tabs
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  // resize without thrashing
  if ('ResizeObserver' in window) {
    var pending = null;
    new ResizeObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(function () {
        size();
        if (reduceMotion.matches) paintStatic();
      }, 140);
    }).observe(canvas);
  }

  // pointer interaction, skipped on touch to save battery
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    canvas.parentElement.addEventListener('pointermove', function (e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    });
    canvas.parentElement.addEventListener('pointerleave', function () {
      pointer.active = false;
    });
  }

  var onPrefChange = function () {
    if (reduceMotion.matches) { stop(); paintStatic(); } else { start(); }
  };
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onPrefChange);
  else reduceMotion.addListener(onPrefChange);
})();
