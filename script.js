const GAME_TIME = 30;
const HOLE_COUNT = 9;

// Har level ki setting: mole kitni der ruke aur bomb kitni baar aaye
const LEVELS = {
  easy:   { min: 600, max: 1200, bombChance: 0.10 },
  medium: { min: 400, max: 1000, bombChance: 0.15 },
  hard:   { min: 300, max: 700,  bombChance: 0.25 }
};

const grid = document.getElementById('grid');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const barFill = document.getElementById('barFill');
const levelEl = document.getElementById('level');
const overlay = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const feedbackEl = document.getElementById('feedback');
const gameBox = document.querySelector('.game');

let score = 0;
let timeLeft = GAME_TIME;
let running = false;
let countdownId, moleTimeoutId, lastIndex;
const moles = [];

// ---------- Best score (browser yaad rakhta hai) ----------
let best = 0;
try { best = Number(localStorage.getItem('wamBest')) || 0; } catch (e) {}
bestEl.textContent = best;

// ---------- Sound ----------
let audioCtx;
function beep(freq, duration) {
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

// ---------- 9 holes banana ----------
for (let i = 0; i < HOLE_COUNT; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';

  const hole = document.createElement('div');
  hole.className = 'hole';

  const mole = document.createElement('div');
  mole.className = 'mole';
  mole.textContent = '🐹';
  mole.dataset.type = 'mole';
  mole.addEventListener('click', () => whack(mole));

  hole.appendChild(mole);
  cell.appendChild(hole);
  grid.appendChild(cell);
  moles.push(mole);
}

// ---------- Random helpers ----------
function randomTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMole() {
  let i;
  do { i = Math.floor(Math.random() * HOLE_COUNT); } while (i === lastIndex);
  lastIndex = i;
  return moles[i];
}

// ---------- Mole ko bahar nikalna ----------
function popMole() {
  if (!running) return;

  const level = LEVELS[levelEl.value];
  const mole = randomMole();

  // Kabhi kabhi mole ki jagah bomb aata hai
  if (Math.random() < level.bombChance) {
    mole.textContent = '💣';
    mole.dataset.type = 'bomb';
  } else {
    mole.textContent = '🐹';
    mole.dataset.type = 'mole';
  }

  // Aakhri 15 second mein game tez ho jata hai
  const max = timeLeft > 15 ? level.max : level.max * 0.7;
  const duration = randomTime(level.min, Math.floor(max));

  mole.classList.add('up');
  moleTimeoutId = setTimeout(() => {
    mole.classList.remove('up');
    popMole();
  }, duration);
}

// ---------- +1 ya -3 ka popup ----------
function showPopup(mole, text, kind) {
  const popup = document.createElement('div');
  popup.className = 'popup ' + kind;
  popup.textContent = text;
  mole.closest('.cell').appendChild(popup);
  setTimeout(() => popup.remove(), 700);
}

// ---------- Mole par click ----------
function whack(mole) {
  if (!running || !mole.classList.contains('up')) return;

  if (mole.dataset.type === 'bomb') {
    score = Math.max(0, score - 3);
    showPopup(mole, '-3', 'bad');
    beep(150, 0.25);
    gameBox.classList.add('shake');
    setTimeout(() => gameBox.classList.remove('shake'), 300);
  } else {
    score++;
    showPopup(mole, '+1', 'good');
    beep(600, 0.1);
  }
  scoreEl.textContent = score;

  mole.classList.remove('up');
  mole.classList.add('whacked');
  setTimeout(() => mole.classList.remove('whacked'), 300);

  // Foran agla mole bhejo
  clearTimeout(moleTimeoutId);
  popMole();
}

// ---------- Start, End, Reset ----------
function startGame() {
  if (running) return;
  resetState();
  running = true;
  popMole();

  countdownId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    barFill.style.width = (timeLeft / GAME_TIME * 100) + '%';
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  running = false;
  clearInterval(countdownId);
  clearTimeout(moleTimeoutId);
  moles.forEach(m => m.classList.remove('up'));
  beep(300, 0.4);

  finalScoreEl.textContent = score;

  let message =
    score >= 25 ? '🔥 Mole master!' :
    score >= 15 ? '👍 Nice reflexes!' :
    score >= 8  ? '🙂 Not bad, try again!' :
                  '🐌 Keep practicing!';

  if (score > best) {
    best = score;
    bestEl.textContent = best;
    try { localStorage.setItem('wamBest', best); } catch (e) {}
    message += ' 🏆 New best score!';
  }
  feedbackEl.textContent = message;
  overlay.classList.remove('hidden');
}

function resetState() {
  clearInterval(countdownId);
  clearTimeout(moleTimeoutId);
  running = false;
  score = 0;
  timeLeft = GAME_TIME;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  barFill.style.width = '100%';
  moles.forEach(m => m.classList.remove('up', 'whacked'));
  overlay.classList.add('hidden');
}

function restartGame() {
  resetState();
  startGame();
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('playAgain').addEventListener('click', restartGame);