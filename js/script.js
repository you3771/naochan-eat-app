window.addEventListener("DOMContentLoaded", () => {
  const foodImages = document.querySelectorAll(".foods img");
  const naochan = document.querySelector(".naochan");
  const meter = document.querySelector(".meter img");
  const button = document.querySelector(".button-wrapper button");

  const sounds = {
    itadakimasu: new Audio("sound/voice_itadakimasu.mp3"),
    paku: new Audio("sound/voice_paku.mp3"),
    mogumogu: new Audio("sound/voice_mogu.mp3"),
    gochisousama: new Audio("sound/voice_gochisousama.mp3")
  };

  let eating = false;
  let eatCount = 0;
  let hasStarted = false; // ← 新規追加：開始フラグ

  // 最初は食べ物のクリックを無効にする
  foodImages.forEach(img => {
    img.addEventListener("click", async () => {
      if (!hasStarted || eating) return;
      eating = true;

      // パク音
      sounds.paku.currentTime = 0;
      await sounds.paku.play();

      // なおちゃんの画像切り替え
      naochan.src = "naochan/naochan_eating.png";

      // モグモグ音（少し待ってから）
      setTimeout(() => {
        sounds.mogumogu.currentTime = 0;
        sounds.mogumogu.play();
      }, 400);

      // モグモグ終了後（仮に2秒後）
      setTimeout(() => {
        naochan.src = "naochan/naochan_normal.png";
        img.style.display = "none";
        eatCount++;
        if (eatCount <= 3) {
          meter.src = `ui/meter_${eatCount}.png`;
        }
        if (eatCount >= 3) {
          naochan.src = "naochan/naochan_full.png";
        }
        eating = false;
      }, 2000);
    });
  });

// なおちゃんをタップしたらスタート！
naochan.addEventListener("click", () => {
  if (hasStarted) return; // 2回以上再生しない
  hasStarted = true;

  // 画像を「いただきます」用に差し替え
  naochan.src = "naochan/naochan_full.png";

  // 音声再生
  sounds.itadakimasu.play();

  // 再生終了後に画像を元に戻す
  sounds.itadakimasu.onended = () => {
    naochan.src = "naochan/naochan_normal.png";
  };
});

  // ごちそうさまボタン
  button.addEventListener("click", () => {
    if (eating) return;
    sounds.gochisousama.play();
    eatCount = 0;
    hasStarted = false; // ← 初期化
    meter.src = "ui/meter_0.png";
    naochan.src = "naochan/naochan_normal.png";
    foodImages.forEach(img => (img.style.display = "inline"));
  });
});
