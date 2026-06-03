(function () {
  "use strict";

  /** 每題選項含分數：總分愈高愈偏「分析／結構型」，愈低愈偏「直覺／彈性型」 */
  var QUESTIONS = [
    {
      id: 1,
      text: "面對截止期限將至，你通常會？",
      options: [
        { label: "列出步驟與時間表，依序完成", score: 3 },
        { label: "先處理最棘手的部分，再補細節", score: 2 },
        { label: "依當下靈感先做，再視情況調整", score: 1 },
      ],
    },
    {
      id: 2,
      text: "做重要決定時，你較依賴？",
      options: [
        { label: "數據、規則與可驗證的資訊", score: 3 },
        { label: "既有經驗與他人建議的綜合判斷", score: 2 },
        { label: "直覺與整體氛圍的感受", score: 1 },
      ],
    },
    {
      id: 3,
      text: "在團隊討論中，你較常？",
      options: [
        { label: "整理共識並提出可行方案", score: 3 },
        { label: "居中協調不同意見", score: 2 },
        { label: "提出新角度或跳脫框架的想法", score: 1 },
      ],
    },
  ];

  var RESULTS = {
    high: {
      tag: "結構分析型",
      title: "結構分析型思維",
      paragraphs: [
        "你傾向用清楚的步驟與邏輯拆解問題，在壓力下仍能保持條理。決策時重視可驗證的依據，適合需要規劃與品質控管的任務。",
        "建議：偶爾留白給創意與直覺，避免過度追求完美計畫而延誤行動。",
      ],
    },
    mid: {
      tag: "平衡整合型",
      title: "平衡整合型思維",
      paragraphs: [
        "你能在秩序與彈性之間取得平衡，會參考規則與經驗，也能視情境調整做法。在團隊中常扮演務實的橋梁角色。",
        "建議：重大決策時可再刻意區分「事實」與「感受」，讓判斷更全面。",
      ],
    },
    low: {
      tag: "直覺彈性型",
      title: "直覺彈性型思維",
      paragraphs: [
        "你對氛圍與可能性敏感，擅長快速試錯與發想新路。在變動快的環境中能靈活應對，為團隊帶來新意。",
        "建議：在期限緊迫時，可為自己設最小結構（例如三個檢查點），讓創意更穩妥落地。",
      ],
    },
  };

  var screens = {
    home: document.getElementById("screen-home"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
  };

  var els = {
    btnStart: document.getElementById("btn-start"),
    btnRetry: document.getElementById("btn-retry"),
    btnPrev: document.getElementById("btn-prev"),
    progressCurrent: document.getElementById("progress-current"),
    progressTotal: document.getElementById("progress-total"),
    progressFill: document.getElementById("progress-fill"),
    progressBar: document.getElementById("progress-bar-container"),
    questionCard: document.getElementById("question-card"),
    questionIndex: document.getElementById("question-index"),
    questionText: document.getElementById("question-text"),
    optionsList: document.getElementById("options-list"),
    resultTag: document.getElementById("result-tag"),
    resultTitle: document.getElementById("result-title"),
    resultScore: document.getElementById("result-score"),
    resultBody: document.getElementById("result-body"),
    siteLogo: document.querySelector(".site-logo"),
  };

  var LOGO_SLIDE_DURATION_MS = 700;
  var totalQuestions = QUESTIONS.length;
  var currentIndex = 0;
  var totalScore = 0;
  /** 每題已選分數；null 表示尚未作答，重新選擇會覆蓋 */
  var answers = [];
  var swapTimer = null;
  var advanceTimer = null;

  function resetAnswers() {
    answers = new Array(totalQuestions);
    for (var i = 0; i < totalQuestions; i++) {
      answers[i] = null;
    }
  }

  function recalculateScore() {
    totalScore = 0;
    for (var i = 0; i < answers.length; i++) {
      if (answers[i] !== null) {
        totalScore += answers[i];
      }
    }
  }

  function clearLogoSlideDownIn() {
    if (els.siteLogo) {
      els.siteLogo.classList.remove("slide-down-in");
    }
  }

  function playLogoSlideDownIn() {
    if (!els.siteLogo) return;
    clearLogoSlideDownIn();
    void els.siteLogo.offsetWidth;
    els.siteLogo.classList.add("slide-down-in");
  }

  if (els.siteLogo) {
    els.siteLogo.addEventListener("animationend", function (e) {
      if (e.animationName === "slide-down-in") {
        clearLogoSlideDownIn();
      }
    });
  }

  function showScreen(name) {
    if (name === "home") {
      clearLogoSlideDownIn();
    }
    Object.keys(screens).forEach(function (key) {
      var el = screens[key];
      var active = key === name;
      el.classList.toggle("screen--active", active);
      el.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  function transitionToScreen(fromEl, toEl, onMid) {
    fromEl.classList.add("is-leaving");
    window.setTimeout(function () {
      fromEl.classList.remove("screen--active", "is-leaving");
      fromEl.setAttribute("aria-hidden", "true");
      toEl.classList.add("is-entering");
      toEl.classList.add("screen--active");
      toEl.setAttribute("aria-hidden", "false");
      if (typeof onMid === "function") onMid();
      window.requestAnimationFrame(function () {
        toEl.classList.remove("is-entering");
      });
    }, 280);
  }

  function setProgress() {
    var step = currentIndex + 1;
    els.progressCurrent.textContent = String(step);
    els.progressTotal.textContent = String(totalQuestions);
    var pct = (step / totalQuestions) * 100;
    els.progressFill.style.width = pct + "%";
    els.progressBar.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  function updatePrevButton() {
    var isFirst = currentIndex === 0;
    els.btnPrev.hidden = isFirst;
    els.btnPrev.disabled = isFirst;
  }

  function renderQuestion() {
    var q = QUESTIONS[currentIndex];
    var savedScore = answers[currentIndex];

    els.questionIndex.textContent = "題目 " + q.id;
    els.questionText.textContent = q.text;
    els.optionsList.innerHTML = "";

    q.options.forEach(function (opt) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      if (savedScore !== null && opt.score === savedScore) {
        btn.classList.add("is-selected");
      }
      btn.textContent = opt.label;
      btn.setAttribute("data-score", String(opt.score));
      btn.addEventListener("click", function () {
        onOptionClick(btn, opt.score);
      });
      li.appendChild(btn);
      els.optionsList.appendChild(li);
    });

    setProgress();
    updatePrevButton();
  }

  function animateQuestionSwap(advanceFn) {
    els.questionCard.classList.remove("is-swap-in");
    els.questionCard.classList.add("is-swap-out");
    if (swapTimer) window.clearTimeout(swapTimer);
    swapTimer = window.setTimeout(function () {
      advanceFn();
      els.questionCard.classList.remove("is-swap-out");
      els.questionCard.classList.add("is-swap-in");
      window.requestAnimationFrame(function () {
        els.questionCard.classList.remove("is-swap-in");
      });
    }, 220);
  }

  function onOptionClick(btn, score) {
    if (advanceTimer) {
      window.clearTimeout(advanceTimer);
      advanceTimer = null;
    }

    var buttons = els.optionsList.querySelectorAll(".option-btn");
    buttons.forEach(function (b) {
      b.disabled = true;
    });
    btn.classList.add("is-selected");

    answers[currentIndex] = score;
    recalculateScore();

    advanceTimer = window.setTimeout(function () {
      advanceTimer = null;
      if (currentIndex < totalQuestions - 1) {
        animateQuestionSwap(function () {
          currentIndex += 1;
          renderQuestion();
        });
      } else {
        showResult();
      }
    }, 320);
  }

  function goToPreviousQuestion() {
    if (currentIndex <= 0) return;
    if (advanceTimer) {
      window.clearTimeout(advanceTimer);
      advanceTimer = null;
    }

    animateQuestionSwap(function () {
      currentIndex -= 1;
      renderQuestion();
    });
  }

  function getResultKey(score) {
    var max = totalQuestions * 3;
    var min = totalQuestions * 1;
    var mid = (max + min) / 2;
    if (score >= mid + 1) return "high";
    if (score <= mid - 1) return "low";
    return "mid";
  }

  function showResult() {
    recalculateScore();
    var key = getResultKey(totalScore);
    var data = RESULTS[key];

    els.resultTag.textContent = data.tag;
    els.resultTitle.textContent = data.title;
    els.resultScore.textContent =
      "你的總分為 " + totalScore + " 分（滿分 " + totalQuestions * 3 + " 分）";

    els.resultBody.innerHTML = "";
    data.paragraphs.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      els.resultBody.appendChild(p);
    });

    transitionToScreen(screens.quiz, screens.result, function () {
      els.btnRetry.focus();
    });
  }

  function startQuiz() {
    currentIndex = 0;
    totalScore = 0;
    resetAnswers();
    renderQuestion();
    transitionToScreen(screens.home, screens.quiz, function () {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          playLogoSlideDownIn();
        });
      });
    });
  }

  function restartQuiz() {
    currentIndex = 0;
    totalScore = 0;
    resetAnswers();
    renderQuestion();
    transitionToScreen(screens.result, screens.quiz, null);
  }

  els.btnStart.addEventListener("click", startQuiz);
  els.btnRetry.addEventListener("click", restartQuiz);
  els.btnPrev.addEventListener("click", goToPreviousQuestion);

  resetAnswers();
  setProgress();
  updatePrevButton();
})();
