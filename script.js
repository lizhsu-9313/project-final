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

  /** 各分數區間對應的籤詩圖片（測試階段皆指向同一張） */
  var RESULT_IMAGES = {
    high: "images/包豬公.png",
    mid: "images/包豬公.png",
    low: "images/包豬公.png",
  };

  var DOWNLOAD_FILENAME = "北捷眾生怪-我的測驗結果.png";

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
    resultImage: document.getElementById("result-image"),
    btnShare: document.getElementById("btn-share"),
    captureArea: document.getElementById("capture-area"),
    siteLogo: document.querySelector("#home-title"),
    captureLogo: document.querySelector(".capture-site-logo"),
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

  function getActiveLogoEl() {
    if (screens.result.classList.contains("screen--active") && els.captureLogo) {
      return els.captureLogo;
    }
    return els.siteLogo;
  }

  function clearLogoSlideDownIn() {
    [els.siteLogo, els.captureLogo].forEach(function (logo) {
      if (logo) logo.classList.remove("slide-down-in");
    });
  }

  function playLogoSlideDownIn() {
    var logo = getActiveLogoEl();
    if (!logo) return;
    clearLogoSlideDownIn();
    void logo.offsetWidth;
    logo.classList.add("slide-down-in");
  }

  document.addEventListener("animationend", function (e) {
    if (
      e.animationName === "slide-down-in" &&
      e.target &&
      (e.target.id === "home-title" ||
        e.target.classList.contains("capture-site-logo"))
    ) {
      e.target.classList.remove("slide-down-in");
    }
  });

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

  function setResultImage(key) {
    if (!els.resultImage) return;
    var src = RESULT_IMAGES[key] || RESULT_IMAGES.mid;
    els.resultImage.src = src;
    els.resultImage.alt = "你的測驗結果籤詩";
  }

  function triggerPngDownload(blob) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = DOWNLOAD_FILENAME;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function waitForCaptureImages(container) {
    var imgs = container.querySelectorAll("img");
    return Promise.all(
      Array.prototype.map.call(imgs, function (img) {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }
        return new Promise(function (resolve) {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      })
    );
  }

  function shareResultCapture() {
    if (!els.captureArea) return;
    if (typeof html2canvas !== "function") return;

    if (els.btnShare) els.btnShare.disabled = true;

    waitForCaptureImages(els.captureArea).then(function () {
      return html2canvas(els.captureArea, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
      });
    })
      .then(function (canvas) {
        return new Promise(function (resolve, reject) {
          canvas.toBlob(
            function (blob) {
              if (blob) resolve(blob);
              else reject(new Error("toBlob failed"));
            },
            "image/png",
            1
          );
        });
      })
      .then(triggerPngDownload)
      .catch(function () {
        window.alert("無法產生分享圖片，請稍後再試或長按籤詩圖片儲存。");
      })
      .finally(function () {
        if (els.btnShare) els.btnShare.disabled = false;
      });
  }

  function showResult() {
    recalculateScore();
    var key = getResultKey(totalScore);
    setResultImage(key);

    transitionToScreen(screens.quiz, screens.result, function () {
      window.requestAnimationFrame(function () {
        playLogoSlideDownIn();
      });
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
  if (els.btnShare) {
    els.btnShare.addEventListener("click", shareResultCapture);
  }

  resetAnswers();
  setProgress();
  updatePrevButton();
})();
