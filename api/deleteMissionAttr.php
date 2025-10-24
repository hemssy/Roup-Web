<?php
include 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mission_attr_id = $_POST['mission_attr_id'] ?? '';

    if (!$mission_attr_id) {
        echo json_encode(['success' => false, 'message' => 'mission_attr_id 값이 없습니다.']);
        exit;
    }

    $query = "DELETE FROM mission_attr WHERE mission_attr_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $mission_attr_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => '삭제 실패']);
    }

    $stmt->close();
    $conn->close();
}
?>