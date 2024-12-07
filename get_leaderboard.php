

<?php
$conn = new mysqli("localhost", "root", "", "snake_game");
$result = $conn->query("SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10");
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>
