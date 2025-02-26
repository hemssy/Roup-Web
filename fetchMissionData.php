<?php
include 'db.php'; // 데이터베이스 연결

header('Content-Type: application/json');

if (!isset($_GET['date']) || !preg_match("/^\d{4}-\d{2}-\d{2}$/", $_GET['date'])) {
    echo json_encode(["success" => false, "message" => "유효하지 않은 날짜 형식"]);
    exit();
}

$selectedDate = $_GET['date'];
$user_id = 1; // 로그인 기능이 없으므로 user_id=1로 고정

// 특정 날짜의 미션 ID 가져오기
function getMissionId($conn, $selectedDate, $time, $user_id) {
    $stmt = $conn->prepare("SELECT mission_id FROM mission WHERE mission_date = ? AND mission_time = ? AND user_id = ?");
    $stmt->bind_param("sss", $selectedDate, $time, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        return $row['mission_id'];
    } else {
        return null;
    }
}

// 특정 미션 ID에 해당하는 활동 가져오기 (attr_period 추가)
function getMissionActivities($conn, $missionId) {
    if (!$missionId) return [];

    $stmt = $conn->prepare("
        SELECT ma.mission_attr_id, a.attr_name, a.attr_period, ma.complete_flag, a.attr_id
        FROM mission_attr ma
        JOIN attr a ON ma.attr_id = a.attr_id
        WHERE ma.mission_id = ?
    ");
    $stmt->bind_param("i", $missionId);
    $stmt->execute();
    $result = $stmt->get_result();

    $activities = [];
    while ($row = $result->fetch_assoc()) {
        $activities[] = [
            "mission_attr_id" => $row['mission_attr_id'],
            "attr_id" => $row['attr_id'],
            "attr_name" => $row['attr_name'],
            "attr_period" => $row['attr_period'],  // ✅ 추가된 항목
            "complete_flag" => $row['complete_flag']
        ];
    }
    return $activities;
}

$morningActivities = getMissionActivities($conn, getMissionId($conn, $selectedDate, '아침', $user_id));
$eveningActivities = getMissionActivities($conn, getMissionId($conn, $selectedDate, '저녁', $user_id));

echo json_encode(["success" => true, "morning" => $morningActivities, "evening" => $eveningActivities]);

$conn->close();
?>