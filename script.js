const $ = id => document.getElementById(id);
const HOLE_COUNT = 9;

// Settings for each level: time, how long a mole stays, gap between pops,
// how many moles at once, and the chance of bomb / golden mole / clock
const LEVELS = {
  easy:   { label: 'Easy',   time: 35, stay: [900, 1400], gap: [800, 1200], max: 1, bomb: 0.10, gold: 0.06, clock: 0.05, boss: 0.03 },
  medium: { label: 'Medium', time: 30, stay: [700, 1100], gap: [550, 900],  max: 2, bomb: 0.15, gold: 0.07, clock: 0.04, boss: 0.05 },
  hard:   { label: 'Hard',   time: 25, stay: [500, 850],  gap: [350, 650],  max: 3, bomb: 0.22, gold: 0.08, clock: 0.03, boss: 0.07 }
};
const ICON = { mole: '🐹', gold: '🐹', bomb: '💣', clock: '⏰', boss: '🦫' };

let level = 'medium', playerName = 'Player';
let score, timeLeft, running = false, paused = false, soundOn = true;
let combo, bestCombo, hits, misses, golds, bosses, bombsHit;
let countdownId, spawnId, cdId;
const holes = [];

// ---------- Safe localStorage ----------
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

// ---------- Sound ----------
let audioCtx;
function beep(freq, duration) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// ---------- Leaderboard ----------
function renderBoard(el) {
  const list = load('wamScores', []).sort((a, b) => b.s - a.s).slice(0, 5);
  el.innerHTML = '';
  if (!list.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No scores yet. Be the first.';
    el.appendChild(li);
    return;
  }
  list.forEach((p, i) => {
    const li = document.createElement('li');
    const n = document.createElement('span');
    n.textContent = (i + 1) + '. ' + p.n;   // textContent keeps names safe
    const l = document.createElement('span');
    l.textContent = LEVELS[p.l] ? LEVELS[p.l].label : '';
    const s = document.createElement('b');
    s.textContent = p.s;
    li.append(n, l, s);
    el.appendChild(li);
  });
}
function bestForLevel() {
  return Math.max(0, ...load('wamScores', []).filter(p => p.l === level).map(p => p.s));
}

// ---------- Screens ----------
function showScreen(name) {
  $('start').classList.toggle('hidden', name !== 'start');
  $('game').classList.toggle('hidden', name !== 'game');
  if (name === 'start') renderBoard($('boardStart'));
}

// ---------- Start screen ----------
$('nameInput').value = load('wamName', '');
document.querySelectorAll('.lvl').forEach(btn => {
  btn.addEventListener('click', () => {
    level = btn.dataset.level;
    document.querySelectorAll('.lvl').forEach(b => b.classList.toggle('on', b === btn));
  });
});

// Warm-up mole on the start screen
const demoMole = $('demoMole');
const warmLines = ['Tap the mole to warm up', 'Nice one!', 'Two down. One more.', 'Warmed up. Pick a level and play.'];
let warm = 0;
function demoLoop() {
  if (!$('start').classList.contains('hidden')) {
    demoMole.classList.add('up');
    setTimeout(() => demoMole.classList.remove('up'), 1100);
  }
  setTimeout(demoLoop, 1900);
}
$('demoHole').addEventListener('click', () => {
  if (!demoMole.classList.contains('up')) return;
  demoMole.classList.remove('up');
  warm = Math.min(warm + 1, warmLines.length - 1);
  $('warmText').textContent = warmLines[warm];
  beep(600, 0.1);
});
demoLoop();

// ---------- Build the 9 holes ----------
for (let i = 0; i < HOLE_COUNT; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  const hole = document.createElement('button');
  hole.className = 'hole';
  hole.setAttribute('aria-label', 'Hole ' + (i + 1));
  const mole = document.createElement('span');
  mole.className = 'mole';
  hole.appendChild(mole);
  cell.appendChild(hole);
  $('grid').appendChild(cell);
  const h = { cell, mole, type: null, timer: null };
  hole.addEventListener('click', () => whack(h));
  holes.push(h);
}

// ---------- Spawning ----------
const rand = ([min, max]) => Math.floor(Math.random() * (max - min + 1)) + min;
const rush = () => (timeLeft <= 10 ? 0.7 : 1);   // last 10 seconds are faster

function spawn() {
  if (!running) return;
  const L = LEVELS[level];
  if (!paused) {
    const free = holes.filter(h => !h.type);
    const active = holes.length - free.length;
    if (active < L.max && free.length) show(free[Math.floor(Math.random() * free.length)]);
  }
  spawnId = setTimeout(spawn, rand(L.gap) * rush());
}

function show(h) {
  const L = LEVELS[level];
  const r = Math.random();
  let type = 'mole';
  if (r < L.bomb) type = 'bomb';
  else if (r < L.bomb + L.gold) type = 'gold';
  else if (r < L.bomb + L.gold + L.clock) type = 'clock';
  else if (r < L.bomb + L.gold + L.clock + L.boss) type = 'boss';

  h.type = type;
  h.hp = 3;
  h.mole.textContent = ICON[type];
  h.mole.className = 'mole up ' + type;
  h.timer = setTimeout(() => hide(h), rand(L.stay) * rush() * (type === 'boss' ? 2 : 1));
}

function hide(h) {
  clearTimeout(h.timer);
  h.type = null;
  h.mole.classList.remove('up');
}

// ---------- Effects ----------
function floatText(h, text, kind) {
  const p = document.createElement('div');
  p.className = 'popup ' + kind;
  p.textContent = text;
  h.cell.appendChild(p);
  setTimeout(() => p.remove(), 800);
}
function burst(h, icon) {
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('span');
    p.className = 'spark';
    p.textContent = icon;
    const a = Math.PI * 2 * i / 6;
    p.style.setProperty('--dx', Math.cos(a) * 55 + 'px');
    p.style.setProperty('--dy', Math.sin(a) * 55 + 'px');
    h.cell.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}
function swingHammer(h) {
  const m = document.createElement('div');
  m.className = 'hammer';
  m.textContent = '🔨';
  h.cell.appendChild(m);
  setTimeout(() => m.remove(), 300);
}
function updateHud() {
  $('score').textContent = score;
  $('time').textContent = timeLeft;
  $('game').classList.toggle('frenzy', frenzy());
  $('combo').textContent = 'x' + multiplier();
  $('combo').classList.toggle('hot', multiplier() > 1);
  $('barFill').style.width = Math.min(100, timeLeft / LEVELS[level].time * 100) + '%';
  $('barFill').classList.toggle('low', timeLeft <= 10);
}
const frenzy = () => running && timeLeft <= 8;
const multiplier = () => (combo >= 10 ? 3 : combo >= 5 ? 2 : 1);

// ---------- Hitting a hole ----------
function whack(h) {
  if (!running || paused) return;
  swingHammer(h);

  // Empty hole = miss
  if (!h.type) {
    misses++;
    combo = 0;
    beep(200, 0.05);
    updateHud();
    return;
  }

  const type = h.type;

  // Boss mole survives the first two hits
  if (type === 'boss' && --h.hp > 0) {
    floatText(h, h.hp === 1 ? 'One more!' : 'Ouch!', 'good');
    burst(h, '⭐');
    beep(400, 0.08);
    return;
  }
  hide(h);
  burst(h, type === 'bomb' ? '💥' : '✨');

  if (type === 'bomb') {
    score = Math.max(0, score - 3);
    bombsHit++;
    combo = 0;
    floatText(h, '-3', 'bad');
    beep(150, 0.25);
    $('game').classList.add('shake');
    setTimeout(() => $('game').classList.remove('shake'), 300);
  } else {
    hits++;
    if (type === 'gold') golds++;
    if (type === 'boss') bosses++;
    combo++;
    bestCombo = Math.max(bestCombo, combo);
    if (type === 'clock') {
      timeLeft += 3;
      floatText(h, '+3s', 'good');
      beep(900, 0.15);
    } else {
      const base = type === 'boss' ? 10 : type === 'gold' ? 5 : 1;
      const points = base * multiplier() * (frenzy() ? 2 : 1);
      score += points;
      floatText(h, '+' + points, type === 'gold' ? 'gold' : 'good');
      beep(type === 'gold' ? 880 : 600, 0.1);
    }
  }
  updateHud();
}

// ---------- Game flow ----------
function startRound() {
  const L = LEVELS[level];
  score = 0; combo = 0; bestCombo = 0; hits = 0; misses = 0; golds = 0; bosses = 0; bombsHit = 0;
  timeLeft = L.time;
  paused = false;
  running = true;
  $('pauseBtn').textContent = 'Pause';
  $('grid').classList.remove('paused');
  $('best').textContent = bestForLevel();
  updateHud();
  spawn();
  countdownId = setInterval(() => {
    if (paused) return;
    timeLeft--;
    updateHud();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function startGame() {
  playerName = $('nameInput').value.trim() || 'Player';
  save('wamName', $('nameInput').value.trim());
  stopTimers();
  $('gameOver').classList.add('hidden');
  showScreen('game');
  score = 0; combo = 0; timeLeft = LEVELS[level].time;
  updateHud();

  // 3, 2, 1 countdown
  let n = 3;
  const num = $('countNum');
  $('countdown').classList.remove('hidden');
  const tick = () => {
    if (n === 0) {
      $('countdown').classList.add('hidden');
      startRound();
      return;
    }
    num.textContent = n;
    num.style.animation = 'none'; void num.offsetWidth; num.style.animation = '';
    beep(400, 0.1);
    n--;
    cdId = setTimeout(tick, 800);
  };
  tick();
}

function stopTimers() {
  running = false;
  clearInterval(countdownId);
  clearTimeout(spawnId);
  clearTimeout(cdId);
  $('game').classList.remove('frenzy');
  holes.forEach(hide);
}

function endGame() {
  stopTimers();
  beep(300, 0.4);

  const prevBest = bestForLevel();
  const scores = load('wamScores', []);
  scores.push({ n: playerName, s: score, l: level });
  save('wamScores', scores.sort((a, b) => b.s - a.s).slice(0, 20));

  const tries = hits + misses;
  $('finalScore').textContent = score;
  $('rHits').textContent = hits;
  $('rAcc').textContent = (tries ? Math.round(hits / tries * 100) : 0) + '%';
  $('rCombo').textContent = bestCombo;
  const acc = tries ? hits / tries : 0;
  const earned = [];
  if (acc >= 0.9 && hits >= 10) earned.push('🎯 Sharpshooter');
  if (bestCombo >= 10) earned.push('🔥 Combo king');
  if (bombsHit === 0 && hits >= 10) earned.push('🛡️ Bomb dodger');
  if (golds >= 2) earned.push('🌟 Golden touch');
  if (bosses >= 1) earned.push('🦫 Boss slayer');
  $('badges').innerHTML = '';
  if (!earned.length) $('badges').textContent = 'None this time. Try for one next round.';
  earned.forEach(t => {
    const b = document.createElement('span');
    b.textContent = t;
    $('badges').appendChild(b);
  });
  $('rank').textContent =
    score >= 40 ? 'Garden legend!' :
    score >= 25 ? 'Mole master!' :
    score >= 15 ? 'Sharp reflexes!' :
    score >= 8  ? 'Getting there' :
                  'Keep practicing';
  $('feedback').textContent = score > prevBest && score > 0 ? 'New best on ' + LEVELS[level].label + '!' : '';
  renderBoard($('boardOver'));
  $('gameOver').classList.remove('hidden');
}

function togglePause() {
  if (!running) return;
  paused = !paused;
  $('pauseBtn').textContent = paused ? 'Resume' : 'Pause';
  $('grid').classList.toggle('paused', paused);
  if (paused) holes.forEach(hide);
}

$('playBtn').addEventListener('click', startGame);
$('playAgain').addEventListener('click', startGame);
$('pauseBtn').addEventListener('click', togglePause);
$('soundBtn').addEventListener('click', () => {
  soundOn = !soundOn;
  $('soundBtn').textContent = soundOn ? 'Sound on' : 'Sound off';
});
function toMenu() {
  stopTimers();
  $('countdown').classList.add('hidden');
  $('gameOver').classList.add('hidden');
  showScreen('start');
}
$('quitBtn').addEventListener('click', toMenu);
$('menuBtn').addEventListener('click', toMenu);

renderBoard($('boardStart'));

// ---------- Day / night theme ----------
let night = load('wamNight', false);
function applyTheme() {
  document.body.classList.toggle('night', night);
  document.querySelectorAll('.themeBtn').forEach(b => b.textContent = night ? 'Day mode' : 'Night mode');
}
document.querySelectorAll('.themeBtn').forEach(b => b.addEventListener('click', () => {
  night = !night;
  save('wamNight', night);
  applyTheme();
}));
applyTheme()