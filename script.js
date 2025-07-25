const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// Настройки игры
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 300, y: 300 }];
let food = { x: 0, y: 0 };
let dx = gridSize;
let dy = 0;
let score = 0;
let gameInterval;
let isGameRunning = false;

// Создаем еду
function createFood() {
  food = {
    x: Math.floor(Math.random() * tileCount) * gridSize,
    y: Math.floor(Math.random() * tileCount) * gridSize
  };
  
  // Проверяем, чтобы еда не появилась на змейке
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * tileCount) * gridSize,
      y: Math.floor(Math.random() * tileCount) * gridSize
    };
  }
}

// Рисуем глаза на голове змейки
function drawEyes(x, y) {
  const eyeSize = 6;
  const pupilSize = 2;
  
  // Белки глаз
  ctx.fillStyle = 'white';
  
  if (dx === gridSize) { // Вправо
    ctx.fillRect(x + 12, y + 4, eyeSize, eyeSize);
    ctx.fillRect(x + 12, y + 12, eyeSize, eyeSize);
  } else if (dx === -gridSize) { // Влево
    ctx.fillRect(x + 2, y + 4, eyeSize, eyeSize);
    ctx.fillRect(x + 2, y + 12, eyeSize, eyeSize);
  } else if (dy === -gridSize) { // Вверх
    ctx.fillRect(x + 4, y + 2, eyeSize, eyeSize);
    ctx.fillRect(x + 12, y + 2, eyeSize, eyeSize);
  } else if (dy === gridSize) { // Вниз
    ctx.fillRect(x + 4, y + 12, eyeSize, eyeSize);
    ctx.fillRect(x + 12, y + 12, eyeSize, eyeSize);
  }

  // Зрачки
  ctx.fillStyle = 'black';
  if (dx === gridSize) {
    ctx.fillRect(x + 14, y + 6, pupilSize, pupilSize);
    ctx.fillRect(x + 14, y + 14, pupilSize, pupilSize);
  } else if (dx === -gridSize) {
    ctx.fillRect(x + 4, y + 6, pupilSize, pupilSize);
    ctx.fillRect(x + 4, y + 14, pupilSize, pupilSize);
  } else if (dy === -gridSize) {
    ctx.fillRect(x + 6, y + 4, pupilSize, pupilSize);
    ctx.fillRect(x + 14, y + 4, pupilSize, pupilSize);
  } else if (dy === gridSize) {
    ctx.fillRect(x + 6, y + 14, pupilSize, pupilSize);
    ctx.fillRect(x + 14, y + 14, pupilSize, pupilSize);
  }
}

// Отрисовка игры
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Рисуем змейку
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#2E8B57' : '#4CAF50';
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    ctx.strokeStyle = '#45a049';
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);

    if (index === 0) drawEyes(segment.x, segment.y);
  });

  // Рисуем еду
  ctx.fillStyle = '#f44336';
  ctx.beginPath();
  ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize/2, 0, Math.PI * 2);
  ctx.fill();
}

// Обновление игры
function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Проверка столкновений
  if (
    head.x < 0 || head.x >= canvas.width || 
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

// Управление (стрелки + WASD в любой раскладке)
document.addEventListener('keydown', e => {
  if (!isGameRunning) return;

  // Используем code для независимости от раскладки
  const code = e.code;
  
  // Вверх (стрелка вверх или W в любой раскладке)
  if ((code === 'ArrowUp' || code === 'KeyW') && dy !== gridSize) {
    dx = 0;
    dy = -gridSize;
  }
  // Вниз (стрелка вниз или S в любой раскладке)
  else if ((code === 'ArrowDown' || code === 'KeyS') && dy !== -gridSize) {
    dx = 0;
    dy = gridSize;
  }
  // Влево (стрелка влево или A в любой раскладке)
  else if ((code === 'ArrowLeft' || code === 'KeyA') && dx !== gridSize) {
    dx = -gridSize;
    dy = 0;
  }
  // Вправо (стрелка вправо или D в любой раскладке)
  else if ((code === 'ArrowRight' || code === 'KeyD') && dx !== -gridSize) {
    dx = gridSize;
    dy = 0;
  }
});

// Завершение игры
function gameOver() {
  clearInterval(gameInterval);
  isGameRunning = false;
  alert(`Игра окончена! Счёт: ${score}`);
}

// Старт игры
startBtn.addEventListener('click', () => {
  if (isGameRunning) return;
  isGameRunning = true;
  score = 0;
  scoreElement.textContent = score;
  snake = [{ x: 300, y: 300 }];
  dx = gridSize;
  dy = 0;
  createFood();
  gameInterval = setInterval(() => {
    update();
    draw();
  }, 100);
});

// Сброс игры
resetBtn.addEventListener('click', () => {
  clearInterval(gameInterval);
  isGameRunning = false;
  score = 0;
  scoreElement.textContent = score;
  snake = [{ x: 300, y: 300 }];
  dx = gridSize;
  dy = 0;
  createFood();
  draw();
});

// Инициализация
createFood();
draw();