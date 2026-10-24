(function () {
  var views = ['home', 'praktijk', 'school', 'over-mij', 'contact'];
  var titles = {
    'home': 'Never Mind Your Mind | Mindfulness voor kinderen in Amsterdam',
    'praktijk': 'Mindfulness sessies voor kinderen | Never Mind Your Mind',
    'school': 'Mindfulness op school | Never Mind Your Mind',
    'over-mij': 'Over mij | Never Mind Your Mind',
    'contact': 'Contact | Never Mind Your Mind'
  };
  function show(ev) {
    var h = (location.hash || '').slice(1);
    if (views.indexOf(h) === -1) h = 'home';
    views.forEach(function (v) { document.getElementById('view-' + v).hidden = (v !== h); });
    document.querySelectorAll('nav a').forEach(function (a) {
      if (a.getAttribute('data-nav') === h) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var sec = document.getElementById('rev-section');
    if (h === 'home' || h === 'praktijk' || h === 'school') {
      var cta = document.getElementById('view-' + h).querySelector('.cta-band');
      cta.parentNode.parentNode.insertBefore(sec, cta.parentNode);
      sec.hidden = false;
    } else { sec.hidden = true; }
    document.title = titles[h];
    window.scrollTo(0, 0);
    if (typeof fit === 'function') fit();
    // On in-page navigation, move focus to the new heading so screen readers announce the new view.
    if (ev) {
      var head = document.querySelector('#view-' + h + ' h1');
      head.setAttribute('tabindex', '-1');
      head.focus({ preventScroll: true });
    }
  }
  window.addEventListener('hashchange', show);
  show();
  var rev = document.querySelector('.reviews');
  var slides = Array.prototype.slice.call(rev.querySelectorAll('blockquote'));
  var cur = 0, timer = null, paused = false;
  rev.setAttribute('role', 'region');
  rev.setAttribute('aria-label', 'Reviews');
  var ui = document.createElement('div'); ui.className = 'slider-ui';
  var prev = document.createElement('button'); prev.type = 'button'; prev.className = 'nav-btn'; prev.setAttribute('aria-label', 'Vorige review'); prev.textContent = '‹';
  var next = document.createElement('button'); next.type = 'button'; next.className = 'nav-btn'; next.setAttribute('aria-label', 'Volgende review'); next.textContent = '›';
  var dotWrap = document.createElement('div'); dotWrap.className = 'dots';
  var dotEls = slides.map(function (s, i) {
    var d = document.createElement('button'); d.type = 'button'; d.className = 'dot'; d.setAttribute('aria-label', 'Review ' + (i + 1));
    d.addEventListener('click', function () { go(i, true); });
    dotWrap.appendChild(d); return d;
  });
  ui.appendChild(prev); ui.appendChild(dotWrap); ui.appendChild(next); rev.appendChild(ui);
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function perView() { return window.matchMedia && window.matchMedia('(min-width: 761px)').matches ? 2 : 1; }
  function go(i, byUser) {
    cur = (i + slides.length) % slides.length;
    var n = perView();
    slides.forEach(function (s, j) {
      var on = false;
      for (var k = 0; k < n; k++) { if (j === (cur + k) % slides.length) on = true; }
      s.classList.toggle('is-active', on); s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dotEls.forEach(function (d, j) { d.setAttribute('aria-current', j === cur ? 'true' : 'false'); });
    if (byUser) stop();
  }
  prev.addEventListener('click', function () { go(cur - 1, true); });
  next.addEventListener('click', function () { go(cur + 1, true); });
  rev.addEventListener('mouseenter', function () { paused = true; });
  rev.addEventListener('mouseleave', function () { paused = false; });
  rev.addEventListener('focusin', function () { paused = true; });
  rev.addEventListener('focusout', function () { paused = false; });
  go(0, false);
  function fit() {
    if (!slides || !slides.length) return;
    if (document.getElementById('rev-section').hidden) return;
    var keep = cur, max = 0;
    rev.style.minHeight = '';
    for (var i = 0; i < slides.length; i++) { go(i, false); max = Math.max(max, rev.offsetHeight); }
    rev.style.minHeight = max + 'px';
    go(keep, false);
  }
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    timer = setInterval(function () { if (!paused && !document.getElementById('rev-section').hidden) go(cur + 1, false); }, 8000);
  }
  var form = document.getElementById('cform');
  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = form.elements, note = document.getElementById('fnote'), ok = true;
    ['naam', 'email', 'bericht'].forEach(function (n) {
      var el = f[n], bad = !el.value.trim() || (n === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
      el.classList.toggle('invalid', bad); if (bad) ok = false;
      if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    });
    if (!ok) { note.textContent = 'Vul je naam, een geldig e-mailadres en je bericht in.'; return; }
    var body = 'Naam: ' + f.naam.value.trim() + '\nE-mail: ' + f.email.value.trim() + (f.tel.value.trim() ? '\nTelefoon: ' + f.tel.value.trim() : '') + '\n\n' + f.bericht.value.trim();
    location.href = 'mailto:sophie@nevermindyourmind.nl?subject=' + encodeURIComponent(f.onderwerp.value) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Je e-mailprogramma opent met je bericht. Verstuur het daar nog even.';
  });
  var btn = document.getElementById('copy-mail');
  btn.addEventListener('click', function () {
    var el = document.getElementById('mail');
    function select() { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Geselecteerd'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(el.textContent).then(function () { btn.textContent = 'Gekopieerd'; }, select);
    } else { select(); }
  });
})();
