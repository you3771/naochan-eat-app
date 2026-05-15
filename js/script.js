window.addEventListener("DOMContentLoaded", async () => {
  const naochan = document.querySelector(".naochan");
  const meterDiv = document.querySelector(".meter");
  const btnItadakimasu = document.querySelector(".btn-itadakimasu");
  const btnGochisou = document.querySelector(".btn-gochisou");

  // 食べ物リストは foods.json から自動取得
  // food/ に画像・sound/ に音源を追加してプッシュするだけで自動反映されます
  let ALL_FOODS = [];

  async function loadFoods() {
    const res = await fetch('foods.json');
    const names = await res.json();
    ALL_FOODS = names.map(name => ({
      src: `food/${name}_food.png`,
      alt: name
    }));
  }

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

  // --- メータースロットを5つ生成 ---
  function setupMeter() {
    meterDiv.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const slot = document.createElement("div");
      slot.classList.add("meter-slot");
      meterDiv.appendChild(slot);
    }
  }

  // --- 食べた食材をスロットに追加 ---
  function updateMeter(src) {
    const slots = meterDiv.querySelectorAll(".meter-slot:not(.filled)");
    if (slots.length === 0) return;
    const img = document.createElement("img");
    img.src = src;
    slots[0].appendChild(img);
    slots[0].classList.add("filled");
  }

  // --- ランダムに5つ選んで食べ物エリアを生成 ---
  async function setupFoods() {
    if (ALL_FOODS.length === 0) await loadFoods();
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
  document.querySelector(".foods").addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    if (!hasStarted || eating || eatCount >= 5) return;
    eating = true;

    // 1. 食べ物の名前を読み上げ → 終わったら 2. パク音
    const foodName = img.src.split('/').pop().replace('_food.png', '');
    const nameVoice = new Audio(`sound/${foodName}_voice.mp3`);
    nameVoice.play();

    // onended はiOSで後続のplay()をブロックするため、setTimeoutで代替
    setTimeout(() => {
      sounds.paku.currentTime = 0;
      sounds.paku.play();
      naochan.src = "naochan/naochan_eating.png";
    }, 1500);

    setTimeout(() => {
      naochan.src = "naochan/naochan_normal.png";
      img.style.display = "none";
      eatCount++;
      updateMeter(img.src);
      if (eatCount >= 5) {
        naochan.src = "naochan/naochan_full.png";
        celebrate();
      }
      eating = false;
    }, 2500);
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
  btnGochisou.addEventListener("click", async () => {
    if (eating) return;
    sounds.gochisousama.play();
    eatCount = 0;
    hasStarted = false;
    setupMeter();
    naochan.src = "naochan/naochan_normal.png";
    await setupFoods(); // 新しいランダム5品をセット
    btnGochisou.style.display = "none";
    btnItadakimasu.style.display = "block";
  });

  // --- 初期表示 ---
  setupMeter();
  await setupFoods();
});
