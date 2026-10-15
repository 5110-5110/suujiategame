'use strict';

const DIGITS = 3; // 桁数

let answer = [];
let current = [];
let history = [];
let finished = false;

const slotsEl = document.getElementById('slots');
const keypadEl = document.getElementById('keypad');
const messageEl = document.getElementById('message');
const historyEl = document.getElementById('history');
const countEl = document.getElementById('count');
const submitBtn = document.getElementById('submit-btn');
const deleteBtn = document.getElementById('delete-btn');
const restartBtn = document.getElementById('restart-btn');

// 重複なしのランダムな答えを作る
function createAnswer() {
  const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, DIGITS);
}

// ヒットとブローを数える
function judge(guess, ans) {
  let hit = 0;
  let blow = 0;
  guess.forEach((d, i) => {
    if (d === ans[i]) hit++;
    else if (ans.includes(d)) blow++;
  });
  return { hit, blow };
}

function setMessage(text, type = '') {
  messageEl.textContent = text;
  messageEl.className = 'message' + (type ? ' ' + type : '');
}

function renderSlots() {
  slotsEl.innerHTML = '';
  for (let i = 0; i < DIGITS; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot' + (current[i] !== undefined ? ' filled' : '');
    slot.textContent = current[i] !== undefined ? current[i] : '';
    slotsEl.appendChild(slot);
  }
}

function renderKeypad() {
  keypadEl.innerHTML = '';
  for (let n = 0; n <= 9; n++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = n;
    btn.disabled = finished || current.includes(n) || current.length >= DIGITS;
    btn.addEventListener('click', () => addDigit(n));
    keypadEl.appendChild(btn);
  }
}

function renderHistory() {
  historyEl.innerHTML = '';
  history.forEach(({ guess, hit, blow }) => {
    const li = document.createElement('li');
    li.innerHTML =
      `<span class="guess">${guess.join('')}</span>` +
      `<span class="result"><span class="hit">${hit} ヒット</span> / <span class="blow">${blow} ブロー</span></span>`;
    historyEl.appendChild(li);
  });
  countEl.textContent = history.length ? `(${history.length}回)` : '';
}

function render() {
  renderSlots();
  renderKeypad();
  renderHistory();
  deleteBtn.disabled = finished || current.length === 0;
  submitBtn.disabled = finished || current.length !== DIGITS;
}

function addDigit(n) {
  if (finished || current.length >= DIGITS || current.includes(n)) return;
  current.push(n);
  setMessage('');
  render();
}

function removeDigit() {
  if (finished) return;
  current.pop();
  setMessage('');
  render();
}

function submit() {
  if (finished) return;
  if (current.length !== DIGITS) {
    setMessage(`${DIGITS}つの数字を選んでください。`, 'error');
    return;
  }
  const { hit, blow } = judge(current, answer);
  history.unshift({ guess: [...current], hit, blow });
  current = [];

  if (hit === DIGITS) {
    finished = true;
    setMessage(`正解です! ${history.length}回でクリアしました。答え: ${answer.join('')}`, 'win');
  } else {
    setMessage('');
  }
  render();
}

function restart() {
  answer = createAnswer();
  current = [];
  history = [];
  finished = false;
  setMessage('');
  render();
}

// キーボード操作
document.addEventListener('keydown', (e) => {
  if (/^[0-9]$/.test(e.key)) addDigit(Number(e.key));
  else if (e.key === 'Backspace') removeDigit();
  else if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') submit();
});

submitBtn.addEventListener('click', submit);
deleteBtn.addEventListener('click', removeDigit);
restartBtn.addEventListener('click', restart);

restart();
