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
  // Messages go via FormSubmit (formsubmit.co) to this mailbox. The very first message sends
  // an activation e-mail there; messages arrive once the form has been activated in that e-mail.
  var MAILBOX = 'sophie@nevermindyourmind.nl';
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + MAILBOX;
  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = form.elements, note = document.getElementById('fnote'), ok = true;
    ['naam', 'email', 'bericht'].forEach(function (n) {
      var el = f[n], bad = !el.value.trim() || (n === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
      el.classList.toggle('invalid', bad); if (bad) ok = false;
      if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    });
    if (!ok) { note.textContent = 'Vul je naam, een geldig e-mailadres en je bericht in.'; return; }
    var send = form.querySelector('button[type="submit"]');
    var data = {
      _subject: 'Nieuw bericht via de website: ' + f.onderwerp.value,
      _template: 'table',
      _honey: f._honey.value,
      naam: f.naam.value.trim(),
      email: f.email.value.trim(),
      telefoon: f.tel.value.trim(),
      onderwerp: f.onderwerp.value,
      bericht: f.bericht.value.trim()
    };
    if (!data.telefoon) delete data.telefoon;
    function done() {
      form.reset();
      note.textContent = 'Dank je wel! Je bericht is verstuurd. Ik neem zo snel mogelijk contact met je op.';
    }
    function fail() {
      // Fall back to the visitor's own e-mail program, with the message already filled in.
      var body = 'Naam: ' + data.naam + '\nE-mail: ' + data.email + (data.telefoon ? '\nTelefoon: ' + data.telefoon : '') + '\n\n' + data.bericht;
      var a = document.createElement('a');
      a.href = 'mailto:' + MAILBOX + '?subject=' + encodeURIComponent(data.onderwerp) + '&body=' + encodeURIComponent(body);
      a.textContent = 'stuur je bericht per e-mail';
      note.textContent = 'Versturen is niet gelukt. Probeer het later opnieuw, of ';
      note.appendChild(a);
      note.appendChild(document.createTextNode('.'));
    }
    if (data._honey) { done(); return; } // filled in by a spam bot
    send.disabled = true;
    note.textContent = 'Bezig met versturen…';
    var ctrl = window.AbortController ? new AbortController() : null;
    var timeout = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().then(function (res) { if (!r.ok || String(res.success) !== 'true') throw new Error(res.message); });
    }).then(done, fail).then(function () { clearTimeout(timeout); send.disabled = false; });
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
