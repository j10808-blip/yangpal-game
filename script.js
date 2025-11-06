let players = ["PLAYER1", "PLAYER2", "PLAYER3", "PLAYER4"];
let turn = 0;
let weights = { "빨": 3, "노": 5, "초": 2, "파": 8, "보": 6 };
let leftWeight = 0;
let rightWeight = 0;

let inventory = {};
players.forEach(p => {
  inventory[p] = { "빨": 2, "노": 2, "초": 2, "파": 2, "보": 2 };
});

function updateUI() {
  document.getElementById("left-pan").innerText = `왼쪽: ${leftWeight}`;
  document.getElementById("right-pan").innerText = `오른쪽: ${rightWeight}`;
  document.getElementById("player").innerText = `${players[turn % 4]} 차례`;
  document.getElementById("inventory").innerText =
    `보유: ${JSON.stringify(inventory[players[turn % 4]])}`;
}

function playTurn(color) {
  const clickSound = document.getElementById("balance-sound");
  clickSound.currentTime = 0;
  clickSound.play();

  let player = players[turn % 4];
  const message = document.getElementById("message");

  if (allUsed()) {
    message.innerText = "모든 플레이어가 광물을 다 썼습니다. 게임 종료!";
    return;
  }

  if (sum(inventory[player]) === 0) {
    message.innerText = `${player}은(는) 광물을 모두 사용했습니다. 다음 플레이어로 넘어갑니다.`;
    turn++;
    updateUI();
    return;
  }

  if (color !== "안올림" && inventory[player][color] === 0) {
    message.innerText = `${color} 광물이 없습니다!`;
    return;
  }

  if (color !== "안올림") {
    inventory[player][color]--;
    if (turn % 2 === 0) leftWeight += weights[color];
    else rightWeight += weights[color];
  }

  animateBalance();
  updateUI();

  if (leftWeight === rightWeight && leftWeight !== 0) {
    message.innerText = " 완벽한 균형!";
    const successSound = document.getElementById("success-sound");
    successSound.currentTime = 0;
    successSound.play();
  } else if (allUsed()) {
    message.innerText = "모든 플레이어가 광물을 다 썼습니다. 게임 종료!";
  } else if (leftWeight > rightWeight) {
    message.innerText = "왼쪽이 더 무겁습니다.";
    turn++;
    updateUI();
  } else if (leftWeight < rightWeight) {
    message.innerText = "오른쪽이 더 무겁습니다.";
    turn++;
    updateUI();
  }
}

function animateBalance() {
  const beam = document.getElementById("beam");
  const leftPan = document.getElementById("left-pan");
  const rightPan = document.getElementById("right-pan");

  beam.classList.add("shake");

  if (leftWeight > rightWeight) {
    beam.style.transform = "rotate(-10deg)";
    leftPan.style.transform = "translateY(20px)";
    rightPan.style.transform = "translateY(-20px)";
  } else if (leftWeight < rightWeight) {
    beam.style.transform = "rotate(10deg)";
    leftPan.style.transform = "translateY(-20px)";
    rightPan.style.transform = "translateY(20px)";
  } else {
    beam.style.transform = "rotate(0deg)";
    leftPan.style.transform = "translateY(0px)";
    rightPan.style.transform = "translateY(0px)";
  }

  setTimeout(() => beam.classList.remove("shake"), 700);
}

function sum(obj) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

function allUsed() {
  return players.every(p => sum(inventory[p]) === 0);
}

updateUI();
