/* tool-bridge.js —— 工具页引入这一段即可跟随主站主题、上报高度。
 * iframe 处于 sandbox 的 opaque origin，读不到主站 CSS，
 * 所以主题色由主站通过 blog:theme 消息把实际色值一起下发。
 */
(function () {
  'use strict';
  var TOKENS = ['--bg', '--bg-solid', '--ink', '--muted', '--violet', '--mint', '--line', '--radius'];
  var root = document.documentElement;

  function apply(d) {
    root.setAttribute('data-theme', d.theme || 'light');
    var t = d.tokens || {};
    TOKENS.forEach(function (k) { if (t[k]) root.style.setProperty(k, t[k]); });
    var el = document.getElementById('theme-state');
    if (el) el.textContent = d.theme;
  }
  // 只量内容高度。documentElement.scrollHeight 至少等于 iframe 视口高，
  // 父页面再加补偿就会形成「越长越高」的正反馈。
  function contentHeight() {
    return Math.ceil(document.body.getBoundingClientRect().height);
  }
  var lastHeight = -1;
  function report(type, force) {
    var h = contentHeight();
    // resize 事件高度没变就不上报；theme 回执必须发，不能去重
    if (!force && h === lastHeight) return;
    lastHeight = h;
    parent.postMessage({
      type: type || 'tool:ready',
      id: root.dataset.toolId || 'tool',
      theme: root.getAttribute('data-theme'),
      height: h
    }, '*');
  }
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'blog:theme') { apply(d); report('tool:ready', true); }
  });
  window.addEventListener('load', function () { setTimeout(function () { report('tool:ready', true); }, 40); });
  window.addEventListener('resize', function () { report('tool:resize'); });
  // 工具内容变化后可主动调用 window.__reportToolHeight()
  window.__reportToolHeight = function () { report('tool:resize', true); };
})();
