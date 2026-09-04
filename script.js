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

    function start() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); } }
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

    return { init: function () { build(); } };
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
    return '<div class="ph"><b>❤</b>your photo<code>assets/photo' + i + '.jpg</code></div>';
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

    /* memories */
    var m = C.memories || {};
    $('#memTitle').textContent = m.title || '';
    $('#memSub').textContent = m.subtitle || '';
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
        (ph.caption ? '<p class="frame__cap">' + esc(ph.caption) + '</p>' : '');
      var shot = $('.frame__shot', f);
      var img = $('img', f);
      img.addEventListener('error', function () {
        shot.classList.add('is-empty');
        shot.insertAdjacentHTML('beforeend', placeholderHTML(i + 1));
      });
      gal.appendChild(f);
    });

    /* unspoken */
    var u = C.unspoken || {};
    $('#unTitle').textContent = u.title || '';
    var ul = $('#unLines');
    (u.lines || []).forEach(function (line, i) {
      var p = document.createElement('p');
      p.style.setProperty('--d', i);
      p.textContent = line;
      ul.appendChild(p);
    });
    $('#unBridge').textContent = u.bridge || '';

    /* poem */
    var po = C.poem || {};
    $('#poemIntro').textContent = po.intro || '';
    $('#poemTitle').textContent = po.titleTamil || '';
    var pb = $('#poemBody');
    (po.lines || []).forEach(function (line, i) {
      var p = document.createElement('p');
      p.style.setProperty('--d', i);
      if (!String(line).trim()) { p.className = 'is-gap'; p.innerHTML = '&nbsp;'; }
      else p.textContent = line;
      pb.appendChild(p);
    });
    $('#poemSig').textContent = po.signature || '';

    /* song */
    var s = C.song || {};
    $('#songHead').innerHTML = heartify(s.heading || '');
    $('#songNote').textContent = s.note || '';
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

    /* finale */
    var F = C.finale || {};
    var fl = $('#finalLines');
    (F.lines || []).forEach(function (line, i) {
      var p = document.createElement('p');
      p.style.setProperty('--d', i);
      p.textContent = line;
      fl.appendChild(p);
    });
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
        setTimeout(type, 700);
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
        a.addEventListener('play',  function () { player.classList.add('is-playing'); err.hidden = true; });
        a.addEventListener('pause', function () { player.classList.remove('is-playing'); });
        a.addEventListener('ended', function () {
          player.classList.remove('is-playing');
          a.currentTime = 0; paint();
        });
        a.addEventListener('error', function () {
          if (!armed) return;                     // no source set yet — nothing to report
          fail('The song file isn\'t here yet.<br>Drop it in as <code>' + esc(srcPath) + '</code>');
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
     boot
     ======================================================= */
  function boot() {
    buildContent();
    Atmos.init();
    Gate.init();
    Letter.init();
    Audio.init();
    Reveal.init();
    /* keep the story pinned at the top while the gate is up */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
