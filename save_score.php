<?php
$conn = new mysqli("localhost", "root", "", "snake_game");
$data = json_decode(file_get_contents("php://input"), true);
$nickname = $data['nickname'];
$score = $data['score'];

$result = $conn->query("SELECT * FROM leaderboard WHERE nickname = '$nickname'");
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($score > $row['score']) {
        $conn->query("UPDATE leaderboard SET score = $score WHERE nickname = '$nickname'");
    }
} else {
    $stmt = $conn->prepare("INSERT INTO leaderboard (nickname, score) VALUES (?, ?)");
    $stmt->bind_param("si", $nickname, $score);
    $stmt->execute();
}
?>
