/* BlogVuePress · 流光·曦 —— 全站客户端逻辑（零依赖） */
(function () {
  'use strict';
  var root = document.documentElement;
  var base = root.dataset.base || '/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'wb-blog-theme';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var logBox = $('#log');

  function log(msg, ok) {
    if (!logBox) return;
    var d = document.createElement('div');
    d.className = 'log-line';
    d.innerHTML = '<em>' + new Date().toLocaleTimeString('zh-CN', { hour12: false }) + '</em> ' +
      (ok ? '<b>✓</b> ' : '') + msg;
    logBox.appendChild(d);
    var lines = $$('.log-line', logBox);
    while (lines.length > 8) logBox.removeChild(lines.shift());
    logBox.scrollTop = logBox.scrollHeight;
  }

  /* ============ 主题 ============ */
  var btn = $('#themeBtn'), ico = $('#themeIco'), lab = $('#themeLabel');
  function frames() { return $$('iframe[data-tool-frame]'); }
  var TOKENS = ['--bg', '--bg-solid', '--ink', '--muted', '--violet', '--mint', '--line', '--radius'];
  function readTokens() {
    var cs = getComputedStyle(root), out = {};
    TOKENS.forEach(function (k) { out[k] = cs.getPropertyValue(k).trim(); });
    return out;
  }
  function broadcast(theme, quiet) {
    // 工具页在 sandbox 里是 opaque origin，读不到主站 CSS，必须把实际色值一起下发
    var payload = { type: 'blog:theme', theme: theme, tokens: readTokens() };
    frames().forEach(function (f) {
      try { f.contentWindow.postMessage(payload, '*'); } catch (e) { /* iframe 尚未就绪 */ }
    });
    if (!quiet) log('→ blog:theme <b>' + theme + '</b> → ' + frames().length + ' 个工具', true);
  }
  function paint(theme, fromUser, ev) {
    root.setAttribute('data-theme', theme);
    if (ico) ico.textContent = theme === 'dark' ? '☾' : '☀';
    if (lab) lab.textContent = theme === 'dark' ? '深色' : '浅色';
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B0B14' : '#F5F6FC');
    broadcast(theme);
    if (fromUser && !reduce) {
      var w = document.createElement('div');
      w.className = 'wipe';
      var x = ev && ev.clientX ? ev.clientX : window.innerWidth - 90;
      var y = ev && ev.clientY ? ev.clientY : 40;
      w.style.setProperty('--wx', (x / window.innerWidth * 100).toFixed(1) + '%');
      w.style.setProperty('--wy', y.toFixed(0) + 'px');
      w.style.setProperty('--wipe-color', theme === 'dark' ? 'rgba(11,11,20,.42)' : 'rgba(255,255,255,.52)');
      document.body.appendChild(w);
      setTimeout(function () { if (w.parentNode) w.parentNode.removeChild(w); }, 680);
    }
  }
  function store(t) { try { localStorage.setItem(KEY, t); } catch (e) {} }
  function setTheme(t, fromUser, ev) {
    paint(t, fromUser, ev);
    if (fromUser) store(t);
  }
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  if (btn) btn.addEventListener('click', function (e) {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true, e);
  });
  // 未手动选择过时跟随系统
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onSystem = function (e) {
    var saved = null; try { saved = localStorage.getItem(KEY); } catch (err) {}
    if (!saved) setTheme(e.matches ? 'dark' : 'light', false);
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystem);

  /* ============ 工具运行时（真实双向通信） ============ */
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'tool:ready') {
      log('← tool:ready <b>' + (d.id || '?') + '</b>' + (d.theme ? ' · 同步 ' + d.theme : ''), true);
    } else if (d.type === 'tool:resize') {
      log('← tool:resize <b>' + d.height + 'px</b>', true);
    }
    if (d.height) {
      // 高度只在变化超过阈值时写回，避免 iframe 高度变化又触发子页 resize 的死循环
      var h = Math.min(1400, Math.max(150, Number(d.height) + 2));
      frames().forEach(function (f) {
        if (f.contentWindow === e.source && Math.abs(f.clientHeight - h) > 6) f.style.height = h + 'px';
      });
    }
  });
  // iframe 解析完成前发出的广播会丢，load 后补发
  frames().forEach(function (f) {
    f.addEventListener('load', function () {
      setTimeout(function () {
        try {
          f.contentWindow.postMessage({
            type: 'blog:theme', theme: root.getAttribute('data-theme'), tokens: readTokens()
          }, '*');
        } catch (err) {}
      }, 60);
    });
  });

  /* ============ 全文搜索 ============ */
  var modal = $('#searchModal'), input = $('#searchInput'), results = $('#searchResults');
  var index = null, indexLoading = null;
  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (indexLoading) return indexLoading;
    indexLoading = fetch(base + 'search-index.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) { index = j; return j; })
      .catch(function (e) { if (results) results.innerHTML = '<div class="search-empty">索引载入失败：' + e.message + '</div>'; return null; });
    return indexLoading;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function snippet(text, q) {
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) return text.slice(0, 90);
    return (i > 30 ? '…' : '') + text.slice(Math.max(0, i - 30), i + 70) + '…';
  }
  function doSearch(q) {
    if (!results) return;
    q = q.trim().toLowerCase();
    if (!q) { results.innerHTML = '<div class="search-empty">输入关键词开始搜索（标题 + 正文全文）</div>'; return; }
    if (!index) { results.innerHTML = '<div class="search-empty">正在载入索引…</div>'; return; }
    var hits = [];
    index.forEach(function (p) {
      var ti = p.title.toLowerCase().indexOf(q), bi = p.text.toLowerCase().indexOf(q);
      if (ti < 0 && bi < 0) return;
      hits.push({ p: p, score: (ti >= 0 ? 100 - Math.min(ti, 90) : 0) + (bi >= 0 ? 20 : 0) });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    if (!hits.length) { results.innerHTML = '<div class="search-empty">没有匹配「' + esc(q) + '」的内容</div>'; return; }
    results.innerHTML = hits.slice(0, 14).map(function (h) {
      var p = h.p;
      return '<a href="' + esc(p.url) + '"><b>' + esc(p.title) + '</b>' +
        '<span>' + esc(p.section) + ' · ' + esc(snippet(p.text, q)) + '</span></a>';
    }).join('');
  }
  function openSearch() {
    if (!modal) return;
    modal.classList.add('open');
    setTimeout(function () { if (input) input.focus(); }, 30);
    loadIndex();
  }
  function closeSearch() { if (modal) modal.classList.remove('open'); }
  if ($('#searchTrigger')) $('#searchTrigger').addEventListener('click', openSearch);
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeSearch(); });
  if (input) input.addEventListener('input', function () { loadIndex().then(function () { doSearch(input.value); }); });
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing && modal && !modal.classList.contains('open')) { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') { closeSearch(); var lb = $('#lightbox'); if (lb) lb.classList.remove('open'); }
    if (e.key === 'Enter' && modal && modal.classList.contains('open')) {
      var first = $('a', results); if (first) location.href = first.href;
    }
  });

  /* ============ 代码增强：行号(CSS)、复制、超长折叠 ============ */
  $$('main .prose pre').forEach(function (pre) {
    var tools = document.createElement('div');
    tools.className = 'code-tools';
    var copy = document.createElement('button');
    copy.type = 'button'; copy.textContent = '复制';
    copy.addEventListener('click', function () {
      var text = pre.textContent || '';
      var done = function () { copy.textContent = '已复制'; setTimeout(function () { copy.textContent = '复制'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else fallback(text, done);
    });
    function fallback(text, done) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { copy.textContent = '复制失败'; }
      document.body.removeChild(ta);
    }
    tools.appendChild(copy);
    pre.appendChild(tools);
    if (pre.scrollHeight > 360) {
      pre.classList.add('is-collapsed');
      var fold = document.createElement('button');
      fold.type = 'button'; fold.className = 'code-fold'; fold.textContent = '展开全部代码 ▾';
      fold.addEventListener('click', function () {
        var on = pre.classList.toggle('is-collapsed');
        fold.textContent = on ? '展开全部代码 ▾' : '收起代码 ▴';
      });
      pre.appendChild(fold);
    }
  });

  /* ============ 图片灯箱 ============ */
  var lb = $('#lightbox');
  if (lb) {
    $$('main .prose img').forEach(function (img) { img.style.cursor = 'zoom-in'; });
    document.addEventListener('click', function (e) {
      if (e.target.tagName === 'IMG' && e.target.closest('.prose')) {
        $('img', lb).src = e.target.src; lb.classList.add('open');
      }
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
  }

  /* ============ TOC 高亮 ============ */
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
      map[id] = a;
    });
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove('active'); });
        if (map[en.target.id]) map[en.target.id].classList.add('active');
      });
    }, { rootMargin: '-90px 0px -70% 0px' });
    $$('main .prose h2, main .prose h3').forEach(function (h) { if (h.id) ob.observe(h); });
  }

  /* ============ 入场 / 倾斜 / 光晕 / 进度 ============ */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !reduce) {
      root.classList.add('motion-ok');
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
      }, { threshold: .08 });
      reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 6) * 70 + 'ms'; ro.observe(el); });
    } else reveals.forEach(function (el) { el.classList.add('in'); });
  }
  function bindBoth(el, fn) {
    ['pointermove', 'mousemove'].forEach(function (t) { el.addEventListener(t, fn, { passive: true }); });
  }
  if (!reduce) {
    bindBoth(document.body, function (e) {
      root.style.setProperty('--mx', (e.clientX / window.innerWidth * 100).toFixed(2) + '%');
      root.style.setProperty('--my', (e.clientY / window.innerHeight * 100).toFixed(2) + '%');
    });
    $$('.gcard').forEach(function (card) {
      var reset = function () { card.style.transform = ''; };
      bindBoth(card, function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--sx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--sy', (py * 100).toFixed(1) + '%');
        card.style.transform = 'perspective(700px) rotateX(' + ((0.5 - py) * 7.5).toFixed(2) +
          'deg) rotateY(' + ((px - 0.5) * 9.5).toFixed(2) + 'deg) translateY(-5px)';
      });
      card.addEventListener('pointerleave', reset);
      card.addEventListener('mouseleave', reset);
    });
  }
  var prog = $('#progBar');
  function progress() {
    if (!prog) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? window.scrollY / h * 100 : 0).toFixed(1) + '%';
  }
  window.addEventListener('scroll', progress, { passive: true });
  progress();

  /* ============ 移动端抽屉 ============ */
  var db = $('#drawerBtn'), drawer = $('#drawer');
  if (db && drawer) db.addEventListener('click', function () { drawer.classList.toggle('open'); });

  /* ============ PWA（仅生产构建注册） ============ */
  if (root.dataset.prod === '1' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(function () {});
    });
  }
})();
