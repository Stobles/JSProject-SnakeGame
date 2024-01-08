"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var gridSize = 20;
var board = document.getElementById("game-board");
var instructionText = document.getElementById("instruction-text");
var logo = document.getElementById("logo");
var scoreText = document.getElementById("score");
var highScoreText = document.getElementById("highScore");
var snake = [{ x: 10, y: 10 }];
var food = generateFood();
var highScore = 0;
var direction = "right";
var gameSpeedDelay = 200;
var gameStarted;
var gameInterval;
function draw() {
    if (board)
        board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}
function drawSnake() {
    snake.forEach(function (segment) {
        var snakeElement = createGameElement("div", "snake");
        setPosition(snakeElement, segment);
        board === null || board === void 0 ? void 0 : board.appendChild(snakeElement);
    });
}
function createGameElement(tag, className) {
    var element = document.createElement(tag);
    element.className = className;
    return element;
}
function setPosition(element, position) {
    element.style.gridColumn = position.x.toString();
    element.style.gridRow = position.y.toString();
}
function drawFood() {
    var foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board === null || board === void 0 ? void 0 : board.appendChild(foodElement);
}
function generateFood() {
    var x = Math.floor(Math.random() * gridSize) + 1;
    var y = Math.floor(Math.random() * gridSize) + 1;
    return { x: x, y: y };
}
function move() {
    var head = __assign({}, snake[0]);
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
        gameInterval = setInterval(function () {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }
}
function startGame() {
    gameStarted = true;
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(function () {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}
function handleKeyPress(event) {
    if ((!gameStarted && event.code === "Space") ||
        (!gameStarted && event.code === " ")) {
        startGame();
    }
    else {
        switch (event.key) {
            case "ArrowUp":
                if (direction !== "down")
                    direction = "up";
                break;
            case "ArrowDown":
                if (direction !== "up")
                    direction = "down";
                break;
            case "ArrowRight":
                if (direction !== "left")
                    direction = "right";
                break;
            case "ArrowLeft":
                if (direction !== "right")
                    direction = "left";
                break;
        }
    }
}
document.addEventListener("keydown", handleKeyPress);
function increaseSpeed() {
    console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}
function checkCollision() {
    var head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (var i = 1; i < snake.length; i++) {
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
    var currentScore = snake.length - 1;
    scoreText.textContent = currentScore.toString();
}
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
}
function updateHighScore() {
    var currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString();
    }
    highScoreText.style.display = "block";
}
