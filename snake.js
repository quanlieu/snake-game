const KEY = { ESC: 27, SPACE: 32, UP: 38, RIGHT: 39, DOWN: 40, LEFT: 37 };
const DIRECTION = { UP: 38, RIGHT: 39, DOWN: 40, LEFT: 37 };
var canvasWidth = (canvasHeight = 16);
var zoom = 20;
var delay = 500;
var currentDirection = DIRECTION.RIGHT;
var snake = [];
var emptySpace = []; // for check empty cell
var sx = 4;
var sy = 0;
var foodPos = {};
var timer;
var started;

for (let i = 0; i <= sx; i++) {
  snake.push({ x: i, y: 0 });
}

// create an 2-dimensional array contain all true
for (let i = 0; i < canvasWidth; i++) {
  let arr = [];
  for (let j = 0; j < canvasHeight; j++) {
    arr.push(true);
  }
  emptySpace.push(arr);
}

// place already occupies by the snake become false
for (let i = 0; i <= sx; i++) {
  emptySpace[0][i] = false;
}

const canvas = document.getElementById('snake');
canvas.width = canvasWidth * zoom;
canvas.height = canvasHeight * zoom;
const ctx = canvas.getContext('2d');
ctx.scale(zoom, zoom);
ctx.fillStyle = 'MediumBlue';
ctx.fillRect(0, 0, sx + 1, 1);

// Navigation

function move() {
  var moved = false;
  ctx.fillStyle = 'MediumBlue';
  switch (currentDirection) {
    case DIRECTION.UP:
      moved = moveUp();
      break;
    case DIRECTION.RIGHT:
      moved = moveRight();
      break;
    case DIRECTION.DOWN:
      moved = moveDown();
      break;
    case DIRECTION.LEFT:
      moved = moveLeft();
      break;
  }

  if (moved) {
    const tail = { x: snake[0].x, y: snake[0].y };
    if (foodPos.x !== tail.x || foodPos.y !== tail.y) {
      ctx.fillStyle = 'OldLace';
      ctx.fillRect(tail.x, tail.y, 1, 1);
    }

    emptySpace[sx][sy] = false;
    emptySpace[tail.x][tail.y] = true;

    snake.push({ x: sx, y: sy });

    if (!checkFood(sx, sy)) {
      snake.shift();
    } else {
      makeFood();
    }
    timer = setTimeout(move, delay);
  } else {
    gameOver();
  }
}

function moveUp() {
  if (sy > 0) {
    if (!checkEmptySpace(sx, sy - 1)) return false;
    ctx.fillRect(sx, --sy, 1, 1);
    return true;
  }
  return false; // hit the wall
}

function moveRight() {
  if (sx < canvasWidth - 1) {
    if (!checkEmptySpace(sx + 1, sy)) return false;
    ctx.fillRect(++sx, sy, 1, 1);
    return true;
  }
  return false;
}

function moveDown() {
  if (sy < canvasHeight - 1) {
    if (!checkEmptySpace(sx, sy + 1)) return false;
    ctx.fillRect(sx, ++sy, 1, 1);
    return true;
  }
  return false;
}

function moveLeft() {
  if (sx > 0) {
    if (!checkEmptySpace(sx - 1, sy)) return false;
    ctx.fillRect(--sx, sy, 1, 1);
    return true;
  }
  return false;
}

// Hepler function
function makeFood() {
  // TODO: DO not make food in snake cell
  const x = getRandomInt(0, canvasWidth);
  const y = getRandomInt(0, canvasHeight);
  foodPos = { x, y };
  ctx.fillStyle = 'Crimson';
  ctx.fillRect(x, y, 1, 1);
}

function checkEmptySpace(x, y) {
  return emptySpace[x][y];
}

function checkFood(x, y) {
  if (foodPos.x === x && foodPos.y === y) {
    return true;
  }
  return false;
}

function gameOver() {
  console.log('Game over');
}

function isOppositeDirection(current, next) {
  if (current === KEY.UP && next === KEY.DOWN) {
    return true;
  }
  if (current === KEY.RIGHT && next === KEY.LEFT) {
    return true;
  }
  if (current === KEY.DOWN && next === KEY.UP) {
    return true;
  }
  if (current === KEY.LEFT && next === KEY.RIGHT) {
    return true;
  }
  return false;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Keyboard event handler
document.addEventListener('keydown', onkeydown, false);
function onkeydown(event) {
  if (!started) {
    started = true;
    makeFood();
    move();
  }

  if (isOppositeDirection(currentDirection, event.keyCode)) {
    return;
  }

  var handled = false;
  switch (event.keyCode) {
    case KEY.UP:
      currentDirection = DIRECTION.UP;
      handled = true;
      break;
    case KEY.RIGHT:
      currentDirection = DIRECTION.RIGHT;
      handled = true;
      break;
    case KEY.DOWN:
      currentDirection = DIRECTION.DOWN;
      handled = true;
      break;
    case KEY.LEFT:
      currentDirection = DIRECTION.LEFT;
      handled = true;
      break;
    case KEY.ESC:
      lose();
      handled = true;
      break;
  }

  if (handled) event.preventDefault(); // prevent arrow keys from scrolling the page
}
