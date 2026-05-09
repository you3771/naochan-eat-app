window.addEventListener("DOMContentLoaded", () => {
  const naochan = document.querySelector(".naochan");
  const meter = document.querySelector(".meter img");
  const btnItadakimasu = document.querySelector(".btn-itadakimasu");
  const btnGochisou = document.querySelector(".btn-gochisou");

  // ======================================================
  // 食べ物リスト：画像を追加する時はここに1行足すだけ！
  // ファイルは food/ フォルダに置いてください。
  // ======================================================
  const ALL_FOODS = [
    { src: "food/blueberry_food.png",   alt: "ブルーベリー" },
    { src: "food/broccoli_food.png",    alt: "ブロッコリー" },
    { src: "food/fish_food.png",        alt: "さかな" },
    { src: "food/nikuman_food.png",     alt: "肉まん" },
    { src: "food/onigiri_food.png",     alt: "おにぎり" },
    { src: "food/orange_food.png",      alt: "オレンジ" },
    { src: "food/takoyaki_food.png",    alt: "たこやき" },
    { src: "food/tamagoyaki_food.png",  alt: "たまごやき" },
    { src: "food/tomato_food.png",      alt: "トマト" },
    { src: "food/udon_food.png",        alt: "うどん" },
    { src: "food/yogurt_food.png",      alt: "ヨーグルト" },
  ];

  const sounds = {
    itadakimasu: new Audio("sound/voice_itadakimasu.mp3"),
    paku:        new Audio("sound/voice_paku.mp3"),
    mogumogu:   new Audio("sound/voice_mogu.mp3"),
    gochisousama: new Audio("sound/voice_gochisousama.mp3"),
    yatta:       new Audio("sound/voice_yatta.mp3")
  };

  let eating = false;
  let eatCount = 0;
  let hasStarted = false;

  // --- ランダムに5つ選んで食べ物エリアを生成 ---
  function setupFoods() {
    const foodsDiv = document.querySelector(".foods");
    foodsDiv.innerHTML = "";

    const shuffled = [...ALL_FOODS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);

    // 1行目：2つ
    const row1 = document.createElement("div");
    row1.classList.add("row");
    selected.slice(0, 2).forEach(food => {
      const img = document.createElement("img");
      img.src = food.src;
      img.alt = food.alt;
      row1.appendChild(img);
    });

    // 2行目：3つ
    const row2 = document.createElement("div");
    row2.classList.add("row");
    selected.slice(2, 5).forEach(food => {
      const img = document.createElement("img");
      img.src = food.src;
      img.alt = food.alt;
      row2.appendChild(img);
    });

    foodsDiv.appendChild(row1);
    foodsDiv.appendChild(row2);
  }

  // --- 食べ物クリック（イベント委譲） ---
  document.querySelector(".foods").addEventListener("click", async (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    if (!hasStarted || eating || eatCount >= 3) return;
    eating = true;

    sounds.paku.currentTime = 0;
    await sounds.paku.play();

    naochan.src = "naochan/naochan_eating.png";

    setTimeout(() => {
      sounds.mogumogu.currentTime = 0;
      sounds.mogumogu.play();
    }, 400);

    setTimeout(() => {
      naochan.src = "naochan/naochan_normal.png";
      img.style.display = "none";
      eatCount++;
      if (eatCount <= 3) {
        meter.src = `ui/meter_${eatCount}.png`;
      }
      if (eatCount >= 3) {
        naochan.src = "naochan/naochan_full.png";
        celebrate();
      }
      eating = false;
    }, 2000);
  });

  // --- お祝いアニメーション ---
  function celebrate() {
    sounds.yatta.currentTime = 0;
    sounds.yatta.play();

    const wrapper = document.querySelector(".game-wrapper");
    const items = ["⭐", "🌟", "❤️", "💛", "🎉", "✨", "💖", "🌈"];

    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.classList.add("celebration-item");
        el.textContent = items[Math.floor(Math.random() * items.length)];
        el.style.left = Math.random() * 100 + "%";
        el.style.fontSize = (Math.random() * 24 + 16) + "px";
        el.style.animationDuration = (Math.random() * 1.5 + 1.2) + "s";
        wrapper.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
      }, i * 80);
    }
  }

  // --- ゲーム開始 ---
  function startGame() {
    if (hasStarted) return;
    hasStarted = true;
    btnItadakimasu.style.display = "none";
    btnGochisou.style.display = "block";

    naochan.src = "naochan/naochan_full.png";
    sounds.itadakimasu.play();
    sounds.itadakimasu.onended = () => {
      naochan.src = "naochan/naochan_normal.png";
    };
  }

  btnItadakimasu.addEventListener("click", startGame);
  naochan.addEventListener("click", startGame);

  // --- リセット ---
  btnGochisou.addEventListener("click", () => {
    if (eating) return;
    sounds.gochisousama.play();
    eatCount = 0;
    hasStarted = false;
    meter.src = "ui/meter_0.png";
    naochan.src = "naochan/naochan_normal.png";
    setupFoods(); // 新しいランダム5品をセット
    btnGochisou.style.display = "none";
    btnItadakimasu.style.display = "block";
  });

  // --- 初期表示 ---
  setupFoods();
});
