<?php
include 'db.php';

$attrTime = $_GET['time'];

$query = "SELECT attr_name, attr_period, attr_id FROM attr WHERE attr_time = ? ORDER BY attr_id ASC";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $attrTime);
$stmt->execute();
$result = $stmt->get_result();

$activities = [];
while ($row = $result->fetch_assoc()) {
    $activities[] = $row;
}

header('Content-Type: application/json');
echo json_encode($activities);
?>