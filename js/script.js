window.addEventListener("DOMContentLoaded", () => {
  const foodImages = document.querySelectorAll(".foods img");
  const naochan = document.querySelector(".naochan");
  const meter = document.querySelector(".meter img");
  const btnItadakimasu = document.querySelector(".btn-itadakimasu");
  const btnGochisou = document.querySelector(".btn-gochisou");

  const sounds = {
    itadakimasu: new Audio("sound/voice_itadakimasu.mp3"),
    paku: new Audio("sound/voice_paku.mp3"),
    mogumogu: new Audio("sound/voice_mogu.mp3"),
    gochisousama: new Audio("sound/voice_gochisousama.mp3")
  };

  let eating = false;
  let eatCount = 0;
  let hasStarted = false;

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

  foodImages.forEach(img => {
    img.addEventListener("click", async () => {
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
        }
        eating = false;
      }, 2000);
    });
  });

  btnGochisou.addEventListener("click", () => {
    if (eating) return;
    sounds.gochisousama.play();
    eatCount = 0;
    hasStarted = false;
    meter.src = "ui/meter_0.png";
    naochan.src = "naochan/naochan_normal.png";
    foodImages.forEach(img => (img.style.display = "inline"));
    btnGochisou.style.display = "none";
    btnItadakimasu.style.display = "block";
  });
});
