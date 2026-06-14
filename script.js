(function () {
  "use strict";

  var QUESTIONS = [
    {
      id: 1,
      text: "早上八點，你拖著疲憊的身軀衝進車廂，車門關閉的瞬間，你發現整個車廂只剩下一個空位。\n\n這時你會看到……",
      options: [
        { label: "把包包直接放在空位的乘客，嘴裡說著：『寶包你經歷風吹日曬雨淋，你值得坐下休息🥺』", weights: { "包豬公": 0.4, "獅咪罵誰": 0.3, "狐臭非為": 0.3 } },
        { label: "眼神有點詭異的老人，看你沒有要坐，立馬飛奔到其空位，快速到像玩大風吹。", weights: { "獅咪罵誰": 0.6, "門心自ven": 0.2, "雞雞喳喳": 0.2 } },
        { label: "直接放棄座位的肌肉怪，用大腿出力像腳下有查克拉。", weights: { "石巴拉西": 0.7, "獅咪罵誰": 0.15, "門心自ven": 0.15 } },
        { label: "站在門口和朋友聊了十五站後都不坐下的乘客。", weights: { "門心自ven": 0.7, "包豬公": 0.15, "雞雞喳喳": 0.15 } },
      ],
    },
    {
      id: 2,
      text: "列車行駛到台北車站，突然湧進一大群乘客，而今天剛好是36度的超級高溫，你感覺空氣開始變得黏稠，車廂彷彿變成一鍋快要爆炸的壓力鍋。\n\n此時你覺得旁邊會是…",
      options: [
        { label: "把包包往外擴張半公尺，將腳翹到101大樓那樣高的怪。", weights: { "包豬公": 0.6, "門心自ven": 0.2, "狐臭非為": 0.2 } },
        { label: "雙手各抓一根扶手，就算人再多也不放棄二頭肌還能發力。", weights: { "石巴拉西": 0.7, "雞雞喳喳": 0.15, "獅咪罵誰": 0.15 } },
        { label: "嘴裡大喊著：『都這麼熱了為什麼不放點音樂嗨起來！』的宿醉乘客。", weights: { "雞雞喳喳": 0.8, "獅咪罵誰": 0.2 } },
        { label: "站在門口不說話，低頭滑手機靠著欄杆的乘客。", weights: { "門心自ven": 0.7, "包豬公": 0.15, "獅咪罵誰": 0.15 } },
      ],
    },
    {
      id: 3,
      text: "就在這時，車廂突然停電，全車暗到不行時\n\n你會聽到……",
      options: [
        { label: "昨天在IG Reels 滑到的超可愛貓貓迷因音樂。", weights: { "雞雞喳喳": 0.7, "狐臭非為": 0.15, "包豬公": 0.15 } },
        { label: "窸窸窣窣的辯論比賽。", weights: { "獅咪罵誰": 0.7, "雞雞喳喳": 0.3 } },
        { label: "捷運把手ㄍㄧㄍㄧㄍㄨㄞㄍㄨㄞ的奇怪聲音。", weights: { "石巴拉西": 0.7, "門心自ven": 0.3 } },
        { label: "從門口穿來的嘻笑打鬧聲。", weights: { "門心自ven": 0.8, "包豬公": 0.2 } },
      ],
    },
    {
      id: 4,
      text: "終於…列車啟動了，但不知道怎麼了，這班車特別的怪，剛啟動沒多久立馬又來個急剎，全車乘客像保齡球瓶一樣向前傾倒。\n\n這時，你覺得你會第一眼看到？",
      options: [
        { label: "利用門口前的欄杆完成了一場超高難度的鋼管舞的乘客。", weights: { "門心自ven": 0.8, "獅咪罵誰": 0.2 } },
        { label: "乘客不小心摔倒後，竟然還幫忙配了罐頭笑聲的手機。", weights: { "雞雞喳喳": 0.8, "狐臭非為": 0.2 } },
        { label: "利用慣性完成一次引體向上的乘客。", weights: { "石巴拉西": 0.8, "雞雞喳喳": 0.2 } },
        { label: "大哭著說：『人沒了可以再投胎，包包摔到很麻煩欸！』的乘客", weights: { "包豬公": 0.7, "狐臭非為": 0.15, "門心自ven": 0.15 } },
      ],
    },
    {
      id: 5,
      text: "此時你真的覺得快受不了了，這班車已經讓你感官過載，撐不下去了！你覺得哪個部分最想讓你下車。",
      options: [
        { label: "一股神秘的濃烈氣味，像梅雨季永遠曬不乾的襪子，或是你死都不肯吃的孜然味。", weights: { "狐臭非為": 1.0 } },
        { label: "一直在做肩頸伸展不斷碰到你的乘客", weights: { "石巴拉西": 0.5, "狐臭非為": 0.5 } },
        { label: "像菜市場一樣此起彼落的吵鬧聲。", weights: { "雞雞喳喳": 0.6, "獅咪罵誰": 0.4 } },
        { label: "看你暈車到不行，但只是直勾勾盯著你的乘客。", weights: { "獅咪罵誰": 0.7, "門心自ven": 0.3 } },
      ],
    },
    {
      id: 6,
      text: "你終於撐到轉乘站。\n\n就在車門打開的瞬間，你發現眼前的人潮根本不是乘客，而是《屍速列車》大型沉浸式體驗活動。\n\n你決定跟著人群一起往外衝。\n\n結果前面突然出現……",
      options: [
        { label: "站在門正中央眼神十分空洞的乘客，他彷彿在思考人生、宇宙與量子力學，這位乘客的狀態彷彿也像薛丁格的貓一樣，要等車門開了才能知道。", weights: { "門心自ven": 0.8, "包豬公": 0.2 } },
        { label: "一邊衝一邊大喊：『年輕人腿不是很好嗎跑那麼慢？』的阿公。", weights: { "獅咪罵誰": 0.8, "石巴拉西": 0.2 } },
        { label: "左右手各勾一個扶手，用核心肌群抵抗人流的人。", weights: { "石巴拉西": 0.8, "門心自ven": 0.2 } },
        { label: "背著超巨大後背包轉身時直接把三個人掃回月台。", weights: { "包豬公": 0.7, "狐臭非為": 0.3 } },
      ],
    },
    {
      id: 7,
      text: "在你下車之後…你發現這時月台廣播突然宣布：本列車即將進行「北捷神人挑戰賽」。請所有乘客展現自己的專長，你認為第一名會是……",
      options: [
        { label: "用手機外放完整追完兩集連續劇的人。", weights: { "雞雞喳喳": 0.8, "門心自ven": 0.2 } },
        { label: "在捷運裡完成一場CrossFit比賽的乘客。", weights: { "石巴拉西": 0.9, "獅咪罵誰": 0.1 } },
        { label: "把禮義廉恥四維八德變成rap在唱的乘客", weights: { "包豬公": 0.9, "狐臭非為": 0.1 } },
        { label: "不管到哪裡總能精準找到座位的乘客。", weights: { "獅咪罵誰": 0.8, "包豬公": 0.2 } },
      ],
    },
    {
      id: 8,
      text: "在經歷了這麼多詭異的事後，你終於刷卡出站，突然，眼前閃過一道金光，有一個北捷之神從天而降，對你說：『孩子，你已完成試煉，現在我將保佑你再也不遇到某種乘客。』\n\n你會選…",
      options: [
        { label: "最喜歡讓包包當左右護法的乘客。", weights: { "包豬公": 1.0 } },
        { label: "『全世界都是我的健身房！連捷運也不放過』的奇怪乘客", weights: { "石巴拉西": 1.0 } },
        { label: "手機永遠聽不到聲音，甚至想接音響，但就是不戴耳機的乘客。", weights: { "雞雞喳喳": 1.0 } },
        { label: "你永遠找不到在哪裡，但他的氣息永遠都在的乘客。", weights: { "狐臭非為": 1.0 } },
        { label: "總是待在車門邊，喜靜不喜動的門神乘客。", weights: { "門心自ven": 1.0 } },
        { label: "把『年輕人現在到底怎麼了？』當起手式的找碴乘客。", weights: { "獅咪罵誰": 1.0 } },
      ],
    },
  ];

  /** 角色順序：平手時取陣列中較前者 */
  var CHARACTER_ORDER = [
    "包豬公",
    "獅咪罵誰",
    "狐臭非為",
    "石巴拉西",
    "門心自ven",
    "雞雞喳喳",
  ];

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
    btnCopyLink: document.getElementById("btn-copy-link"),
    captureArea: document.getElementById("capture-area"),
    hiddenPhotoStudio: document.getElementById("hidden-photo-studio"),
    studioResultImage: document.getElementById("studio-result-image"),
    siteLogo: document.querySelector("#home-title"),
    captureLogo: document.querySelector(".capture-site-logo"),
  };

  var totalQuestions = QUESTIONS.length;
  var currentIndex = 0;
  var characterScores = createEmptyScoreboard();
  var winningCharacter = CHARACTER_ORDER[0];
  /** 每題已選 weights 物件；null 表示尚未作答 */
  var answers = [];
  var swapTimer = null;
  var advanceTimer = null;

  function createEmptyScoreboard() {
    var board = {};
    CHARACTER_ORDER.forEach(function (name) {
      board[name] = 0;
    });
    return board;
  }

  function resetAnswers() {
    answers = new Array(totalQuestions);
    for (var i = 0; i < totalQuestions; i++) {
      answers[i] = null;
    }
  }

  function weightsEqual(a, b) {
    if (!a || !b) return false;
    var keysA = Object.keys(a);
    for (var i = 0; i < keysA.length; i++) {
      var key = keysA[i];
      if (a[key] !== b[key]) return false;
    }
    var keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return true;
  }

  function recalculateScore() {
    characterScores = createEmptyScoreboard();
    for (var i = 0; i < answers.length; i++) {
      var weights = answers[i];
      if (!weights) continue;
      Object.keys(weights).forEach(function (character) {
        if (characterScores[character] !== undefined) {
          characterScores[character] += weights[character];
        }
      });
    }
  }

  function getWinningCharacter() {
    var winner = CHARACTER_ORDER[0];
    var maxScore = characterScores[winner];
    for (var i = 1; i < CHARACTER_ORDER.length; i++) {
      var name = CHARACTER_ORDER[i];
      if (characterScores[name] > maxScore) {
        maxScore = characterScores[name];
        winner = name;
      }
    }
    return winner;
  }

  function getResultImagePath(character) {
    return "image/" + character + ".png";
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
    var savedWeights = answers[currentIndex];

    els.questionIndex.textContent = "題目 " + q.id;
    els.questionText.textContent = q.text;
    els.optionsList.innerHTML = "";

    q.options.forEach(function (opt) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      if (savedWeights !== null && weightsEqual(savedWeights, opt.weights)) {
        btn.classList.add("is-selected");
      }
      btn.textContent = opt.label;
      btn.addEventListener("click", function () {
        onOptionClick(btn, opt.weights);
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

  function onOptionClick(btn, weights) {
    if (advanceTimer) {
      window.clearTimeout(advanceTimer);
      advanceTimer = null;
    }

    var buttons = els.optionsList.querySelectorAll(".option-btn");
    buttons.forEach(function (b) {
      b.disabled = true;
    });
    btn.classList.add("is-selected");

    answers[currentIndex] = weights;
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

  function setResultImage(character) {
    var src = getResultImagePath(character);
    var alt = "你的測驗結果籤詩 — " + character;
    if (els.resultImage) {
      els.resultImage.src = src;
      els.resultImage.alt = alt;
    }
    if (els.studioResultImage) {
      els.studioResultImage.src = src;
      els.studioResultImage.alt = alt;
    }
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
    var studio = document.getElementById("hidden-photo-studio");
    if (!studio) return;
    if (typeof html2canvas !== "function") return;
    if (els.btnShare) els.btnShare.disabled = true;

    waitForCaptureImages(studio).then(function () {
      return html2canvas(studio, {
        width: 800,
        height: 1548,
        useCORS: true,
        allowTaint: true,
        logging: false,
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
      .catch(function (err) {
        console.error(err);
        window.alert("無法產生分享圖片，請稍後再試或長按籤詩圖片儲存。");
      })
      .finally(function () {
        if (els.btnShare) els.btnShare.disabled = false;
      });
  }

  function copyPageLink() {
    var url = window.location.href;

    function onCopySuccess() {
      window.alert("網頁連結已複製！快發給朋友一起測驗吧！");
    }

    function fallbackCopy() {
      var textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        if (document.execCommand("copy")) onCopySuccess();
        else window.alert("無法複製連結，請手動複製網址列。");
      } catch (e) {
        window.alert("無法複製連結，請手動複製網址列。");
      }
      document.body.removeChild(textarea);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(onCopySuccess)
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function showResult() {
    recalculateScore();
    winningCharacter = getWinningCharacter();
    setResultImage(winningCharacter);

    transitionToScreen(screens.quiz, screens.result, function () {
      window.requestAnimationFrame(function () {
        playLogoSlideDownIn();
      });
      els.btnRetry.focus();
    });
  }

  function startQuiz() {
    currentIndex = 0;
    characterScores = createEmptyScoreboard();
    winningCharacter = CHARACTER_ORDER[0];
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
    characterScores = createEmptyScoreboard();
    winningCharacter = CHARACTER_ORDER[0];
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
  if (els.btnCopyLink) {
    els.btnCopyLink.addEventListener("click", copyPageLink);
  }

  resetAnswers();
  setProgress();
  updatePrevButton();
})();
