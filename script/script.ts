import { Coords } from "../types/types.ts";

const gridSize = 20;

const board: HTMLElement | null = document.getElementById("game-board");
const instructionText: HTMLElement | null =
  document.getElementById("instruction-text");
const logo: HTMLElement | null = document.getElementById("logo");
const scoreText: HTMLElement | null = document.getElementById("score");
const highScoreText: HTMLElement | null = document.getElementById("highScore");

let snake: Coords[] = [{ x: 10, y: 10 }];
let food: Coords = generateFood();
let highScore = 0;
let direction: string = "right";
let gameSpeedDelay: number = 200;
let gameStarted: Boolean;
let gameInterval: number;

function draw() {
  if (board) board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board?.appendChild(snakeElement);
  });
}

function createGameElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string
): HTMLElement {
  const element: HTMLElement = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(element: HTMLElement, position: Coords) {
  element.style.gridColumn = position.x.toString();
  element.style.gridRow = position.y.toString();
}

function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board?.appendChild(foodElement);
}

function generateFood(): Coords {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;

  return { x, y };
}

function move() {
  const head: Coords = { ...snake[0] };
  switch (direction) {
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
    default:
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    console.log("буба");
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleKeyPress(event: KeyboardEvent) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.code === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") direction = "down";
        break;
      case "ArrowRight":
        if (direction !== "left") direction = "right";
        break;
      case "ArrowLeft":
        if (direction !== "right") direction = "left";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore: number = snake.length - 1;
  scoreText.textContent = currentScore.toString();
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString();
  }
  highScoreText.style.display = "block";
}
