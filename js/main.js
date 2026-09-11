/* رویین‌تن – calculators, splash & music */

// ---------- Profile weight calculator ----------
function calcProfileWeight() {
  const t = parseFloat(document.getElementById('w-thk')?.value) || 0;
  const L = parseFloat(document.getElementById('w-len')?.value) || 0;
  const W = parseFloat(document.getElementById('w-wid')?.value) || 0;
  const qty = parseFloat(document.getElementById('w-qty')?.value) || 1;
  let unit = 0;
  if (t > 0 && L > 0 && W > 0) {
    if (L > 2 * t && W > 2 * t) {
      const outer = L * W;
      const inner = (L - 2 * t) * (W - 2 * t);
      unit = ((outer - inner) / 100) * 0.785;
    } else {
      unit = (L * W / 100) * 0.785;
    }
  }
  const total = unit * qty;
  const uEl = document.getElementById('w-unit-val');
  const tEl = document.getElementById('w-total-val');
  if (uEl) uEl.textContent = unit ? unit.toFixed(2) : '—';
  if (tEl) tEl.textContent = total ? total.toFixed(2) : '—';
}

const shippingRates = {
  'اراک': [9000000, 14000000, 18000000],
  'اردبیل': [16000000, 22000000, 28000000],
  'اصفهان': [10000000, 15000000, 20000000],
  'اهواز': [16000000, 23000000, 30000000],
  'ایلام': [14000000, 20000000, 26000000],
  'بوشهر': [18000000, 25000000, 32000000],
  'تبریز': [15000000, 22000000, 28000000],
  'تهران': [3000000, 4500000, 6000000],
  'خرم‌آباد': [12000000, 18000000, 24000000],
  'رشت': [12000000, 17500000, 25000000],
  'زاهدان': [30000000, 38000000, 50000000],
  'زنجان': [11000000, 19000000, 24000000],
  'سمنان': [11000000, 14500000, 17000000],
  'سنندج': [11000000, 16000000, 20000000],
  'شهرکرد': [9000000, 16000000, 20000000],
  'شیراز': [14000000, 20000000, 28000000],
  'قزوین': [10000000, 12000000, 16000000],
  'قم': [10000000, 12000000, 13000000],
  'کرج': [5000000, 7000000, 8000000],
  'کرمان': [22000000, 28000000, 32000000],
  'کرمانشاه': [13000000, 18000000, 27000000],
  'گرگان': [19000000, 26000000, 33000000],
  'مشهد': [22000000, 28000000, 33000000],
  'همدان': [10000000, 15500000, 19000000],
  'یزد': [14000000, 20000000, 25000000]
};

function formatToman(n) {
  return n.toLocaleString('fa-IR');
}

function calcShipping() {
  const city = document.getElementById('ship-dest')?.value;
  const box = document.getElementById('ship-result');
  if (!city || !shippingRates[city]) {
    if (box) box.classList.remove('show');
    return;
  }
  const [a, b, c] = shippingRates[city];
  document.getElementById('ship-single-val').textContent = formatToman(a);
  document.getElementById('ship-double-val').textContent = formatToman(b);
  document.getElementById('ship-trailer-val').textContent = formatToman(c);
  document.getElementById('ship-city-name').textContent = city;
  box.classList.add('show');
}

function showTab(id, btn, title) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(id);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');

  const titleEl = document.getElementById('calc-title');
  if (titleEl && title) titleEl.textContent = title;

  const calcFields = document.getElementById('profile-calc-fields');
  const calcNote = document.getElementById('calc-note');
  if (calcFields) {
    if (id === 'tab-profile') {
      calcFields.style.display = '';
      if (calcNote) calcNote.style.display = '';
    } else {
      calcFields.style.display = 'none';
      if (calcNote) calcNote.style.display = 'none';
    }
  }
}

function populateCities() {
  const sel = document.getElementById('ship-dest');
  if (!sel) return;
  const cities = Object.keys(shippingRates).sort((a, b) => a.localeCompare(b, 'fa'));
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

// ---------- Base path (root vs subfolder) ----------
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/products') || path.includes('/weight') ||
      path.includes('/shipping') || path.includes('/about') ||
      path.includes('/contact')) {
    return '../';
  }
  return '';
}

// ---------- Site music (continuous across pages, loop until user stops) ----------
function initMusic() {
  let audio = document.getElementById('siteMusic');
  const base = getBasePath();

  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'siteMusic';
    audio.loop = true;
    audio.preload = 'auto';
    audio.src = base + 'web.mp3';
    document.body.appendChild(audio);
  } else {
    audio.loop = true;
    audio.preload = 'auto';
    const needSrc = !audio.getAttribute('src') || audio.getAttribute('src') === 'web.mp3';
    if (needSrc && base) {
      audio.src = base + 'web.mp3';
    } else if (!audio.getAttribute('src')) {
      audio.src = 'web.mp3';
    }
  }

  let btn = document.getElementById('musicToggle');
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'musicToggle';
    btn.className = 'music-toggle';
    btn.title = 'قطع / پخش موزیک';
    btn.setAttribute('aria-label', 'قطع موزیک');
    btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    document.body.appendChild(btn);
  }

  let started = sessionStorage.getItem('royintan-music-started') === '1';
  let muted = sessionStorage.getItem('royintan-music-muted') === '1';

  function saveMusicState() {
    try {
      sessionStorage.setItem('royintan-music-started', started ? '1' : '0');
      sessionStorage.setItem('royintan-music-muted', muted ? '1' : '0');
      if (!audio.paused && !isNaN(audio.currentTime)) {
        sessionStorage.setItem('royintan-music-time', String(audio.currentTime));
      }
    } catch (e) {}
  }

  function restoreTime() {
    const saved = parseFloat(sessionStorage.getItem('royintan-music-time') || '0');
    if (saved > 0.3 && !isNaN(saved)) {
      try {
        audio.currentTime = saved;
      } catch (e) {}
    }
  }

  function updateBtn() {
    const isMuted = muted || audio.paused;
    btn.classList.toggle('muted', isMuted);
    btn.classList.add('visible');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
  }

  function tryPlay() {
    if (muted) return;
    restoreTime();
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        started = true;
        sessionStorage.setItem('royintan-music-started', '1');
        updateBtn();
        saveMusicState();
      }).catch(() => {});
    }
  }

  // Persist position often so page changes keep the same point
  setInterval(saveMusicState, 500);
  window.addEventListener('beforeunload', saveMusicState);
  window.addEventListener('pagehide', saveMusicState);
  audio.addEventListener('timeupdate', () => {
    if (!audio.paused) saveMusicState();
  });
  audio.addEventListener('play', () => {
    started = true;
    muted = false;
    sessionStorage.setItem('royintan-music-started', '1');
    sessionStorage.setItem('royintan-music-muted', '0');
    updateBtn();
  });
  audio.addEventListener('pause', saveMusicState);

  // First user gesture starts music; later pages resume from saved time
  if (!started) {
    const onFirst = () => {
      if (sessionStorage.getItem('royintan-music-started') === '1') {
        if (!muted) tryPlay();
        return;
      }
      tryPlay();
    };
    document.addEventListener('click', onFirst, { once: true });
    document.addEventListener('touchstart', onFirst, { once: true });
  } else if (!muted) {
    tryPlay();
  }

  // Any further click can resume if browser blocked autoplay after navigation
  document.body.addEventListener('click', () => {
    if (started && !muted && audio.paused) {
      tryPlay();
    }
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (audio.paused) {
      muted = false;
      sessionStorage.setItem('royintan-music-muted', '0');
      tryPlay();
    } else {
      audio.pause();
      muted = true;
      sessionStorage.setItem('royintan-music-muted', '1');
      saveMusicState();
    }
    updateBtn();
  });

  setTimeout(() => btn.classList.add('visible'), started ? 100 : 800);
  updateBtn();
}

// ---------- Welcome splash (home page only) ----------
function initSplash() {
  const splash = document.getElementById('welcome-splash');
  if (!splash) return;

  const w1 = document.getElementById('sw1');
  const w2 = document.getElementById('sw2');
  const w3 = document.getElementById('sw3');
  const imgWrap = document.querySelector('.splash-image-wrap');
  const img = document.getElementById('splashImg');
  const skip = document.querySelector('.splash-skip');

  // Prevent scroll while splash is open
  document.body.style.overflow = 'hidden';

  const showWord = (el, delay) => {
    setTimeout(() => {
      if (el) {
        el.classList.add('show');
        setTimeout(() => el.classList.add('pulse'), 400);
      }
    }, delay);
  };

  // Sequence: رویین‌تن → به → خوش آمدید → image
  showWord(w1, 300);
  showWord(w2, 1100);
  showWord(w3, 1900);

  setTimeout(() => {
    if (imgWrap) imgWrap.classList.add('show');
    if (img) img.classList.add('rock');
    if (skip) skip.classList.add('show');
  }, 2700);

  function closeSplash() {
    splash.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(() => {
      splash.remove();
    }, 750);
  }

  // Auto close after ~5.5s from start, or on click
  const autoTimer = setTimeout(closeSplash, 5500);
  splash.addEventListener('click', () => {
    clearTimeout(autoTimer);
    closeSplash();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateCities();
  const calcBtn = document.getElementById('w-calc-btn');
  if (calcBtn) calcBtn.addEventListener('click', calcProfileWeight);

  ['w-thk', 'w-len', 'w-wid', 'w-qty'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calcProfileWeight);
      el.addEventListener('change', calcProfileWeight);
    }
  });

  const shipBtn = document.getElementById('ship-calc-btn');
  if (shipBtn) shipBtn.addEventListener('click', calcShipping);
  const dest = document.getElementById('ship-dest');
  if (dest) dest.addEventListener('change', calcShipping);

  initSplash();
  initMusic();
});
