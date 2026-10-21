const progress = document.getElementById('progress');
const stars = document.getElementById('stars');
const questionEl = document.getElementById('question');
const form = document.getElementById('answerForm');
const input = document.getElementById('answer');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('nextButton');
const summary = document.getElementById('summary');
const restartButton = document.getElementById('restartButton');
const card = document.querySelector('.card');
let questions = [], current = 0, score = 0, answered = false;

function newGame() {
  const pool = [];
  for (let a = 11; a <= 18; a++) {
    for (let b = 2; b <= 9; b++) {
      if (b > a - 10) pool.push({a, b, answer: a - b});
    }
  }
  // Fisher–Yates shuffle: 10 different borrowing problems.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  questions = pool.slice(0, 10);
  current = 0; score = 0;
  summary.hidden = true;
  card.hidden = false;
  showQuestion();
}

function showQuestion() {
  answered = false;
  const q = questions[current];
  progress.textContent = `${current + 1}もんめ / 10もん`;
  stars.textContent = '⭐'.repeat(score) + '☆'.repeat(10 - score);
  questionEl.textContent = `${q.a} − ${q.b} = ?`;
  feedback.innerHTML = '';
  form.hidden = false;
  nextButton.hidden = true;
  input.value = '';
  input.focus();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (answered || input.value.trim() === '') return;
  answered = true;
  const q = questions[current];
  const correct = Number(input.value) === q.answer;
  form.hidden = true;
  if (correct) {
    score++;
    feedback.innerHTML = `<h2>🎉 せいかい！</h2><p style="text-align:center">${q.a} − ${q.b} = ${q.answer}<br>よくできたね！</p>`;
  } else {
    const ones = q.a - 10;
    const fromTen = 10 - q.b;
    feedback.innerHTML = `<h2>🌱 おしい！</h2><p>いっしょに かんがえよう！</p><div class="step">① ${q.a} を 10 と ${ones} に わける<br>${q.a} = 10 + ${ones}</div><div class="step">② 10 から ${q.b} を ひく<br>10 − ${q.b} = ${fromTen}</div><div class="step">③ のこった ${ones} を たす<br>${fromTen} + ${ones} = ${q.answer}</div><p><strong>⭐ こたえは ${q.answer} だよ！</strong></p>`;
  }
  stars.textContent = '⭐'.repeat(score) + '☆'.repeat(10 - score);
  nextButton.textContent = current === 9 ? 'けっかをみる →' : 'つぎのもんだい →';
  nextButton.hidden = false;
});

nextButton.addEventListener('click', () => {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    card.hidden = true;
    progress.textContent = 'おつかれさま！';
    summary.hidden = false;
    summary.textContent = `🎊 10もんちゅう ${score}もん せいかい！ ${score === 10 ? 'まんてん！すごい！' : 'またチャレンジしよう！'}`;
  }
});
restartButton.addEventListener('click', newGame);
newGame();
