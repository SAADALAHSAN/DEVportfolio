
(function(){
var LEVELS = [
  {
    amt: "24h",
    name: "STANDARD INQUIRY",
    badge: "NORMAL QUEUE",
    p2: "Full project assessment & scope review",
    p3: "Async discussion via Email / Telegram",
    btn: "Send Standard Inquiry"
  },
  {
    amt: "6h",
    name: "FAST-TRACK BUILD",
    badge: "PRIORITY QUEUE",
    p2: "Same-day scope review & architecture design",
    p3: "Direct Telegram priority queue",
    btn: "Send Fast-Track"
  },
  {
    amt: "1h",
    name: "URGENT LAUNCH / VIP",
    badge: "INSTANT NOTIFICATION",
    p2: "Immediate direct ping & phone alert",
    p3: "Live architectural & launch sync",
    btn: "Send Urgent Alert"
  }
];

var root = document.getElementById('lp-root');
if (!root) return;
var $ = function(s) { return root.querySelector(s); };

var track = $('.track'),
    fill = $('.fill'),
    handle = $('.handle'),
    amt = $('.amt'),
    pnm = $('.pnm'),
    ea = $('.ea'),
    eb = $('.eb'),
    ec = $('.ec'),
    cta = $('#collaborateCta'),
    badge = $('#priorityBadge'),
    p2 = $('#perk2'),
    p3 = $('#perk3');

var levelIdx = 0;

function applyLevel(idx) {
  levelIdx = Math.max(0, Math.min(2, idx));
  var lvl = LEVELS[levelIdx];

  if (amt) {
    amt.style.opacity = 0;
    setTimeout(function(){
      amt.textContent = lvl.amt;
      amt.style.opacity = 1;
    }, 120);
  }

  if (pnm) pnm.textContent = lvl.name;
  if (badge) badge.innerHTML = '<span class="ld"></span>' + lvl.badge;
  if (p2) p2.textContent = lvl.p2;
  if (p3) p3.textContent = lvl.p3;

  var pct = levelIdx === 0 ? '20%' : (levelIdx === 1 ? '58%' : '100%');
  if (fill) fill.style.width = pct;

  if (track && handle) {
    var tw = track.clientWidth - handle.offsetWidth - 10;
    var posX = levelIdx === 0 ? 0 : (levelIdx === 1 ? tw * 0.5 : tw);
    handle.style.transform = 'translateX(' + posX + 'px)';
  }

  if (ea) ea.classList.toggle('on', levelIdx === 0);
  if (eb) eb.classList.toggle('on', levelIdx === 1);
  if (ec) ec.classList.toggle('on', levelIdx === 2);

  if (cta) {
    cta.innerHTML = lvl.btn + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }
}

applyLevel(0);

if (ea) ea.addEventListener('click', function(){ applyLevel(0); });
if (eb) eb.addEventListener('click', function(){ applyLevel(1); });
if (ec) ec.addEventListener('click', function(){ applyLevel(2); });

if (track) {
  track.addEventListener('click', function(e){
    var r = track.getBoundingClientRect();
    var ratio = (e.clientX - r.left) / r.width;
    if (ratio < 0.35) applyLevel(0);
    else if (ratio < 0.7) applyLevel(1);
    else applyLevel(2);
  });
}

var drag = false;
if (handle) {
  handle.addEventListener('pointerdown', function(e){
    drag = true;
    handle.style.transition = 'none';
    if (fill) fill.style.transition = 'none';
    handle.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });
  handle.addEventListener('pointermove', function(e){
    if (!drag) return;
    var r = track.getBoundingClientRect();
    var tw = track.clientWidth - handle.offsetWidth - 10;
    var x = Math.max(0, Math.min(tw, e.clientX - r.left - handle.offsetWidth / 2));
    handle.style.transform = 'translateX(' + x + 'px)';
    var ratio = x / tw;
    if (fill) fill.style.width = (20 + ratio * 80) + '%';
    var nextIdx = ratio < 0.35 ? 0 : (ratio < 0.7 ? 1 : 2);
    if (nextIdx !== levelIdx) {
      levelIdx = nextIdx;
      var lvl = LEVELS[levelIdx];
      if (pnm) pnm.textContent = lvl.name;
      if (badge) badge.innerHTML = '<span class="ld"></span>' + lvl.badge;
      if (p2) p2.textContent = lvl.p2;
      if (p3) p3.textContent = lvl.p3;
      if (cta) cta.innerHTML = lvl.btn + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    }
  });
  handle.addEventListener('pointerup', function(e){
    if (!drag) return;
    drag = false;
    handle.style.transition = '';
    if (fill) fill.style.transition = '';
    var r = track.getBoundingClientRect();
    var ratio = (e.clientX - r.left) / r.width;
    applyLevel(ratio < 0.35 ? 0 : (ratio < 0.7 ? 1 : 2));
  });
}

window.addEventListener('resize', function(){ applyLevel(levelIdx); });

})();
