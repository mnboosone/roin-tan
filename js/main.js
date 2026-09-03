/* رویین‌تن – calculators & UI */

// Profile weight: approx kg/m = (2*(L+W)-4*T)*T*0.00785  for hollow rectangle
// Simpler rectangular bar approximation used in UI: area mm² * 0.00000785 * length_m... 
// For hollow profile calculator matching typical tables:
function calcProfileWeight() {
  const t = parseFloat(document.getElementById('w-thk').value) || 0;
  const L = parseFloat(document.getElementById('w-len').value) || 0;
  const W = parseFloat(document.getElementById('w-wid').value) || 0;
  const qty = parseFloat(document.getElementById('w-qty').value) || 1;
  // Hollow rectangular tube kg per meter (approx)
  // outer area - inner area, density 7.85 g/cm³
  let unit = 0;
  if (t > 0 && L > 0 && W > 0 && L > 2 * t && W > 2 * t) {
    const outer = L * W;
    const inner = (L - 2 * t) * (W - 2 * t);
    unit = ((outer - inner) / 100) * 0.785; // kg per meter
  }
  // show as unit weight (kg/m) and total for qty meters default 1m display
  const unitEl = document.getElementById('w-unit-val');
  const totalEl = document.getElementById('w-total-val');
  if (unitEl) unitEl.textContent = unit.toFixed(2);
  if (totalEl) totalEl.textContent = (unit * qty).toFixed(2);
}

// Shipping rates from Tehran (Excel data)
const shippingRates = {
  "اراک": [11000000, 15000000, 17000000],
  "اردبیل": [10000000, 17000000, 27000000],
  "ارومیه": [15000000, 19000000, 26000000],
  "اصفهان": [11000000, 13000000, 16000000],
  "اهواز": [21000000, 25000000, 28000000],
  "ایلام": [13000000, 20000000, 30000000],
  "بجنورد": [22000000, 29000000, 39000000],
  "بندرعباس": [26000000, 29000000, 35000000],
  "بوشهر": [14000000, 22000000, 28000000],
  "بیرجند": [21000000, 27000000, 38000000],
  "تبریز": [17000000, 24000000, 29000000],
  "تهران": [6000000, 7000000, 8000000],
  "خرم‌آباد": [10000000, 16000000, 19000000],
  "رشت": [13000000, 17500000, 25000000],
  "زاهدان": [30000000, 38000000, 50000000],
  "زنجان": [11000000, 19000000, 24000000],
  "سمنان": [11000000, 14500000, 17000000],
  "سنندج": [11000000, 16000000, 20000000],
  "شهرکرد": [9000000, 16000000, 20000000],
  "شیراز": [14000000, 20000000, 28000000],
  "قزوین": [10000000, 12000000, 16000000],
  "قم": [10000000, 12000000, 13000000],
  "کرج": [5000000, 7000000, 8000000],
  "کرمان": [22000000, 28000000, 32000000],
  "کرمانشاه": [13000000, 18000000, 27000000],
  "گرگان": [19000000, 26000000, 33000000],
  "مشهد": [22000000, 28000000, 33000000],
  "همدان": [10000000, 15500000, 19000000],
  "یزد": [14000000, 20000000, 25000000]
};

function formatToman(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calcShipping() {
  const sel = document.getElementById('ship-dest');
  if (!sel) return;
  const city = sel.value;
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

function showTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(id);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
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

document.addEventListener('DOMContentLoaded', () => {
  populateCities();
  const calcBtn = document.getElementById('w-calc-btn');
  if (calcBtn) calcBtn.addEventListener('click', calcProfileWeight);
  const shipBtn = document.getElementById('ship-calc-btn');
  if (shipBtn) shipBtn.addEventListener('click', calcShipping);
  const dest = document.getElementById('ship-dest');
  if (dest) dest.addEventListener('change', calcShipping);
});
