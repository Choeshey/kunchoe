const canvas = document.getElementById('game-board');
        const ctx = canvas.getContext('2d');
        const GRID_SIZE = 20;
        const GRID_COUNT = canvas.width / GRID_SIZE;

        let snake = [
            { x: 10, y: 10 }
        ];
        let food = generateFood();
        let dx = 0;
        let dy = 0;
        let score = 0;
        let gameLoop;
        let speed = 100;

        document.addEventListener('keydown', changeDirection);
        document.getElementById('restart-btn').addEventListener('click', restartGame);

        function startGame() {
            if (gameLoop) return;
            gameLoop = setInterval(update, speed);
        }

        function update() {
            // Move snake
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            
            // Check collision with walls
            if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
                gameOver();
                return;
            }

            // Check collision with self
            for (let segment of snake) {
                if (head.x === segment.x && head.y === segment.y) {
                    gameOver();
                    return;
                }
            }

            snake.unshift(head);

            // Check if food is eaten
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                document.getElementById('score').textContent = `Score: ${score}`;
                food = generateFood();
                speed = Math.max(50, speed - 2);
                clearInterval(gameLoop);
                gameLoop = setInterval(update, speed);
            } else {
                snake.pop();
            }

            draw();
        }

        function draw() {
            // Clear canvas
            ctx.fillStyle = '#34495e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw snake
            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? '#e74c3c' : '#2ecc71';
                ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
            });

            // Draw food
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        }

        function changeDirection(event) {
            const LEFT_KEY = 37;
            const RIGHT_KEY = 39;
            const UP_KEY = 38;
            const DOWN_KEY = 40;

            const keyPressed = event.keyCode;
            const goingUp = dy === -1;
            const goingDown = dy === 1;
            const goingRight = dx === 1;
            const goingLeft = dx === -1;

            if (keyPressed === LEFT_KEY && !goingRight) {
                dx = -1;
                dy = 0;
            }
            if (keyPressed === UP_KEY && !goingDown) {
                dx = 0;
                dy = -1;
            }
            if (keyPressed === RIGHT_KEY && !goingLeft) {
                dx = 1;
                dy = 0;
            }
            if (keyPressed === DOWN_KEY && !goingUp) {
                dx = 0;
                dy = 1;
            }
            
            if (dx !== 0 || dy !== 0) startGame();
        }

        function generateFood() {
            while (true) {
                const newFood = {
                    x: Math.floor(Math.random() * GRID_COUNT),
                    y: Math.floor(Math.random() * GRID_COUNT)
                };
                
                // Check if food spawns on snake
                let validPosition = true;
                for (let segment of snake) {
                    if (segment.x === newFood.x && segment.y === newFood.y) {
                        validPosition = false;
                        break;
                    }
                }
                if (validPosition) return newFood;
            }
        }

        function gameOver() {
            clearInterval(gameLoop);
            gameLoop = null;
            document.getElementById('game-over').style.display = 'block';
            document.getElementById('restart-btn').style.display = 'block';
        }

        function restartGame() {
            snake = [{ x: 10, y: 10 }];
            food = generateFood();
            dx = 0;
            dy = 0;
            score = 0;
            speed = 150;
            document.getElementById('score').textContent = `Score: 0`;
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('restart-btn').style.display = 'none';
            draw();
        }

        // Initial draw
        draw();
