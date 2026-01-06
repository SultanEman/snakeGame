const container = document.getElementById('board');
 
const instructionText = document.getElementById('instruction-text');

let score = document.getElementById('user_score');

let snake = [
    {x: 10, y: 10},
]
const gridSize = 20;
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay= 200;
let gameStarted = false;
const highScore = document.getElementById('high_score');
let high_score = 0;

const draw = function(){
    container.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

const setPosition = function(snakePart, segment){
    snakePart.style.gridColumn = segment.x;
    snakePart.style.gridRow = segment.y;
}

const createGameElement = function(tag, className){
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
}

function drawFood(){
    if(gameStarted){
        const element = createGameElement('div', 'food');
        element.textContent = '🍎';
    setPosition(element, food);
    container.appendChild(element);
    }
}

function generateFood(){
    const x  = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x , y};
}

const drawSnake = function(){
    snake.forEach(segment => {
        const snakePart = createGameElement('div', 'item');
        
        setPosition(snakePart, segment);
        container.append(snakePart);
    })
}

function move(){
    const head = {...snake[0]};

    switch(direction){
        case 'right':
            head.x++;
            break;
        
        case 'left':
            head.x--;
            break;

        case 'up':
            head.y--;
            break;

        case 'down':
            head.y++;
            break;
    }

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay)
    }else{
        snake.pop();
    }
}


function startGame(){
    gameStarted = true; // keep track of the running game
    instructionText.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//key press event listener

function handleKeyPress(event){
    if((!gameStarted && event.code === ' Space') || (!gameStarted && event.key === ' ')){
        startGame();
    }else {
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;

            case 'ArrowDown':
                direction = 'down';
                break;

            case 'ArrowLeft':
                direction = 'left';
                break;

            case 'ArrowRight':
                direction = 'right';
                break;
        } 
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    // console.log(gameSpeedDelay) ;
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }
    if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }
    if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }
    if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkCollision(){
    
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for(let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}


function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    container.innerHTML = '';
    document.querySelector('.board').append(instructionText);
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > high_score){
        high_score = currentScore;
        highScore.textContent = high_score.toString().padStart(3, '0');
    }
}