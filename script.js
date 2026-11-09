const GAME_TIME = 30;
const HOLE_COUNT = 9;

const grid = document.getElementById('grid');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const overlay = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const feedbackEl = document.getElementById('feedback');

let score = 0;
let timeLeft = GAME_TIME;
let running = false;
let countdownId, moleTimeoutId, lastIndex;
const moles = [];

// Create the 9 holes with a mole in each
for (let i = 0; i < HOLE_COUNT; i++) {
  const hole = document.createElement('div');
  hole.className = 'hole';

  const mole = document.createElement('div');
  mole.className = 'mole';
  mole.textContent = '🐹';
  mole.addEventListener('click', () => whack(mole));

  hole.appendChild(mole);
  grid.appendChild(hole);
  moles.push(mole);
}

// Random helpers
function randomTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMole() {
  let i;
  do { i = Math.floor(Math.random() * HOLE_COUNT); } while (i === lastIndex);
  lastIndex = i;
  return moles[i];
}

// Pop up a random mole, hide it, then repeat
function popMole() {
  if (!running) return;
  const mole = randomMole();
  const max = timeLeft > 15 ? 1000 : 700;   // faster near the end
  const duration = randomTime(400, max);

  mole.classList.add('up');
  moleTimeoutId = setTimeout(() => {
    mole.classList.remove('up');
    popMole();
  }, duration);
}

// Player clicks a mole
function whack(mole) {
  if (!running || !mole.classList.contains('up')) return;
  score++;
  scoreEl.textContent = score;
  mole.classList.remove('up');
  mole.classList.add('whacked');
  setTimeout(() => mole.classList.remove('whacked'), 300);
}

function startGame() {
  if (running) return;
  resetState();
  running = true;
  popMole();

  countdownId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  running = false;
  clearInterval(countdownId);
  clearTimeout(moleTimeoutId);
  moles.forEach(m => m.classList.remove('up'));

  finalScoreEl.textContent = score;
  feedbackEl.textContent =
    score >= 25 ? '🔥 Mole master!' :
    score >= 15 ? '👍 Nice reflexes!' :
    score >= 8  ? '🙂 Not bad, try again!' :
                  '🐌 Keep practicing!';
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