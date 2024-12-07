<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="nicknamePrompt">
        <h1>Введите ваш никнейм</h1>
        <input type="text" id="nickname" placeholder="Введите ник...">
        <button onclick="startGame()">Начать игру</button>
    </div>

    <div id="gameContainer">
        <canvas id="zm"></canvas>
        <div id="infoPanel">
            <h3 id="nicknameDisplay"></h3>
            <h3 id="scoreDisplay">Очки: 0</h3>
            <h3>Топ игроков:</h3>
            <ul id="leaderboard"></ul>
        </div>
    </div>

    <script src="js/index.js"></script>
</body>
</html>
