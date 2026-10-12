(function () {
  var root = document.documentElement;
  if (!root.classList.contains('intro')) { root.setAttribute('data-intro', 'done'); return; }
  var started = false;
  var page = document.querySelector('.page');
  var video = document.getElementById('bg');

  var fallback = setTimeout(function () {
    if (!started) { root.classList.remove('intro'); root.setAttribute('data-intro', 'done'); }
  }, 3500);

  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  var videoReady = new Promise(function (res) {
    if (!video || video.readyState >= 2) { res(); return; }
    video.addEventListener('loadeddata', function () { res(); }, { once: true });
  });
  var cap = new Promise(function (res) { setTimeout(res, 900); });

  Promise.race([Promise.all([fontsReady, videoReady]), cap]).then(run).catch(run);

  function run() {
    if (started) return;
    started = true;
    clearTimeout(fallback);

    var $ = function (s) { return document.querySelector(s); };
    var logo = $('.wordmark');
    var logoH = $('.wordmark svg').getBoundingClientRect().height;
    var k = Math.min(1, Math.max(.65, logoH / 23.5));

    var QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)';
    var EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
    var HAIR = 'cubic-bezier(0.7, 0, 0.2, 1)';
    var anims = [];

    function go(el, from, to, delay, duration, easing) {
      if (!el) return;
      anims.push(el.animate([from, to], { delay: delay, duration: duration, easing: easing, fill: 'both' }));
    }
    function rise(el, y, delay, duration, easing, scale) {
      var f = { opacity: 0, transform: 'translateY(' + (y * k) + 'px)' + (scale ? ' scale(' + scale + ')' : '') };
      go(el, f, { opacity: 1, transform: 'none' }, delay, duration, easing);
    }

    rise(logo, -6, 60, 900, QUINT);
    go($('.hair'), { transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }, 180, 1000, HAIR);

    var links = document.querySelectorAll('.nav a');
    if (links[1]) rise(links[1], -4, 420, 700, QUINT);
    if (links[0]) rise(links[0], -4, 490, 700, QUINT);
    if (links[2]) rise(links[2], -4, 490, 700, QUINT);

    var lines = document.querySelectorAll('.copy h1 .li');
    if (lines[0]) go(lines[0], { transform: 'translateY(104%)' }, { transform: 'none' }, 200, 1100, EXPO);
    if (lines[1]) go(lines[1], { transform: 'translateY(104%)' }, { transform: 'none' }, 290, 1100, EXPO);

    rise($('.sub'), 10, 700, 850, QUINT);
    rise($('.btn'), 12, 860, 900, EXPO, .975);
    rise($('.discover'), 6, 1040, 700, QUINT);
    go($('.discover .arrow'),
      { transform: 'translateY(' + (-5 * k) + 'px)' }, { transform: 'none' }, 1120, 820, EXPO);

    function finish() {
      root.classList.remove('intro');
      anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      if (!page.contains(document.activeElement)) {
        page.style.display = 'none';
        void page.offsetHeight;
        page.style.display = '';
      }
      root.setAttribute('data-intro', 'done');
    }
    Promise.all(anims.map(function (a) { return a.finished; })).then(finish).catch(finish);
  }
})();
