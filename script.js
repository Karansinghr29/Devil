/* =========================================================
   A Birthday Surprise — behaviour
   All personal content comes from config.js. Nothing to edit here.
   ========================================================= */
(function () {
  'use strict';

  var C = window.CONFIG || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE  = window.matchMedia('(pointer: coarse)').matches;
  var SMALL   = Math.min(window.innerWidth, window.innerHeight) < 700;

  /* =======================================================
     1. ATMOSPHERE — one canvas for hearts / ∞ / sparkles
     ======================================================= */
  var Atmos = (function () {
    var cv = $('#atmosphere');
    var ctx = cv.getContext('2d', { alpha: true });
    var W = 0, H = 0, DPR = 1;
    var drift = [];      // ambient, endless
    var burst = [];      // short-lived, from balloon pops
    var sprites = {};
    var raf = null, last = 0, running = false;

    /* --- pre-rendered sprites (drawn once, then blitted) --- */
    function sprite(size, paint) {
      var c = document.createElement('canvas');
      c.width = c.height = size;
      paint(c.getContext('2d'), size);
      return c;
    }

    function heartSprite(color, glow) {
      return sprite(64, function (g, s) {
        g.translate(s / 2, s / 2 + 3);
        g.scale(s / 32, s / 32);
        g.shadowColor = glow; g.shadowBlur = 10;
        g.fillStyle = color;
        g.beginPath();
        g.moveTo(0, 10);
        g.bezierCurveTo(-14, -2, -10, -14, 0, -7);
        g.bezierCurveTo(10, -14, 14, -2, 0, 10);
        g.closePath();
        g.fill();
      });
    }

    function infinitySprite(color) {
      return sprite(64, function (g, s) {
        g.translate(s / 2, s / 2);
        g.strokeStyle = color;
        g.lineWidth = 2.6;
        g.lineCap = 'round';
        g.shadowColor = color; g.shadowBlur = 8;
        g.beginPath();
        var a = 20, b = 12;
        for (var t = 0; t <= Math.PI * 2 + 0.02; t += 0.06) {
          var d = 1 + Math.sin(t) * Math.sin(t);
          var x = (a * Math.cos(t)) / d;
          var y = (b * Math.sin(t) * Math.cos(t)) / d * 2;
          t === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        g.stroke();
      });
    }

    function sparkSprite(color) {
      return sprite(48, function (g, s) {
        var r = s / 2;
        var grd = g.createRadialGradient(r, r, 0, r, r, r);
        grd.addColorStop(0, color);
        grd.addColorStop(0.35, color.replace('1)', '0.45)'));
        grd.addColorStop(1, color.replace('1)', '0)'));
        g.fillStyle = grd;
        g.beginPath(); g.arc(r, r, r, 0, 6.2832); g.fill();
      });
    }

    function buildSprites() {
      sprites.heart = heartSprite('rgba(255,120,175,0.95)', 'rgba(255,95,158,0.9)');
      sprites.heartSoft = heartSprite('rgba(255,190,220,0.75)', 'rgba(255,143,195,0.6)');
      sprites.inf = infinitySprite('rgba(196,167,255,0.8)');
      sprites.spark = sparkSprite('rgba(255,238,250,1)');
      sprites.sparkLav = sparkSprite('rgba(200,175,255,1)');

      /* the blues — only ever drawn while the song is playing */
      sprites.blue     = heartSprite('rgba(116,178,255,0.95)', 'rgba(80,150,255,0.95)');
      sprites.blueSoft = heartSprite('rgba(176,216,255,0.82)', 'rgba(130,190,255,0.75)');
      sprites.blueDeep = heartSprite('rgba(88,138,255,0.92)',  'rgba(64,110,255,0.9)');
      sprites.blueSpark = sparkSprite('rgba(198,228,255,1)');
      sprites.blueInf  = infinitySprite('rgba(150,200,255,0.85)');
    }

    /* ---- the song bloom -------------------------------------------------
       One extra pool of particles, drawn with the same blitter as the rest.
       songT eases 0..1 so it swells in when she presses play and drains
       away when she pauses, instead of snapping on and off.              */
    var song = [];
    var songT = 0, songTarget = 0;
    var SONG_MAX = 0;

    function blueOf() {
      var r = Math.random();
      return r > 0.72 ? sprites.blueDeep : (r > 0.36 ? sprites.blue : sprites.blueSoft);
    }

    /* mostly blue, with a few of the warm ones mixed through */
    function songHeart() {
      return Math.random() > 0.82
        ? (Math.random() > 0.5 ? sprites.heartSoft : sprites.heart)
        : blueOf();
    }

    /* seed=true scatters them over the whole screen (the opening swell);
       seed=false starts them just under the fold so replacements are in
       view within a second or two, not half a minute. */
    function makeSong(seed) {
      var r = Math.random();
      var kind = r > 0.975 ? 'cross'
               : r > 0.945 ? 'big'
               : r > 0.90  ? 'inf'
               : r > 0.72  ? 'spark'
               : r > 0.56  ? 'side'
               : 'up';
      var p = { kind: kind, ph: rnd(0, 6.28), vx: 0, glow: false };

      if (kind === 'side') {                       // drifts in from either edge
        var left = Math.random() > 0.5;
        p.x = left ? -50 : W + 50;
        p.y = rnd(H * 0.06, H * 0.98);
        p.vx = (left ? 1 : -1) * rnd(22, 58);
        p.vy = -rnd(4, 18);
        p.sz = rnd(13, 30);
        p.al = rnd(0.32, 0.66);
        p.sway = rnd(5, 16);
        p.spr = songHeart();
      } else if (kind === 'cross') {               // a big one, right across the screen
        var l2 = Math.random() > 0.5;
        p.x = l2 ? -90 : W + 90;
        p.y = rnd(H * 0.15, H * 0.85);
        p.vx = (l2 ? 1 : -1) * rnd(34, 74);
        p.vy = -rnd(5, 14);
        p.sz = rnd(52, 92);
        p.al = rnd(0.16, 0.30);
        p.sway = rnd(8, 20);
        p.spr = Math.random() > 0.5 ? sprites.blueSoft : sprites.blue;
        p.glow = true;
      } else if (kind === 'big') {                 // blooms in place, then goes
        p.x = rnd(W * 0.12, W * 0.88);
        p.y = seed ? rnd(H * 0.2, H * 0.9) : H + rnd(4, 60);
        p.vy = -rnd(14, 30);
        p.sz = rnd(40, 76);
        p.al = rnd(0.20, 0.38);
        p.sway = rnd(10, 26);
        p.life = p.max = rnd(5, 9);
        p.spr = Math.random() > 0.5 ? sprites.blueSoft : sprites.blue;
        p.glow = true;
      } else if (kind === 'spark') {
        p.x = rnd(0, W);
        p.y = seed ? rnd(0, H) : H + rnd(4, 50);
        p.vy = -rnd(22, 58);
        p.sz = rnd(3, 9);
        p.al = rnd(0.45, 0.95);
        p.sway = rnd(6, 22);
        p.spr = Math.random() > 0.45 ? sprites.blueSpark : sprites.spark;
      } else if (kind === 'inf') {
        p.x = rnd(0, W);
        p.y = seed ? rnd(0, H) : H + rnd(4, 60);
        p.vy = -rnd(18, 34);
        p.sz = rnd(22, 44);
        p.al = rnd(0.16, 0.34);
        p.sway = rnd(10, 30);
        p.spr = sprites.blueInf;
      } else {                                     // the main body: hearts rising
        p.x = rnd(0, W);
        p.y = seed ? rnd(-H * 0.1, H * 1.05) : H + rnd(4, 70);
        p.vy = -rnd(30, 76);
        p.sz = rnd(11, 34);
        p.al = rnd(0.34, 0.78);
        p.sway = rnd(12, 44);
        p.spr = songHeart();
        p.glow = Math.random() > 0.84;
      }
      p.baseX = p.x;
      return p;
    }

    function stepSong(dt) {
      /* swell in over ~1.2s, drain out over ~2.5s */
      var rate = songTarget > songT ? 1.4 : 0.55;
      songT += (songTarget - songT) * Math.min(1, dt * rate * 2.2);
      if (songTarget === 0 && songT < 0.004) { songT = 0; if (song.length) song.length = 0; }
      if (songT <= 0) return;

      /* Keep the pool full for as long as the song runs. New ones enter
         just below the fold, so the screen never quietly empties out. */
      var want = Math.round(SONG_MAX * songT);
      if (song.length < want) {
        var add = Math.min(3, want - song.length);
        for (var k = 0; k < add; k++) song.push(makeSong(songT < 0.85));
      }

      /* on pause they ease to a drift rather than carrying on at full tilt */
      var sp = 0.4 + 0.6 * songT;

      for (var i = song.length - 1; i >= 0; i--) {
        var p = song[i];
        p.ph += dt * 0.75;
        p.y += p.vy * dt * sp;
        if (p.kind === 'side' || p.kind === 'cross') p.x += p.vx * dt * sp;
        else p.x = p.baseX + Math.sin(p.ph) * p.sway;
        if (p.life !== undefined) p.life -= dt;

        if (p.y < -110 || p.x < -130 || p.x > W + 130 || (p.life !== undefined && p.life <= 0)) {
          song.splice(i, 1);
          continue;
        }
        var a = p.al * songT;
        /* the big ones fade in and back out instead of just popping */
        if (p.life !== undefined) a *= Math.sin(Math.PI * (1 - p.life / p.max));

        if (p.glow) {                              // a soft bloom under the shape
          ctx.globalAlpha = a * 0.26;
          var gz = p.sz * 1.9;
          ctx.drawImage(p.spr, p.x - gz / 2, p.y - gz / 2, gz, gz);
        }
        ctx.globalAlpha = a;
        ctx.drawImage(p.spr, p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
      }
    }

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function makeDrift(kind, seedTop) {
      var p = {
        kind: kind,
        x: rnd(0, W),
        y: seedTop ? rnd(-H * 0.2, H * 1.1) : H + rnd(20, 200),
        sp: 0, sz: 0, al: 0, sway: rnd(14, 46), ph: rnd(0, 6.28), rot: rnd(-0.3, 0.3),
        spr: null
      };
      if (kind === 'heart') {
        p.sz = rnd(11, 22); p.sp = rnd(14, 30); p.al = rnd(0.30, 0.62);
        p.spr = Math.random() > 0.5 ? sprites.heart : sprites.heartSoft;
      } else if (kind === 'inf') {
        p.sz = rnd(20, 40); p.sp = rnd(9, 18); p.al = rnd(0.16, 0.34);
        p.spr = sprites.inf;
      } else {
        p.sz = rnd(2.5, 7); p.sp = rnd(8, 26); p.al = rnd(0.35, 0.9);
        p.spr = Math.random() > 0.65 ? sprites.sparkLav : sprites.spark;
        p.sway = rnd(6, 22);
      }
      p.baseX = p.x;
      return p;
    }

    function populate() {
      var d = (C.atmosphere && C.atmosphere.density) || 1;
      if (REDUCED) d *= 0.35;
      var base = SMALL ? { h: 9, i: 5, s: 16 } : { h: 15, i: 8, s: 28 };
      drift = [];
      var k, n;
      for (k = 0, n = Math.round(base.h * d); k < n; k++) drift.push(makeDrift('heart', true));
      for (k = 0, n = Math.round(base.i * d); k < n; k++) drift.push(makeDrift('inf', true));
      for (k = 0, n = Math.round(base.s * d); k < n; k++) drift.push(makeDrift('spark', true));
      SONG_MAX = Math.round((SMALL ? 54 : 92) * d * (REDUCED ? 0.28 : 1));
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, COARSE ? 2 : 1.75);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function tick(now) {
      raf = requestAnimationFrame(tick);
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, W, H);

      var i, p;
      for (i = 0; i < drift.length; i++) {
        p = drift[i];
        p.y -= p.sp * dt;
        p.ph += dt * 0.7;
        p.x = p.baseX + Math.sin(p.ph) * p.sway;
        if (p.y < -60) { drift[i] = makeDrift(p.kind, false); continue; }
        ctx.globalAlpha = p.al;
        ctx.drawImage(p.spr, p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
      }

      stepSong(dt);

      for (i = burst.length - 1; i >= 0; i--) {
        p = burst[i];
        p.life -= dt;
        if (p.life <= 0) { burst.splice(i, 1); continue; }
        p.vy += 42 * dt;              // soft gravity
        p.vx *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.max)) * p.al;
        ctx.drawImage(p.spr, p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
      }
      ctx.globalAlpha = 1;
    }

    var held = false;   // paused while the last surprise owns the screen
    function start() { if (!running && !held) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    return {
      init: function () {
        buildSprites();
        resize();
        populate();
        start();
        var t;
        window.addEventListener('resize', function () {
          clearTimeout(t);
          t = setTimeout(function () { resize(); populate(); }, 220);
        }, { passive: true });
        document.addEventListener('visibilitychange', function () {
          document.hidden ? stop() : start();
        });
      },
      /* the song bloom — called by the player on play / pause */
      setSong: function (on) { songTarget = on ? 1 : 0; },
      /* freeze the ambient canvas while something else fills the screen */
      hold: function (on) {
        held = !!on;
        if (held) stop(); else if (!document.hidden) start();
      },
      /* heart shower from a point — used when a balloon pops */
      pop: function (x, y, count) {
        var n = REDUCED ? 6 : (count || (SMALL ? 16 : 24));
        for (var i = 0; i < n; i++) {
          var a = Math.random() * Math.PI * 2;
          var sp = rnd(60, 210);
          var isSpark = Math.random() > 0.55;
          burst.push({
            x: x, y: y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - rnd(20, 90),
            sz: isSpark ? rnd(4, 9) : rnd(13, 26),
            al: rnd(0.65, 1),
            spr: isSpark ? sprites.spark : (Math.random() > 0.5 ? sprites.heart : sprites.heartSoft),
            life: rnd(1.1, 2.1)
          });
          burst[burst.length - 1].max = burst[burst.length - 1].life;
        }
        if (burst.length > 260) burst.splice(0, burst.length - 260);
      }
    };
  })();

  /* =======================================================
     2. OPENING SCREEN — balloons
     ======================================================= */
  var Gate = (function () {
    var wrap = $('#balloons');
    var gate = $('#gate');
    var opened = false;

    /* one family only — rose → violet, with a single warm champagne accent */
    var PALETTES = [
      ['#ffb0d2', '#ff5f9e', '#75204b'],
      ['#d3c0ff', '#9a74ff', '#382063'],
      ['#ffc4de', '#e0559b', '#5c1b3d'],
      ['#c6aaff', '#8b5cf6', '#31195a'],
      ['#ffe0c4', '#f0a08c', '#6b3f3a'],
      ['#ffbcd9', '#c85bb0', '#4a1c50']
    ];

    /* balloon anchors as % of the stage — tuned for a portrait phone */
    var SPOTS = [
      { x: 24, y: 24, w: 30 }, { x: 72, y: 17, w: 25 },
      { x: 50, y: 47, w: 36 }, { x: 17, y: 66, w: 26 },
      { x: 80, y: 61, w: 28 }, { x: 44, y: 82, w: 22 },
      { x: 66, y: 88, w: 20 }, { x: 12, y: 40, w: 19 }
    ];

    function svg(pal, id) {
      return '' +
      '<svg viewBox="0 0 100 148" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="g' + id + '" cx="34%" cy="28%" r="72%">' +
            '<stop offset="0%" stop-color="' + pal[0] + '"/>' +
            '<stop offset="55%" stop-color="' + pal[1] + '"/>' +
            '<stop offset="100%" stop-color="' + pal[2] + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M50 108 L44 118 L56 118 Z" fill="' + pal[2] + '"/>' +
        '<path d="M50 118 c7 8 -8 12 -1 20 c6 7 -5 8 -2 10" fill="none" ' +
              'stroke="rgba(255,255,255,.30)" stroke-width="1.2" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="57" rx="40" ry="52" fill="url(#g' + id + ')"/>' +
        '<ellipse cx="34" cy="36" rx="11" ry="17" fill="rgba(255,255,255,.26)" transform="rotate(-22 34 36)"/>' +
        '<ellipse cx="63" cy="80" rx="7" ry="15" fill="rgba(255,255,255,.10)"/>' +
      '</svg>';
    }

    function build() {
      var want = (C.atmosphere && C.atmosphere.balloonCount) || 6;
      var n = Math.max(3, Math.min(want, SPOTS.length));
      var html = '';
      for (var i = 0; i < n; i++) {
        var s = SPOTS[i];
        var pal = PALETTES[i % PALETTES.length];
        html += '<button class="balloon" type="button" aria-label="Open the surprise" ' +
                'style="--x:' + s.x + '%;--y:' + s.y + '%;--w:' + s.w + '%;' +
                '--dur:' + (3.6 + (i % 4) * 0.65).toFixed(2) + 's;' +
                '--delay:' + (i * 0.28).toFixed(2) + 's">' + svg(pal, i) + '</button>';
      }
      wrap.innerHTML = html;
      $$('.balloon', wrap).forEach(function (b) {
        b.addEventListener('click', function (e) { open(b, e); }, { passive: true });
      });
    }

    function open(el, e) {
      if (opened) return;
      opened = true;

      var r = el.getBoundingClientRect();
      Atmos.pop(r.left + r.width / 2, r.top + r.height / 2);
      if (navigator.vibrate) { try { navigator.vibrate(18); } catch (x) {} }

      el.classList.add('is-popping');

      /* the rest let go and float away, one after another */
      var others = $$('.balloon').filter(function (b) { return b !== el; });
      others.forEach(function (b, i) {
        setTimeout(function () {
          var rr = b.getBoundingClientRect();
          Atmos.pop(rr.left + rr.width / 2, rr.top + rr.height / 2, SMALL ? 8 : 12);
          b.classList.add('is-flyaway');
        }, 140 + i * 110);
      });

      /* the intro text is driven by a `forwards` animation — cancel it first,
         otherwise the animated value keeps winning over the inline style */
      [$('#gateEyebrow'), $('#gateHint')].forEach(function (n, i) {
        n.style.animation = 'none';
        n.style.opacity = '1';
        n.getBoundingClientRect();                       // force a reflow
        n.style.transition = 'opacity ' + (i ? 0.45 : 0.6) + 's ease';
        n.style.opacity = '0';
      });

      Audio.unlock();
      Voice.unlock();

      setTimeout(function () { gate.classList.add('is-gone'); }, 760);
      setTimeout(function () {
        document.body.classList.remove('is-locked');
        gate.style.display = 'none';
        var story = $('#story');
        story.setAttribute('aria-hidden', 'false');
        story.classList.add('is-live');
        window.scrollTo(0, 0);
        Reveal.arm();
        Reveal.show($('#sec-reveal'));
      }, 1400);
    }

    /* back to the very beginning, without reloading the page */
    function reset() {
      opened = false;
      build();
      [$('#gateEyebrow'), $('#gateHint')].forEach(function (n) {
        n.style.transition = '';
        n.style.opacity = '';
        n.style.animation = '';            // lets the intro animation play again
      });
      document.body.classList.add('is-locked');
      var story = $('#story');
      story.classList.remove('is-live');
      story.setAttribute('aria-hidden', 'true');
      gate.style.display = '';
      gate.getBoundingClientRect();
      gate.classList.remove('is-gone');
      var root = document.documentElement;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      root.style.scrollBehavior = '';
    }

    return { init: function () { build(); }, reset: reset };
  })();

  /* =======================================================
     3. CONTENT — everything rendered straight from config.js
     ======================================================= */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* give the ❤ and ∞ glyphs inside headings their own colour */
  function heartify(s) {
    return esc(s)
      .replace(/❤/g, '<span class="hx">❤</span>')
      .replace(/∞/g, '<span class="ix">∞</span>');
  }

  function placeholderHTML(i) {
    return '<div class="ph"><b>❤</b>your photo<code>assets/Photo' + i + '.jpg</code></div>';
  }

  /* render a list of lines into a container, one <p> each, staggered.
     An empty string becomes a blank spacer line. */
  function renderLines(box, lines, opts) {
    if (!box || !lines || !lines.length) return;
    opts = opts || {};
    lines.forEach(function (line, i) {
      var p = document.createElement('p');
      p.style.setProperty('--d', i);
      if (!String(line).trim()) {
        p.className = 'is-gap';
        p.innerHTML = '&nbsp;';
      } else if (opts.heart) {
        p.innerHTML = heartify(line);
      } else {
        p.textContent = line;
      }
      box.appendChild(p);
    });
  }

  function buildContent() {
    document.title = C.pageTitle || 'For You';

    /* opening */
    $('#gateEyebrow').innerHTML = heartify(C.opening.eyebrow);
    $('#gateHint').firstElementChild.textContent = C.opening.hint;

    /* reveal */
    var r = C.reveal || {};
    if (r.title) {
      var parts = String(r.title).split(',');
      $('.bday__l1').textContent = parts.length > 1 ? parts[0] + ',' : parts[0];
      $('.bday__l2').innerHTML = esc((parts[1] || '').trim() || '') + ' <em>❤</em>';
      if (parts.length === 1) $('.bday__l1').textContent = '';
    }
    $('#revealMsg').innerHTML = heartify(r.message || '');
    renderLines($('#revealTa'), r.ta, { heart: true });

    /* memories */
    var m = C.memories || {};
    $('#memTitle').textContent = m.title || '';
    $('#memSub').textContent = m.subtitle || '';
    renderLines($('#memTa'), m.ta, { heart: true });
    var gal = $('#gallery');
    (m.photos || []).forEach(function (ph, i) {
      var f = document.createElement('div');
      f.className = 'frame';
      f.innerHTML =
        '<span class="frame__glow" aria-hidden="true"></span>' +
        '<div class="frame__shot">' +
          '<span class="frame__no">' + ('0' + (i + 1)).slice(-2) + '</span>' +
          '<img alt="" loading="lazy" decoding="async" src="' + esc(ph.src) + '">' +
        '</div>' +
        (ph.captionTa ? '<p class="frame__capTa">' + esc(ph.captionTa) + '</p>' : '') +
        (ph.caption ? '<p class="frame__cap">' + esc(ph.caption) + '</p>' : '');
      var shot = $('.frame__shot', f);
      var img = $('img', f);
      img.addEventListener('error', function () {
        shot.classList.add('is-empty');
        shot.insertAdjacentHTML('beforeend', placeholderHTML(i + 1));
      });
      gal.appendChild(f);
    });

    /* the feeling we both already know */
    var u = C.feelings || {};
    $('#feelTitle').textContent = u.title || '';
    renderLines($('#feelLines'), u.lines);
    renderLines($('#feelTa'), u.ta, { heart: true });
    $('#feelBridge').textContent = u.bridge || '';

    /* last year — the poem I hid it in */
    var po = C.lastYear || {};
    $('#lyEyebrow').textContent = po.eyebrow || '';
    renderLines($('#lyLines'), po.lines);
    renderLines($('#lyTa'), po.ta, { heart: true });
    $('#poemLabel').textContent = po.poemLabel || '';
    $('#poemTitle').textContent = po.titleTamil || '';
    renderLines($('#poemBody'), po.lines_poem);
    $('#poemSig').textContent = po.signature || '';

    /* song */
    var s = C.song || {};
    $('#songHead').innerHTML = heartify(s.heading || '');
    $('#songNote').textContent = s.note || '';
    renderLines($('#songTa'), s.ta, { heart: true });
    $('#songTitle').textContent = s.title || '';
    $('#songSub').textContent = s.subtitle || '';
    $('#songCredit').textContent = s.credit || '';
    if (s.artwork) {
      var im = new Image();
      im.onload = function () {
        var a = $('#art');
        $('.art__fallback', a).remove();
        a.insertBefore(im, a.firstChild);
      };
      im.alt = '';
      im.src = s.artwork;
    }

    /* letter */
    var L = C.letter || {};
    $('#letterHead').textContent = L.heading || '';
    $('#letterGreet').textContent = (L.greeting || 'Dear') + ' ' + (C.herName || '') + ',';
    $('#letterSign').innerHTML = esc(L.signOff || '') + '<b>' + esc(C.myName || '') + '</b>';
    renderLines($('#letterTa'), L.ta, { heart: true });

    /* my voice — kept behind the scratch cover until she opens it */
    var V = C.voice || {};
    var S = V.surprise || {};
    $('#voiceHead').innerHTML = heartify(V.heading || '');
    renderLines($('#voiceTa'), V.ta, { heart: true });
    $('#voiceLabel').textContent = V.label || 'Listen to me';
    $('#voiceLabelTa').textContent = V.labelTa || '';
    $('#foundTitle').innerHTML = heartify(S.foundTitle || 'You found it… ❤');
    $('#foundSub').textContent = S.foundSub || 'Now, listen.';
    $('#scratchSkip').textContent = S.skipLabel || 'or tap here to open it';

    /* finale */
    var F = C.finale || {};
    renderLines($('#finalLines'), F.lines);
    $('#loveText').textContent = F.big || 'I LOVE YOU';
    renderLines($('#finalTa'), F.ta, { heart: true });
    $('#finalSymbol').innerHTML = heartify(F.symbol || '❤ ∞');
    $('#finalClosing').textContent = F.closing || '';
    $('#replay').textContent = F.replayLabel || 'Live it again';

    /* generic stagger for [data-d] items */
    $$('[data-d]').forEach(function (el) { el.style.setProperty('--d', el.dataset.d); });
  }

  /* =======================================================
     4. SCROLL REVEAL + gentle photo parallax
     ======================================================= */
  var Reveal = (function () {
    var frames = [];
    var running = false;
    var armed = false;

    function show(el) {
      if (!el || el.classList.contains('is-shown')) return;
      el.classList.add('is-shown');
      if (el.id === 'sec-letter') Letter.run();
      if (el.id === 'sec-song') Audio.reached();
      if (el.id === 'sec-voice') Voice.reached();
    }

    function anyLive() {
      for (var i = 0; i < frames.length; i++) if (frames[i].live) return true;
      return false;
    }

    function loop() {
      var vh = window.innerHeight;
      for (var i = 0; i < frames.length; i++) {
        var f = frames[i];
        if (!f.live) continue;
        var r = f.shot.getBoundingClientRect();
        var mid = (r.top + r.height / 2 - vh / 2) / vh;       // -1 .. 1
        var py = Math.max(-1, Math.min(1, mid)) * -12;         // px
        f.zoom += (1 - f.zoom) * 0.06;
        f.img.style.transform =
          'translate3d(0,' + py.toFixed(2) + 'px,0) scale(' + f.zoom.toFixed(4) + ')';
      }
      if (anyLive() && !document.hidden) requestAnimationFrame(loop);
      else running = false;
    }

    function kick() {
      if (running || REDUCED) return;
      running = true;
      requestAnimationFrame(loop);
    }

    return {
      show: show,

      /* the story must stay perfectly still until the gate opens */
      arm: function () {
        if (armed) return;
        armed = true;

        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) { if (e.isIntersecting) show(e.target); });
        }, { threshold: 0.01, rootMargin: '0px 0px -14% 0px' });
        $$('.panel').forEach(function (p) { io.observe(p); });

        var fio = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) {
            for (var i = 0; i < frames.length; i++) {
              if (frames[i].el !== e.target) continue;
              frames[i].live = e.isIntersecting;
              if (e.isIntersecting) { e.target.classList.add('is-shown'); kick(); }
            }
          });
        }, { threshold: 0.12, rootMargin: '12% 0px 12% 0px' });

        $$('.frame').forEach(function (el) {
          var rec = { el: el, shot: $('.frame__shot', el), img: $('img', el), zoom: 1.07, live: false };
          if (REDUCED) { rec.zoom = 1; rec.img.style.transform = 'none'; }
          frames.push(rec);
          fio.observe(el);
        });

        document.addEventListener('visibilitychange', function () {
          if (!document.hidden) kick();
        });
      },

      init: function () {
        /* continue buttons */
        $$('.cue').forEach(function (b) {
          b.addEventListener('click', function () {
            var t = $(b.dataset.next);
            if (t) t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
          });
        });

        $('#replay').addEventListener('click', function () {
          document.body.style.transition = 'opacity .6s ease';
          document.body.style.opacity = '0';
          setTimeout(function () { location.reload(); }, 620);
        });
      }
    };
  })();

  /* =======================================================
     5. LETTER — typewriter reveal
     ======================================================= */
  var Letter = (function () {
    var started = false;
    var body = $('#letterBody');
    var sign = $('#letterSign');
    var skip = $('#skipType');
    var paras = (C.letter && C.letter.paragraphs) || [];
    var nodes = [];
    var done = false;

    function build() {
      paras.forEach(function () {
        var p = document.createElement('p');
        body.appendChild(p);
        nodes.push(p);
      });
    }

    function finish() {
      done = true;
      nodes.forEach(function (n, i) { n.textContent = paras[i]; });
      var c = $('.caret'); if (c) c.remove();
      sign.classList.add('is-shown');
      skip.hidden = true;
    }

    function type() {
      var idx = 0, ch = 0, acc = 0, last = performance.now();
      var caret = document.createElement('span');
      caret.className = 'caret';
      var CPS = 46;

      function step(now) {
        if (done) return;
        acc += ((now - last) / 1000) * CPS;
        last = now;
        while (acc >= 1) {
          acc -= 1;
          if (idx >= paras.length) { finish(); return; }
          var txt = paras[idx];
          if (ch >= txt.length) { idx++; ch = 0; acc -= 8; continue; }   // small pause between paragraphs
          ch++;
          nodes[idx].textContent = txt.slice(0, ch);
          nodes[idx].appendChild(caret);
        }
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    return {
      init: build,
      run: function () {
        if (started) return;
        started = true;
        if (REDUCED) { finish(); return; }
        skip.hidden = false;
        skip.addEventListener('click', finish);
        $('#letterCard').addEventListener('click', function (e) {
          if (!done && e.target !== skip) finish();
        });
        setTimeout(type, 1800);   // let the card finish fading in first
      }
    };
  })();

  /* =======================================================
     6. MUSIC PLAYER
     ======================================================= */
  var Audio = (function () {
    var a = $('#audio');
    var player = $('#player');
    var btn = $('#playBtn');
    var fill = $('#seekFill');
    var knob = $('#seekKnob');
    var seek = $('#seek');
    var tCur = $('#tCur'), tDur = $('#tDur');
    var err = $('#playerErr');
    var ready = false, broken = false, dragging = false, tried = false, armed = false;
    var srcPath = '';

    function fmt(t) {
      if (!isFinite(t) || t < 0) t = 0;
      var m = Math.floor(t / 60), s = Math.floor(t % 60);
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function paint() {
      var d = a.duration, c = a.currentTime;
      var pct = (isFinite(d) && d > 0) ? (c / d) * 100 : 0;
      fill.style.width = pct + '%';
      knob.style.left = pct + '%';
      seek.setAttribute('aria-valuenow', Math.round(pct));
      tCur.textContent = fmt(c);
    }

    function fail(msg) {
      broken = true;
      player.classList.remove('is-playing');
      err.hidden = false;
      err.innerHTML = msg;
    }

    function seekTo(clientX) {
      var r = seek.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      if (isFinite(a.duration) && a.duration > 0) { a.currentTime = p * a.duration; paint(); }
    }

    /* the file is only requested once she actually reaches the song —
       keeps the console clean on load while the mp3 is still missing */
    function arm() {
      if (armed || !srcPath) return;
      armed = true;
      a.src = srcPath;
    }

    function toggle() {
      arm();
      if (broken) return;
      if (a.paused) {
        var pr = a.play();
        if (pr && pr.catch) {
          pr.catch(function () {
            fail('Tap the button once more to start the song. 💗');
          });
        }
      } else {
        a.pause();
      }
    }

    return {
      init: function () {
        srcPath = (C.song && C.song.file) || '';

        a.addEventListener('loadedmetadata', function () { ready = true; tDur.textContent = fmt(a.duration); });
        a.addEventListener('timeupdate', function () { if (!dragging) paint(); });
        a.addEventListener('play',  function () {
          player.classList.add('is-playing');
          err.hidden = true;
          Atmos.setSong(true);
        });
        a.addEventListener('pause', function () {
          player.classList.remove('is-playing');
          Atmos.setSong(false);
        });
        a.addEventListener('ended', function () {
          player.classList.remove('is-playing');
          Atmos.setSong(false);
          a.currentTime = 0; paint();
        });
        a.addEventListener('error', function () {
          if (!armed) return;                     // no source set yet — nothing to report
          fail(/^https?:/i.test(srcPath)
            ? 'The song couldn\'t load from<br><code>' + esc(srcPath) + '</code>'
            : 'The song file isn\'t here yet.<br>Drop it in as <code>' + esc(srcPath) + '</code>');
        });

        btn.addEventListener('click', toggle);

        seek.addEventListener('pointerdown', function (e) {
          if (broken) return;
          dragging = true; seek.setPointerCapture(e.pointerId); seekTo(e.clientX);
        });
        seek.addEventListener('pointermove', function (e) { if (dragging) seekTo(e.clientX); });
        seek.addEventListener('pointerup', function () { dragging = false; });
        seek.addEventListener('pointercancel', function () { dragging = false; });
        seek.addEventListener('keydown', function (e) {
          if (!isFinite(a.duration)) return;
          if (e.key === 'ArrowRight') a.currentTime = Math.min(a.duration, a.currentTime + 5);
          if (e.key === 'ArrowLeft')  a.currentTime = Math.max(0, a.currentTime - 5);
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
        });
      },
      /* called on the very first tap (balloon) so mobile browsers trust us later */
      unlock: function () { try { a.load(); } catch (e) {} },
      reached: function () {
        if (tried || broken) return;
        tried = true;
        arm();
        if (C.song && C.song.autoPlayWhenReached) {
          var pr = a.play();
          if (pr && pr.catch) pr.catch(function () { /* she'll press play — that's fine */ });
        }
      }
    };
  })();

  /* =======================================================
     7a. THE SCRATCH COVER — she has no idea what is under it
         The cover art AND its words are painted into the canvas,
         so a finger swipe wipes them away together.
     ======================================================= */
  var Scratch = (function () {
    var wrap   = $('#scratch');
    var stage  = $('#scratchStage');
    var cv     = $('#scratchCover');
    var sparks = $('#scratchSparks');
    var skip   = $('#scratchSkip');

    var ctx = null, dpr = 1, W = 0, H = 0;
    var painted = false, drawing = false, opened = false, touched = false;
    var lastX = 0, lastY = 0, lastSpark = 0, lastCheck = 0;
    var onDone = null;
    var GLYPHS = ['✨', '💖', '❤', '💫', '✦'];

    var conf = (C.voice && C.voice.surprise) || {};
    var NEED = Math.min(0.75, Math.max(0.3, +conf.threshold || 0.5));

    /* tiny deterministic random, so the foil looks the same every paint */
    function rnd(seed) {
      var s = seed;
      return function () { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function wrap2(c, text, maxW) {
      var words = String(text).split(' ');
      var lines = [], line = '';
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + ' ' + words[i] : words[i];
        if (c.measureText(test).width > maxW && line) { lines.push(line); line = words[i]; }
        else line = test;
      }
      if (line) lines.push(line);
      return lines;
    }

    function paint() {
      W = stage.clientWidth;
      H = stage.clientHeight;
      if (!W || !H) return false;

      dpr = Math.min(window.devicePixelRatio || 1, 3);
      cv.width  = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width  = W + 'px';
      cv.style.height = H + 'px';

      ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);

      /* foil */
      var g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#ff6aa6');
      g.addColorStop(0.45, '#c05cd0');
      g.addColorStop(1, '#7f5cff');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      /* diagonal sheen */
      var s = ctx.createLinearGradient(0, H, W, 0);
      s.addColorStop(0.00, 'rgba(255,255,255,0)');
      s.addColorStop(0.42, 'rgba(255,255,255,.22)');
      s.addColorStop(0.56, 'rgba(255,255,255,.05)');
      s.addColorStop(1.00, 'rgba(255,255,255,0)');
      ctx.fillStyle = s;
      ctx.fillRect(0, 0, W, H);

      /* scattered little hearts, like a wrapping paper */
      var r = rnd(20240214);
      ctx.save();
      for (var i = 0; i < 26; i++) {
        var x = r() * W, y = r() * H, sz = 9 + r() * 12;
        ctx.globalAlpha = 0.10 + r() * 0.14;
        ctx.font = sz + 'px "Segoe UI Emoji","Apple Color Emoji",sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(r() > 0.5 ? '❤' : '✦', x, y);
      }
      ctx.restore();

      /* inner hairline frame */
      ctx.strokeStyle = 'rgba(255,255,255,.45)';
      ctx.lineWidth = 1;
      roundRect(ctx, 13, 13, W - 26, H - 26, 18);
      ctx.stroke();

      /* --- the words on the cover --- */
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var maxW = W - 56;
      var cy = H * 0.30;

      ctx.font = Math.round(Math.min(34, W * 0.10)) + 'px "Segoe UI Emoji","Apple Color Emoji",serif';
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = '#fff';
      ctx.fillText('✧', W / 2, cy - 4);
      ctx.globalAlpha = 1;

      var tSize = Math.round(Math.max(21, Math.min(30, W * 0.083)));
      ctx.font = 'italic 300 ' + tSize + 'px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,.28)';
      ctx.shadowBlur = 12;
      var title = wrap2(ctx, conf.coverTitle || 'A little surprise for you ❤', maxW);
      var ty = H * 0.48 - (title.length - 1) * tSize * 0.66;
      title.forEach(function (ln, i) { ctx.fillText(ln, W / 2, ty + i * tSize * 1.32); });

      var sSize = Math.round(Math.max(12.5, Math.min(15.5, W * 0.043)));
      ctx.font = '400 ' + sSize + 'px "Manrope", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,.88)';
      ctx.shadowBlur = 8;
      var sub = wrap2(ctx, conf.coverSub || 'There’s something waiting underneath…', maxW);
      var sy = ty + title.length * tSize * 1.32 + sSize * 1.4;
      sub.forEach(function (ln, i) { ctx.fillText(ln, W / 2, sy + i * sSize * 1.6); });

      ctx.shadowBlur = 0;
      ctx.font = '500 11px "Manrope", system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,.70)';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '2.6px';
      ctx.fillText(String(conf.coverHint || 'scratch with your finger').toUpperCase(), W / 2, H - 30);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

      painted = true;
      return true;
    }

    function pos(e) {
      var r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function erase(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = Math.max(34, Math.min(52, W * 0.14));
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      lastX = x; lastY = y;
    }

    function sparkle(x, y) {
      if (REDUCED) return;
      var now = Date.now();
      if (now - lastSpark < 70) return;
      lastSpark = now;
      var el = document.createElement('span');
      el.className = 'spark';
      el.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.style.left = (x + (Math.random() * 20 - 10)) + 'px';
      el.style.top  = (y + (Math.random() * 16 - 8)) + 'px';
      el.style.fontSize = (11 + Math.random() * 9).toFixed(0) + 'px';
      sparks.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 950);
    }

    /* how much of the cover is gone (sampled, not pixel-perfect) */
    function cleared() {
      var d;
      try { d = ctx.getImageData(0, 0, cv.width, cv.height).data; }
      catch (e) { return 0; }
      var step = 4 * 8, total = 0, gone = 0;
      for (var i = 3; i < d.length; i += step) {
        total++;
        if (d[i] < 40) gone++;
      }
      return total ? gone / total : 0;
    }

    function open() {
      if (opened) return;
      opened = true;
      wrap.classList.add('is-open');
      cv.setAttribute('aria-hidden', 'true');
      $('#scratchUnder').removeAttribute('aria-hidden');
      skip.hidden = true;
      if (onDone) onDone();
    }

    function down(e) {
      if (opened || !painted) return;
      drawing = true;
      touched = true;
      var p = pos(e);
      lastX = p.x; lastY = p.y;
      erase(p.x, p.y);
      sparkle(p.x, p.y);
      try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    }

    function move(e) {
      if (!drawing || opened) return;
      var p = pos(e);
      erase(p.x, p.y);
      sparkle(p.x, p.y);
      var now = Date.now();
      if (now - lastCheck > 160) {
        lastCheck = now;
        if (cleared() >= NEED) open();
      }
      e.preventDefault();
    }

    function up() {
      if (!drawing) return;
      drawing = false;
      if (!opened && cleared() >= NEED) open();
    }

    return {
      init: function (done) {
        onDone = done;
        if (!cv || !stage) { if (done) done(); return; }

        var go = function () { paint(); };
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(go, go);
        else go();
        /* a second pass once layout/fonts have certainly settled */
        setTimeout(function () { if (!touched && !opened) paint(); }, 900);

        cv.addEventListener('pointerdown', down);
        cv.addEventListener('pointermove', move);
        cv.addEventListener('pointerup', up);
        cv.addEventListener('pointercancel', up);

        skip.addEventListener('click', open);

        /* the cover has to survive a rotation, a late font, or a browser
           that only gives the section its real size once it scrolls near.
           Repaint whenever the box changes — but never once she has
           started scratching, or her progress would come back. */
        var refresh = function () {
          if (opened || touched) return;
          if (stage.clientWidth === W && stage.clientHeight === H && painted) return;
          paint();
        };
        if (window.ResizeObserver) new ResizeObserver(refresh).observe(stage);
        window.addEventListener('resize', refresh);
        window.addEventListener('orientationchange', function () { setTimeout(refresh, 250); });
      },
      /* she has arrived at the section: make sure the cover really drew */
      reached: function () {
        if (!painted || cv.clientWidth !== W) paint();
        if (opened) return;
        setTimeout(function () {
          if (!opened && !touched) skip.hidden = false;
        }, 15000);
      },
      isOpen: function () { return opened; }
    };
  })();

  /* =======================================================
     7b. MY VOICE — appears only once the cover is gone.
         One tap, no autoplay, never breaks.
     ======================================================= */
  var Voice = (function () {
    var a = $('#voiceAudio');
    var card = $('#vnote');
    var btn = $('#voiceBtn');
    var note = $('#voiceNote');
    var box = $('#voiceReveal');
    var hearts = $('#voiceHearts');
    var srcPath = '';
    var armed = false, missing = false, retried = false, heartTimer = 0;

    /* the file is only requested once she reaches this part of the story,
       so a missing recording never shows up as an error earlier on */
    function arm() {
      if (armed || !srcPath) return;
      armed = true;
      a.src = srcPath;
    }

    function markMissing() {
      missing = true;
      card.classList.remove('is-speaking');
      card.classList.remove('is-idle');
      card.classList.add('is-empty');
      note.hidden = false;
      note.textContent = (C.voice && C.voice.missing) || 'The recording is still coming. ❤';
      btn.setAttribute('aria-disabled', 'true');
    }

    function toggle() {
      arm();
      /* one quiet second chance — a single flaky load shouldn't cost her the
         recording. After that the card just keeps its gentle message. */
      if (missing && !retried && srcPath) {
        retried = true;
        missing = false;
        card.classList.remove('is-empty');
        card.classList.add('is-idle');
        note.hidden = true;
        try { a.src = srcPath + (srcPath.indexOf('?') < 0 ? '?' : '&') + 'r=1'; a.load(); } catch (e) {}
      }
      if (missing) return;
      if (a.paused) {
        var pr = a.play();
        if (pr && pr.catch) pr.catch(function () { markMissing(); });
      } else {
        a.pause();
      }
    }

    /* soft hearts drifting up while she listens */
    function heartsOn() {
      if (REDUCED || heartTimer) return;
      heartTimer = setInterval(function () {
        var el = document.createElement('span');
        el.className = 'vheart';
        el.textContent = Math.random() > .5 ? '❤' : '💗';
        el.style.left = (12 + Math.random() * 76) + '%';
        el.style.setProperty('--dx', (Math.random() * 44 - 22).toFixed(0) + 'px');
        el.style.fontSize = (12 + Math.random() * 8).toFixed(0) + 'px';
        el.style.animationDuration = (3.6 + Math.random() * 1.6).toFixed(2) + 's';
        hearts.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 5400);
      }, 760);
    }
    function heartsOff() {
      if (heartTimer) { clearInterval(heartTimer); heartTimer = 0; }
    }

    /* the cover has been scratched away — now, and only now, the
       recording gets to exist on the page */
    function reveal() {
      if (!box.hidden) return;
      box.hidden = false;
      void box.offsetWidth;                 // let the browser see it before we animate
      box.classList.add('is-open');
      arm();                                 // a missing file resolves quietly, before she taps
      setTimeout(function () {
        box.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
      }, 700);
    }

    return {
      init: function () {
        srcPath = (C.voice && C.voice.file) || '';
        Scratch.init(reveal);
        if (!srcPath) { markMissing(); return; }

        card.classList.add('is-idle');

        a.addEventListener('play', function () {
          card.classList.add('is-speaking');
          card.classList.remove('is-idle');
          btn.setAttribute('aria-label', 'Pause the recording');
          heartsOn();
        });
        a.addEventListener('pause', function () {
          card.classList.remove('is-speaking');
          if (!missing) card.classList.add('is-idle');
          btn.setAttribute('aria-label', 'Play the recording');
          heartsOff();
        });
        a.addEventListener('ended', function () {
          card.classList.remove('is-speaking');
          card.classList.add('is-idle');
          a.currentTime = 0;
          heartsOff();
        });
        a.addEventListener('error', function () {
          if (!armed) return;               // nothing requested yet
          markMissing();
        });

        btn.addEventListener('click', toggle);
      },
      /* shares the balloon tap so mobile browsers trust the later play() */
      unlock: function () { try { a.load(); } catch (e) {} },
      reached: function () { Scratch.reached(); }
    };
  })();

  /* =======================================================
     8. ONE LAST SURPRISE — a card drops in after the finale;
        tapping it plays a full-screen heart sequence, the final
        wish, then hands her back to the balloons.
     ======================================================= */
  var LastSurprise = (function () {
    var S = C.lastSurprise || {};
    var LINES = (S.lines && S.lines.length) ? S.lines : [
      'Love you ❤️', 'I’ll be with you.', 'Until my last breath.',
      'You are my forever.', 'Still you. Always you. ❤️'
    ];

    var card = null, cardTimer = 0, cardUp = false, everShown = false;
    var finalSeen = false, endSeen = false;
    var active = false;
    var ov = null, cv = null, ctx = null, heartEl = null, wordsEl = null, wishEl = null;
    var raf = 0, t0 = 0, lastNow = 0, W = 0, H = 0, DPR = 1;
    var parts = [], sprites = null, timers = [];
    var spawnAcc = 0, nextBurst = 0, nextBloom = 0, cleared = false;

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    /* ---------- timeline (seconds). Reduced motion gets a calmer, shorter cut ---------- */
    var TL = REDUCED ? {
      heart: 0.6, open: 2.6, words: 3.4, wordGap: 2.6, wordLife: 2.4, wordCount: 4,
      peakA: 5, peakB: 11, dark: 14, wish: 14.6, final: 17, out: 22.5,
      rate: [[0, 0], [2.6, 0], [2.7, 1.2], [5, 2], [11, 2], [13.4, 0], [15.4, 0], [16, 0.35], [40, 0.35]],
      speed: [[0, 0.6], [40, 0.6]],
      alpha: [[0, 1], [12.6, 1], [14, 0], [15.2, 0], [16.4, 0.7], [40, 0.7]]
    } : {
      heart: 0.9, open: 3.5, words: 6.6, wordGap: 1.75, wordLife: 2.9, wordCount: 9,
      peakA: 12, peakB: 19, dark: 25.4, wish: 26.2, final: 28.9, out: 35.2,
      rate: [[0, 0], [3.4, 0], [3.5, 2.5], [6, 5], [9, 9], [12, 15], [19, 15], [21.5, 6], [23.6, 1.5], [24.6, 0],
             [26.4, 0], [27.2, 1.1], [60, 1.1]],
      speed: [[0, 1], [19, 1], [24, 0.42], [26, 0.42], [27, 0.5], [60, 0.5]],
      alpha: [[0, 1], [21.5, 1], [25.2, 0], [26.3, 0], [27.8, 0.85], [60, 0.85]]
    };

    function curve(k, t) {
      if (t <= k[0][0]) return k[0][1];
      for (var i = 1; i < k.length; i++) {
        if (t <= k[i][0]) {
          var a = k[i - 1], b = k[i];
          return a[1] + (b[1] - a[1]) * ((t - a[0]) / (b[0] - a[0]));
        }
      }
      return k[k.length - 1][1];
    }

    /* ---------- sprites: drawn once, blitted every frame ---------- */
    function mk(size, paint) {
      var c = document.createElement('canvas');
      c.width = c.height = size;
      paint(c.getContext('2d'), size);
      return c;
    }
    function emoji(ch) {
      return mk(96, function (g, s) {
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.font = '72px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        g.fillText(ch, s / 2, s / 2 + 4);
      });
    }
    /* a real colour emoji has saturated pixels; a missing-glyph box doesn't */
    function colourful(c) {
      var d;
      try { d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; }
      catch (e) { return true; }
      for (var i = 0; i < d.length; i += 4 * 3) {
        if (d[i + 3] > 120 && Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 60) return true;
      }
      return false;
    }
    function glow(rgb) {
      return mk(64, function (g, s) {
        var r = s / 2, grd = g.createRadialGradient(r, r, 0, r, r, r);
        grd.addColorStop(0, 'rgba(' + rgb + ',1)');
        grd.addColorStop(0.3, 'rgba(' + rgb + ',.5)');
        grd.addColorStop(1, 'rgba(' + rgb + ',0)');
        g.fillStyle = grd; g.fillRect(0, 0, s, s);
      });
    }
    function vheart(fill, shine) {
      return mk(128, function (g, s) {
        g.translate(s / 2, s / 2 + 6);
        g.scale(s / 40, s / 40);
        g.shadowColor = shine; g.shadowBlur = 9;
        g.fillStyle = fill;
        g.beginPath();
        g.moveTo(0, 10);
        g.bezierCurveTo(-14, -2, -10, -14, 0, -7);
        g.bezierCurveTo(10, -14, 14, -2, 0, 10);
        g.closePath(); g.fill();
      });
    }

    function buildSprites() {
      if (sprites) return;
      /* weight: 💙 is the identity, everything else is mixed through it */
      var set = [
        ['💙', 7, 'b'], ['🩵', 2.4, 'b'], ['❤️', 2, 'p'], ['💜', 1.4, 'v'], ['🩷', 1.4, 'p'],
        ['💕', 1, 'p'], ['💞', 1, 'p'], ['💓', 0.9, 'p'], ['💗', 1, 'p'], ['💖', 1.1, 'p'],
        ['💘', 0.7, 'p'], ['💝', 0.6, 'p'], ['💟', 0.5, 'v'], ['😘', 0.45, 'p'], ['🥰', 0.45, 'p'],
        ['💋', 0.8, 'p'], ['✨', 1.3, 'w']
      ];
      sprites = { list: [], total: 0 };
      set.forEach(function (s) {
        var img = emoji(s[0]);
        if (!colourful(img)) return;           // older phones draw 🩵 / 🩷 as an empty box
        sprites.list.push({ img: img, w: s[1], tone: s[2] });
        sprites.total += s[1];
      });
      sprites.glow = { b: glow('90,160,255'), p: glow('255,110,170'), v: glow('180,130,255'), w: glow('255,240,250') };
      sprites.dot = { b: glow('200,228,255'), w: glow('255,246,252'), p: glow('255,200,230') };
      sprites.blue = vheart('rgba(110,172,255,.95)', 'rgba(70,140,255,1)');
      sprites.sky = vheart('rgba(178,218,255,.9)', 'rgba(120,185,255,.9)');
      sprites.rose = vheart('rgba(255,120,175,.92)', 'rgba(255,90,155,.9)');
      /* no colour emoji at all: drawn hearts carry the whole scene */
      if (!sprites.list.length) {
        sprites.list = [{ img: sprites.blue, w: 5, tone: 'b' }, { img: sprites.sky, w: 2, tone: 'b' },
                        { img: sprites.rose, w: 3, tone: 'p' }];
        sprites.total = 10;
      }
      sprites.blues = sprites.list.filter(function (s) { return s.tone === 'b'; });
    }

    function pick(blueBias) {
      if (blueBias && sprites.blues.length && Math.random() < blueBias) {
        return sprites.blues[Math.random() > 0.3 ? 0 : (Math.random() * sprites.blues.length) | 0];
      }
      var r = Math.random() * sprites.total;
      for (var i = 0; i < sprites.list.length; i++) {
        r -= sprites.list[i].w;
        if (r <= 0) return sprites.list[i];
      }
      return sprites.list[0];
    }

    /* ---------- particles ---------- */
    function cap() { return REDUCED ? 16 : (SMALL ? 120 : 180); }

    function push(p) {
      if (parts.length >= cap()) return;
      p.age = 0;
      p.ph = p.ph || rnd(0, 6.28);
      parts.push(p);
    }

    function spawn() {
      var r = Math.random();
      if (!REDUCED && r < 0.2) {                       // tiny glowing particles
        var tone = ['b', 'w', 'p'][(Math.random() * 3) | 0];
        push({ kind: 'dot', spr: sprites.dot[tone], x: rnd(0, W), y: rnd(H * 0.05, H), vx: 0, vy: -rnd(6, 26),
               sz: rnd(3, 9), rot: 0, vr: 0, al: rnd(0.5, 1), sway: rnd(4, 14), life: rnd(1.4, 3.2), twinkle: true });
        return;
      }
      if (!REDUCED && r < 0.3) {                       // drifts in from an edge
        var left = Math.random() > 0.5, sp = pick(0.3);
        push({ kind: 'side', spr: sp.img, tone: sp.tone, x: left ? -40 : W + 40, y: rnd(H * 0.2, H * 0.95),
               vx: (left ? 1 : -1) * rnd(26, 70), vy: -rnd(10, 34), sz: rnd(16, 34), rot: rnd(-0.3, 0.3),
               vr: rnd(-0.5, 0.5), al: rnd(0.5, 0.9), sway: rnd(4, 12), life: rnd(7, 11),
               halo: Math.random() > 0.7 });
        return;
      }
      if (!REDUCED && r < 0.37) {                      // soft drawn heart, glowing, slower
        push({ kind: 'rise', spr: Math.random() > 0.3 ? (Math.random() > 0.4 ? sprites.blue : sprites.sky) : sprites.rose,
               x: rnd(0, W), y: H + 60, vx: 0, vy: -rnd(28, 60), sz: rnd(26, 58), rot: rnd(-0.25, 0.25),
               vr: rnd(-0.2, 0.2), al: rnd(0.3, 0.6), sway: rnd(10, 30), life: 30 });
        return;
      }
      /* the main body — emoji hearts rising at different depths */
      var d = Math.pow(Math.random(), 1.5);             // more far-away ones than close ones
      var s = pick(0.12);
      var big = !REDUCED && Math.random() < 0.05;
      var p = {
        kind: 'rise', spr: s.img, tone: s.tone,
        x: rnd(-10, W + 10), y: H + 50, vx: 0,
        vy: -(REDUCED ? rnd(24, 40) : (38 + d * 120) * rnd(0.8, 1.2)),
        sz: big ? rnd(62, 88) : (13 + d * 40) * rnd(0.85, 1.15),
        rot: rnd(-0.35, 0.35),
        vr: REDUCED ? 0 : (Math.random() > 0.55 ? rnd(-0.9, 0.9) : 0),
        al: REDUCED ? 0.8 : 0.32 + d * 0.62,
        sway: rnd(8, 36) * (0.5 + d),
        life: 30,
        halo: !REDUCED && (big || Math.random() < 0.22)
      };
      /* some don't make it off the top — they softly burst mid-air */
      if (!REDUCED && Math.random() < 0.16) { p.pop = true; p.life = rnd(0.35, 0.8) * (H + 60) / -p.vy; }
      push(p);
    }

    function burst(x, y, n, blue) {
      if (REDUCED) return;
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.2832, v = rnd(70, 280), s = pick(blue ? 0.7 : 0.25);
        push({ kind: 'burst', spr: Math.random() > 0.8 ? sprites.dot.w : s.img, tone: s.tone, x: x, y: y,
               vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, sz: rnd(10, 30), rot: rnd(-0.5, 0.5),
               vr: rnd(-1.6, 1.6), al: rnd(0.7, 1), sway: 0, life: rnd(1.4, 2.6) });
      }
    }

    function bloom() {
      if (REDUCED) return;
      push({ kind: 'bloom', spr: Math.random() > 0.3 ? sprites.blue : sprites.rose, x: rnd(W * 0.15, W * 0.85),
             y: rnd(H * 0.2, H * 0.8), vx: 0, vy: -rnd(4, 12), sz: rnd(110, Math.min(220, W * 0.6)), rot: rnd(-0.2, 0.2),
             vr: 0, al: rnd(0.16, 0.26), sway: 6, life: rnd(3.2, 4.4) });
    }

    function frame(now) {
      if (!active || !ctx) return;          // a stray frame after the sequence ended
      raf = requestAnimationFrame(frame);
      var dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      var t = (now - t0) / 1000;

      var rate = curve(TL.rate, t) * (SMALL ? 1 : 1.5);
      var speed = curve(TL.speed, t);
      var fade = curve(TL.alpha, t);

      /* the screen is black again before the wish: start the last hearts fresh */
      if (!cleared && t > TL.dark) { cleared = true; parts.length = 0; }

      spawnAcc += rate * dt;
      while (spawnAcc >= 1) { spawnAcc -= 1; spawn(); }

      if (!REDUCED && t > TL.peakA - 3 && t < TL.peakB + 1 && t > nextBurst) {
        nextBurst = t + rnd(1.1, 2.3);
        burst(rnd(W * 0.15, W * 0.85), rnd(H * 0.2, H * 0.75), SMALL ? 14 : 20, Math.random() > 0.4);
      }
      if (!REDUCED && t > TL.words && t < TL.peakB + 2 && t > nextBloom) {
        nextBloom = t + rnd(2.2, 3.6);
        bloom();
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);

      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.age += dt;
        if (p.age >= p.life) {
          if (p.pop) burstSmall(p);
          parts.splice(i, 1);
          continue;
        }
        p.ph += dt * 1.1;
        if (p.kind === 'burst') {
          var drag = Math.exp(-2.2 * dt);
          p.vx *= drag; p.vy = p.vy * drag - 14 * dt;
        }
        p.x += (p.vx + Math.cos(p.ph) * p.sway) * dt * speed;
        p.y += p.vy * dt * speed;
        p.rot += p.vr * dt * speed;
        if (p.y < -p.sz * 1.5 || p.x < -140 || p.x > W + 140) { parts.splice(i, 1); continue; }

        /* envelope: ease in, then out — pops swell as they go */
        var k = p.age / p.life, a = p.al, sz = p.sz;
        if (p.kind === 'bloom') { a *= Math.sin(Math.PI * k); sz *= 0.8 + 0.3 * k; }
        else if (p.twinkle) a *= Math.sin(Math.PI * k) * (0.6 + 0.4 * Math.sin(p.ph * 5));
        else if (p.kind === 'burst') { a *= 1 - k * k; sz *= 1 - 0.4 * k; }
        else {
          a *= Math.min(1, p.age / 0.6);
          if (p.pop && k > 0.78) { var q = (k - 0.78) / 0.22; a *= 1 - q; sz *= 1 + 0.6 * q; }
          else if (k > 0.88) a *= (1 - k) / 0.12;
        }
        a *= fade;
        if (a <= 0.01) continue;

        if (p.halo && sprites.glow[p.tone]) {
          ctx.globalAlpha = a * 0.34;
          var gz = sz * 2.3;
          ctx.setTransform(DPR, 0, 0, DPR, DPR * p.x, DPR * p.y);
          ctx.drawImage(sprites.glow[p.tone], -gz / 2, -gz / 2, gz, gz);
        }
        ctx.globalAlpha = a;
        var c = Math.cos(p.rot) * DPR, s = Math.sin(p.rot) * DPR;
        ctx.setTransform(c, s, -s, c, DPR * p.x, DPR * p.y);
        ctx.drawImage(p.spr, -sz / 2, -sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
    }

    function burstSmall(p) {
      for (var i = 0; i < 5; i++) {
        var a = Math.random() * 6.2832, v = rnd(30, 90);
        push({ kind: 'burst', spr: i < 2 ? p.spr : sprites.dot.w, tone: p.tone, x: p.x, y: p.y,
               vx: Math.cos(a) * v, vy: Math.sin(a) * v, sz: i < 2 ? p.sz * 0.45 : rnd(3, 7),
               rot: 0, vr: rnd(-1, 1), al: p.al * 0.8, sway: 0, life: rnd(0.7, 1.2) });
      }
    }

    function resize() {
      if (!cv) return;
      DPR = Math.min(window.devicePixelRatio || 1, SMALL ? 1.6 : 1.5);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    }

    /* ---------- the words ---------- */
    var SLOTS = [14, 24, 34, 64, 74, 84];

    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = (Math.random() * (i + 1)) | 0, x = a[i]; a[i] = a[j]; a[j] = x;
      }
      return a;
    }

    function chooseLines(n) {
      var first = LINES[0], lastL = LINES[LINES.length - 1];
      var mid = shuffle(LINES.slice(1, -1)).slice(0, Math.max(0, n - 2));
      return LINES.length > 2 ? [first].concat(mid, [lastL]) : LINES.slice(0, n);
    }

    function scheduleWords() {
      var lines = chooseLines(TL.wordCount);
      var recent = [];
      lines.forEach(function (text, i) {
        later(function () {
          var slot;
          do { slot = (Math.random() * SLOTS.length) | 0; } while (recent.indexOf(slot) >= 0);
          recent.push(slot); if (recent.length > 2) recent.shift();

          var el = document.createElement('p');
          var big = i === 0 || i === lines.length - 1 || (text.length < 22 && Math.random() > 0.5);
          el.className = 'lsx__word' + (big ? ' lsx__word--big' : '') + (Math.random() > 0.5 ? ' lsx__word--blue' : '');
          el.textContent = text;
          el.style.top = SLOTS[slot] + '%';
          el.style.setProperty('--dx', rnd(-9, 9).toFixed(1) + 'vw');
          el.style.setProperty('--life', TL.wordLife + 's');
          wordsEl.appendChild(el);
          setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, TL.wordLife * 1000 + 200);
        }, (TL.words + i * TL.wordGap) * 1000);
      });
    }

    function wordsOf(el, text) {
      el.innerHTML = '';
      String(text).split(' ').forEach(function (w, i) {
        var s = document.createElement('span');
        s.className = 'lsx__w' + (/[❤\uD83C-\uDBFF]/.test(w) && w.replace(/[❤️\uD83C-􏰀-\uDFFF]/g, '') === '' ? ' lsx__w--emo' : '');
        s.style.setProperty('--i', i);
        s.textContent = w;
        el.appendChild(s);
        el.appendChild(document.createTextNode(' '));
      });
    }

    /* ---------- the card ---------- */
    function buildCard() {
      card = document.createElement('div');
      card.className = 'lsx-card';
      card.hidden = true;
      card.innerHTML =
        '<span class="lsx-card__cord" aria-hidden="true"></span>' +
        '<button class="lsx-card__btn" type="button">' +
          '<span class="lsx-card__glow" aria-hidden="true"></span>' +
          '<span class="lsx-card__flap" aria-hidden="true"></span>' +
          '<span class="lsx-card__seal" aria-hidden="true">💙</span>' +
          '<span class="lsx-card__title"></span>' +
          '<span class="lsx-card__hint"><i aria-hidden="true"></i><b></b></span>' +
        '</button>';
      $('.lsx-card__title', card).textContent = S.cardTitle || 'One Last Surprise ❤️';
      $('.lsx-card__hint b', card).textContent = S.cardHint || 'tap to open';
      $('.lsx-card__btn', card).setAttribute('aria-label', (S.cardTitle || 'One Last Surprise') + ' — tap to open');
      $('.lsx-card__btn', card).addEventListener('click', play);
      document.body.appendChild(card);
    }

    function showCard() {
      if (cardUp || active) return;
      cardUp = true; everShown = true;
      card.classList.remove('is-leaving', 'is-opening');
      card.hidden = false;
      void card.offsetWidth;
      card.classList.add('is-down');
      if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
    }

    function hideCard(instant) {
      clearTimeout(cardTimer); cardTimer = 0;
      if (!cardUp) return;
      cardUp = false;
      if (instant) { card.classList.remove('is-down', 'is-leaving', 'is-opening'); card.hidden = true; return; }
      card.classList.add('is-leaving');
      setTimeout(function () {
        if (cardUp) return;
        card.classList.remove('is-down', 'is-leaving', 'is-opening');
        card.hidden = true;
      }, 700);
    }

    function maybeArm() {
      if (active || cardUp || cardTimer) return;
      if (!finalSeen || !endSeen || !$('#story').classList.contains('is-live')) return;
      /* the first time, let the finale finish playing out before it drops in */
      cardTimer = setTimeout(function () { cardTimer = 0; showCard(); }, everShown ? 2200 : 7200);
    }

    function watch() {
      if (!('IntersectionObserver' in window)) return;
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          finalSeen = e.isIntersecting;
          if (!finalSeen) hideCard(false); else maybeArm();
        });
      }, { threshold: 0.01 }).observe($('#sec-final'));
      new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          endSeen = e.isIntersecting;
          if (endSeen) maybeArm();
        });
      }, { threshold: 0.5 }).observe($('#replay'));
    }

    /* ---------- the sequence ---------- */
    function play() {
      if (active) return;
      active = true;
      clearTimeout(cardTimer); cardTimer = 0;
      card.classList.add('is-opening');
      if (navigator.vibrate) { try { navigator.vibrate([10, 40, 16]); } catch (e) {} }

      buildSprites();
      ov = document.createElement('div');
      ov.className = 'lsx';
      ov.setAttribute('role', 'dialog');
      ov.setAttribute('aria-modal', 'true');
      ov.setAttribute('aria-label', S.cardTitle || 'One last surprise');
      ov.innerHTML =
        '<canvas class="lsx__cv" aria-hidden="true"></canvas>' +
        '<div class="lsx__heart" aria-hidden="true"><span>💙</span></div>' +
        '<div class="lsx__words" aria-live="polite"></div>' +
        '<div class="lsx__wish"><p class="lsx__wish1"></p><p class="lsx__wish2"></p></div>';
      document.body.appendChild(ov);
      cv = $('.lsx__cv', ov); ctx = cv.getContext('2d');
      heartEl = $('.lsx__heart', ov); wordsEl = $('.lsx__words', ov); wishEl = $('.lsx__wish', ov);
      wordsOf($('.lsx__wish1', ov), S.wish || 'One last wish… ❤️');
      wordsOf($('.lsx__wish2', ov), S.final || 'Happy Birthday ❤️');
      resize();
      window.addEventListener('resize', resize);

      void ov.offsetWidth;
      ov.classList.add('is-on');
      document.documentElement.classList.add('lsx-lock');

      /* once the screen is fully black, stop drawing what's under it */
      later(function () {
        hideCard(true);
        Atmos.hold(true);
        $('#story').style.visibility = 'hidden';
      }, 1000);

      later(function () { heartEl.classList.add('is-in'); }, TL.heart * 1000);
      later(function () {
        heartEl.classList.add('is-open');
        burst(W / 2, H / 2, SMALL ? 34 : 46, true);
      }, TL.open * 1000);
      later(function () { heartEl.classList.remove('is-in', 'is-open'); }, (TL.open + 2) * 1000);
      scheduleWords();
      later(function () { wishEl.classList.add('is-wish'); }, TL.wish * 1000);
      later(function () { wishEl.classList.add('is-final'); }, TL.final * 1000);
      later(function () { wishEl.classList.add('is-gone'); }, TL.out * 1000);
      later(finish, (TL.out + 1.6) * 1000);

      t0 = lastNow = performance.now();
      spawnAcc = 0; nextBurst = 0; nextBloom = 0; cleared = false; parts.length = 0;
      raf = requestAnimationFrame(frame);
    }

    /* back to the balloons, everything reset so it can happen again */
    function finish() {
      [$('#audio'), $('#voiceAudio')].forEach(function (a) {
        try { if (!a.paused) a.pause(); } catch (e) {}
      });
      Gate.reset();
      $('#story').style.visibility = '';
      Atmos.hold(false);
      document.documentElement.classList.remove('lsx-lock');

      ov.classList.add('is-leaving');
      setTimeout(teardown, 1500);
    }

    function teardown() {
      timers.forEach(clearTimeout); timers = [];
      cancelAnimationFrame(raf); raf = 0;
      window.removeEventListener('resize', resize);
      parts.length = 0;
      if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
      ov = cv = ctx = heartEl = wordsEl = wishEl = null;
      active = false;             // the observers keep finalSeen / endSeen honest
    }

    return {
      init: function () {
        buildCard();
        watch();
      }
    };
  })();

  /* =======================================================
     boot
     ======================================================= */
  function boot() {
    buildContent();
    Atmos.init();
    Gate.init();
    Letter.init();
    Audio.init();
    Voice.init();
    Reveal.init();
    LastSurprise.init();
    /* keep the story pinned at the top while the gate is up */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
