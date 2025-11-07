const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "jw.png";

const arrowImg = new Image();
arrowImg.src = "arrow.png";

const gameOverScreen = document.getElementById("gameOverScreen");
const finalTime = document.getElementById("finalTime");
const restartBtn = document.getElementById("restartBtn");

let player, arrows, time, gameOver;

function initGame() {
  player = { x: 250, y: 250, size: 20 };
  arrows = [];
  time = 0;
  gameOver = false;
  gameOverScreen.style.display = "none";
}

initGame();

// 마우스로 이동
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  player.x = e.clientX - rect.left;
  player.y = e.clientY - rect.top;
});

//모바일에서 터치로 이동
canvas.addEventListener("touchmove", e => {
  e.preventDefault(); // 화면 스크롤 방지
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0]; // 첫 번째 손가락
  player.x = touch.clientX - rect.left;
  player.y = touch.clientY - rect.top;
}, { passive: false });


// 충돌 판정
function isColliding(p, a) {
  const dx = p.x - a.x;
  const dy = p.y - a.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < p.size + a.size;
}

// 화살 생성
function spawnArrow() {
  const size = 15;
  let x, y;

  // 화면 가장자리에서 랜덤 생성
  const edge = Math.floor(Math.random() * 4);
  if (edge === 0) { // 위
    x = Math.random() * canvas.width;
    y = 0;
  } else if (edge === 1) { // 아래
    x = Math.random() * canvas.width;
    y = canvas.height;
  } else if (edge === 2) { // 왼쪽
    x = 0;
    y = Math.random() * canvas.height;
  } else { // 오른쪽
    x = canvas.width;
    y = Math.random() * canvas.height;
  }

  // 플레이어 방향으로 속도 계산
  const dx = player.x - x;
  const dy = player.y - y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const speed = 5;

  arrows.push({
    x: x,
    y: y,
    dx: (dx / len) * speed,
    dy: (dy / len) * speed,
    size: size
  });
}

// 업데이트
function update() {
  if (gameOver) return;
  time++;

  arrows.forEach(a => {
    a.x += a.dx;
    a.y += a.dy;
    if (isColliding(player, a)) {
      gameOver = true;
      finalTime.textContent = "생존 시간: " + (time/60).toFixed(2) + "초";
      gameOverScreen.style.display = "block";
    }
  });

  // 시간이 지날수록 화살 생성 빈도 증가
  if (time % Math.max(15, 80 - time/10) === 0) spawnArrow();
}

// 그리기
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어
  ctx.drawImage(playerImg, player.x - player.size, player.y - player.size, player.size * 2, player.size * 2);

  // 화살 (회전된 방향으로)
  arrows.forEach(a => {
    const angle = Math.atan2(a.dy, a.dx); // 이동 방향 각도
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(angle);
    ctx.drawImage(arrowImg, -a.size, -a.size, a.size * 2, a.size * 2);
    ctx.restore();
  });

  ctx.save();
  ctx.font = "bold 48px Arial";       // 글씨 크기
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // 연한 검정색
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText((time/60).toFixed(2), canvas.width / 2, canvas.height / 2);
  ctx.restore();

}

// 메인 루프
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// 다시하기 버튼
restartBtn.addEventListener("click", () => {
  initGame();
});




