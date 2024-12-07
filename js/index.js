const canvas = document.getElementById("zm");
const ctx = canvas.getContext("2d");
const gridSize = 25;
canvas.width = 500;
canvas.height = 500;

// Инициализация
let snake = [{ x: 250, y: 250 }];
let fruit = { x: randomPosition(), y: randomPosition() };
let dx = gridSize;
let dy = 0;
let score = 0;
let gameInterval;
let nickname = localStorage.getItem("nickname") || null;

// Запуск игры автоматически, если никнейм уже сохранен
window.onload = () => {
    if (nickname) {
        document.getElementById("nicknamePrompt").style.display = "none";
        document.getElementById("gameContainer").style.display = "flex";
        document.getElementById("nicknameDisplay").innerText = `Игрок: ${nickname}`;
        resetGame();
        gameInterval = setInterval(updateGame, 200);
    }
};

// Функция для старта игры
function startGame() {
    const input = document.getElementById("nickname").value.trim();
    if (input) {
        nickname = input;
        localStorage.setItem("nickname", nickname);
    }

    document.getElementById("nicknamePrompt").style.display = "none";
    document.getElementById("gameContainer").style.display = "flex";
    document.getElementById("nicknameDisplay").innerText = `Игрок: ${nickname}`;

    resetGame();
    gameInterval = setInterval(updateGame, 200);
}

// Сброс игры
function resetGame() {
    snake = [{ x: 250, y: 250 }];
    fruit = { x: randomPosition(), y: randomPosition() };
    dx = gridSize;
    dy = 0;
    score = 0;
    document.getElementById("scoreDisplay").innerText = `Очки: ${score}`;
    drawGame();
    hideGameOverButton();
}

// Случайная позиция для фрукта
function randomPosition() {
    return Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
}

// Обновление игры
function updateGame() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Проверяем столкновения
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Если съели фрукт
    if (head.x === fruit.x && head.y === fruit.y) {
        score++;
        document.getElementById("scoreDisplay").innerText = `Очки: ${score}`;
        fruit = { x: randomPosition(), y: randomPosition() };
    } else {
        snake.pop();
    }

    drawGame();
}

// Рисуем игру
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем фрукт
    ctx.fillStyle = "red";
    ctx.fillRect(fruit.x, fruit.y, gridSize, gridSize);

    // Рисуем змейку
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Конец игры
function gameOver() {
    clearInterval(gameInterval);

    // Показ "Гейм Овер"
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Гейм Овер", canvas.width / 2, canvas.height / 2);

    showGameOverButton();
    sendScore(nickname, score);
}

// Отправка очков
function sendScore(nickname, score) {
    fetch("https://maldecur.10001mb.com/save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, score }),
    }).then(updateLeaderboard);
}

// Обновление таблицы лидеров
function updateLeaderboard() {
    fetch("https://maldecur.10001mb.com/get_leaderboard.php")
    .then(res => res.json())
    .then(data => {
        const leaderboard = document.getElementById("leaderboard");
        leaderboard.innerHTML = "";
        data.forEach(player => {
            const li = document.createElement("li");
            li.innerText = `${player.nickname}: ${player.score}`;
            leaderboard.appendChild(li);
        });
    })
    .catch(error => {
        console.error("Ошибка при получении данных:", error);
    });
}

// Периодическое обновление таблицы
setInterval(updateLeaderboard, 5000);

// Управление стрелками
document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -gridSize;
    } else if (event.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = gridSize;
    } else if (event.key === "ArrowLeft" && dx === 0) {
        dx = -gridSize;
        dy = 0;
    } else if (event.key === "ArrowRight" && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
});

// Показ кнопки "Заново"
function showGameOverButton() {
    const button = document.createElement("button");
    button.id = "restartButton";
    button.innerText = "Заново";
    button.style.position = "absolute";
    button.style.top = "50%";
    button.style.left = "50%";
    button.style.transform = "translate(-50%, -50%)";
    button.style.padding = "10px 20px";
    button.style.fontSize = "20px";
    button.style.backgroundColor = "#333";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    document.body.appendChild(button);

    button.onclick = () => {
        document.body.removeChild(button);
        resetGame();
        gameInterval = setInterval(updateGame, 200);
    };
}

// Убираем кнопку "Заново", если она есть
function hideGameOverButton() {
    const button = document.getElementById("restartButton");
    if (button) {
        document.body.removeChild(button);
    }
}
