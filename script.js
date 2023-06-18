const gameOverSound = new Audio("gameOver.mp3");
const gameBgSound = new Audio("gameBgSound.mp3");
const snakeEatingSound = new Audio("snakeEatingSound.mp3");
gameBgSound.loop = true;
let inputDir = { x: 0, y: 0 };
let snakeArr = [{ x: 7, y: 10 }];
let food = { x: 4, y: 8 };
let speed = 3;
let lastPainted = 0;
let scoredPoints = 0;
let hiscoredPoints = 0;

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPainted) / 1000 < 1 / speed) {
    return;
  }
  lastPainted = ctime;
  gameEngine();
  score.innerHTML = "Score : " + scoredPoints;
}
function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  if (
    snake[0].x <= 1 ||
    snake[0].x >= 18 ||
    snake[0].y <= 1 ||
    snake[0].y >= 18
  ) {
    return true;
  }
}
function gameEngine() {
  //Collide Condition
  if (isCollide(snakeArr)) {
    gameBgSound.pause();
    gameOverSound.play();
    scoredPoints = 0;
    snakeArr = [{ x: 7, y: 10 }];
    inputDir = { x: 0, y: 0 };
    alert("Game Over");
  }
  //move Snake Body
  if (snakeArr[0].x == food.x && snakeArr[0].y == food.y) {
    snakeEatingSound.play();
    const a = 2;
    const b = 16;
    food.x = Math.round(a + (b - a) * Math.random());
    food.y = Math.round(a + (b - a) * Math.random());
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    scoredPoints += 1;
    if (scoredPoints % 10 == 0 && scoredPoints != 0) speed += 2;

    if (scoredPoints > hiscoreval) {
      hiscoreval = scoredPoints;
      localStorage.setItem("hiscore", JSON.stringify(scoredPoints));
      hiscoreBox.innerHTML = "HiScore : " + hiscoreval;
    }
  }
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  board.innerHTML = "";
  //display Snake Body
  snakeArr.forEach((e, index) => {
    let div = document.createElement("div");
    if (index == 0) {
      div.classList.add("snakeHead");
    } else {
      div.classList.add("snakeBody");
    }
    div.style.gridRowStart = e.y;
    div.style.gridColumnStart = e.x;
    board.append(div);
  });
  //display Food
  let foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  board.append(foodElement);

  if (inputDir.x != 0 || inputDir.y != 0) {
    gameBgSound.play();
  }
}

//getting HIScore from local storage
let hiscore = localStorage.getItem("hiscore");
if (hiscore == null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "HiScore : " + hiscoreval;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", (key) => {
  switch (key.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;
  }
});
let initialTouchX = 0;
let initialTouchY = 0;
let moveTouchX = 0;
let moveTouchY = 0;
window.addEventListener("touchstart", (e) => {
  initialTouchX = e.touches[0].clientX;
  initialTouchY = e.touches[0].clientY;
  console.log(Math.round(initialTouchX), Math.round(initialTouchY));
});
window.addEventListener("touchmove", (e) => {
  moveTouchX = e.changedTouches[0].clientX;
  moveTouchY = e.changedTouches[0].clientY;
  // console.log(moveTouchX,moveTouchY);
  let diffX = initialTouchX - moveTouchX;
  let diffY = initialTouchY - moveTouchY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      console.log("Left Swipe");
      inputDir.x = -1;
      inputDir.y = 0;
    } else {
      console.log("Right Swipe");
      inputDir.x = 1;
      inputDir.y = 0;
    }
  } else {
    if (diffY > 0) {
      console.log("Top Swipe");
      inputDir.x = 0;
      inputDir.y = -1;
    } else {
      console.log("Bottom Swipe");
      inputDir.x = 0;
      inputDir.y = 1;
    }
  }
});
window.addEventListener("touchend", (e) => {
  initialTouchX = 0;
  initialTouchY = 0;
  moveTouchX = 0;
  moveTouchY = 0;
});
let deviceDetails = navigator.userAgent;
let regexp = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexp.test(deviceDetails);
if (isMobileDevice) {
  // console.log('Mobile Device');
  speed = 3;
} else {
  // console.log('PC');
  speed = 10;
}
