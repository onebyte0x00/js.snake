const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
//const upBtn = document.getElementById('up-btn');
//const downBtn = document.getElementById('down-btn');
//const leftBtn = document.getElementById('left-btn');
//const rightBtn = document.getElementById('right-btn');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;

// Game variables
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

// Initialize game
function initGame() {
    // Create initial snake
    snake = [
        {x: 5, y: 10},
        {x: 4, y: 10},
        {x: 3, y: 10}
    ];
    
    // Place first food
    placeFood();
    
    // Reset score and direction
    score = 0;
    direction = 'right';
    nextDirection = 'right';
    updateScore();
    
    // Set high score display
    highScoreElement.textContent = `High Score: ${highScore}`;
}

// Place food at random position
function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food doesn't appear on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            return placeFood();
        }
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = `High Score: ${highScore}`;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#27ae60';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    // Draw head differently
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
    
    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Game loop
function gameUpdate() {
    // Move snake
    let head = {x: snake[0].x, y: snake[0].y};
    
    // Update direction
    direction = nextDirection;
    
    // Move head based on direction
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score++;
        updateScore();
        
        // Place new food
        placeFood();
        
        // Increase speed slightly every 5 foods
        if (score % 5 === 0) {
            speed += 0.5;
        }
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Draw game
    drawGame();
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    startBtn.textContent = 'Play Again';
    
    // Show game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#e74c3c';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    initGame();
    gameRunning = true;
    startBtn.textContent = 'Restart Game';
    
    // Clear any existing game loop
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    // Start new game loop
    gameLoop = setInterval(gameUpdate, 1000 / speed);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case ' ':
            if (!gameRunning) startGame();
            break;
    }
});

// Button controls
startBtn.addEventListener('click', startGame);
//upBtn.addEventListener('click', () => { if (direction !== 'down') nextDirection = 'up'; });
//downBtn.addEventListener('click', () => { if (direction !== 'up') nextDirection = 'down'; });
//leftBtn.addEventListener('click', () => { if (direction !== 'right') nextDirection = 'left'; });
//rightBtn.addEventListener('click', () => { if (direction !== 'left') nextDirection = 'right'; });

// Initial setup
initGame();
drawGame();
