const QUESTION_COUNT = 10;

let currentType = "";
let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const titles = {
  add1: "🌷 たしざん① くりあがりなし",
  add2: "🌻 たしざん② くりあがりあり",
  sub1: "🍀 ひきざん① くりさがりなし",
  sub2: "⭐ ひきざん② くりさがりあり"
};


// 問題一覧を作成
function generatePool(type) {

  const pool = [];

  if (type === "add1" || type === "add2") {

    for (let a = 1; a <= 9; a++) {
      for (let b = 1; b <= 9; b++) {

        const answer = a + b;

        if (
          (type === "add1" && answer <= 10) ||
          (type === "add2" && answer > 10)
        ) {
          pool.push({
            a,
            b,
            answer,
            symbol: "+"
          });
        }
      }
    }

  } else if (type === "sub1") {

    for (let a = 2; a <= 10; a++) {
      for (let b = 1; b <= 9; b++) {

        if (a > b) {
          pool.push({
            a,
            b,
            answer: a - b,
            symbol: "−"
          });
        }
      }
    }

  } else if (type === "sub2") {

    for (let a = 11; a <= 18; a++) {
      for (let b = 2; b <= 9; b++) {

        if (b > a - 10) {
          pool.push({
            a,
            b,
            answer: a - b,
            symbol: "−"
          });
        }
      }
    }
  }

  return pool;
}


// シャッフル
function shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];

  }

  return array;
}


// ゲーム開始
function startGame(type) {

  currentType = type;

  questions = shuffle(generatePool(type))
    .slice(0, QUESTION_COUNT);

  currentIndex = 0;
  score = 0;

  document.getElementById("homeScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  document.getElementById("gameTitle").textContent = titles[type];

  showQuestion();
}


// 問題表示
function showQuestion() {

  answered = false;

  const question = questions[currentIndex];

  document.getElementById("progress").textContent =
    `${currentIndex + 1}もんめ / 10もん`;

  document.getElementById("stars").textContent =
    "⭐".repeat(score) +
    "☆".repeat(QUESTION_COUNT - score);

  document.getElementById("questionText").textContent =
    `${question.a} ${question.symbol} ${question.b} = ?`;

  document.getElementById("answerInput").value = "";

  document.getElementById("feedback").innerHTML = "";

  document.getElementById("answerButton").classList.remove("hidden");
  document.getElementById("nextButton").classList.add("hidden");

}


// 答え合わせ
function checkAnswer() {

  if (answered) return;

  const input = document.getElementById("answerInput");

  if (input.value.trim() === "") {
    document.getElementById("feedback").textContent =
      "こたえを いれてね！";
    return;
  }

  answered = true;

  const question = questions[currentIndex];
  const userAnswer = Number(input.value);

  const feedback = document.getElementById("feedback");

  if (userAnswer === question.answer) {

    score++;

    feedback.innerHTML =
      `🎉 せいかい！<br>
       ${question.a} ${question.symbol} ${question.b}
       = ${question.answer}<br>
       よくできたね！`;

  } else {

    feedback.innerHTML = createExplanation(question);

  }

  document.getElementById("stars").textContent =
    "⭐".repeat(score) +
    "☆".repeat(QUESTION_COUNT - score);

  document.getElementById("answerButton").classList.add("hidden");
  document.getElementById("nextButton").classList.remove("hidden");

}


// 解説を作成
function createExplanation(q) {

  // 足し算①
  if (currentType === "add1") {

    return `
      🌱 おしい！<br>
      ${q.a} と ${q.b} を あわせると<br>
      ${q.a} + ${q.b} = ${q.answer}<br>
      になるよ！
    `;
  }

  // 足し算②
  if (currentType === "add2") {

    const need = 10 - q.a;
    const remain = q.b - need;

    return `
      🌱 いっしょに かんがえよう！<br>
      ① ${q.a} に ${need} をたすと10<br>
      ② ${q.b} を ${need} と ${remain} にわける<br>
      ③ 10 + ${remain} = ${q.answer}<br>
      ⭐ こたえは ${q.answer}！
    `;
  }

  // 引き算①
  if (currentType === "sub1") {

    return `
      🌱 いっしょに かんがえよう！<br>
      ${q.a} から ${q.b} をとると<br>
      ${q.answer} のこるよ！<br>
      ⭐ こたえは ${q.answer}！
    `;
  }

  // 引き算②
  if (currentType === "sub2") {

    const ones = q.a - 10;
    const tenMinus = 10 - q.b;

    return `
      🌱 いっしょに かんがえよう！<br>
      ① ${q.a} を 10 と ${ones} にわける<br>
      ② 10 − ${q.b} = ${tenMinus}<br>
      ③ ${tenMinus} + ${ones} = ${q.answer}<br>
      ⭐ こたえは ${q.answer}！
    `;
  }

}


// 次の問題
function nextQuestion() {

  currentIndex++;

  if (currentIndex >= QUESTION_COUNT) {

    showResult();

  } else {

    showQuestion();

  }
}


// 結果表示
function showResult() {

  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");

  document.getElementById("finalScore").innerHTML =
    `${score} / 10もん せいかい！`;

}


// もう一度
function restartGame() {

  startGame(currentType);

}


// ホームに戻る
function goHome() {

  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("homeScreen").classList.remove("hidden");

}