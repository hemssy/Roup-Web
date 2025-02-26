<?php
include 'db.php'; // 데이터베이스 연결

header('Content-Type: application/json');

if (!isset($_POST['date'], $_POST['time'], $_POST['attr_id'])) {
    echo json_encode(["success" => false, "message" => "필수 데이터 누락"]);
    exit();
}

$selectedDate = $_POST['date'];
$time = $_POST['time'];
$attr_id = $_POST['attr_id'];
$user_id = 1; // 로그인 기능이 없으므로 user_id=1로 고정

function getOrCreateMission($conn, $selectedDate, $time, $user_id) {
    $stmt = $conn->prepare("SELECT mission_id FROM mission WHERE mission_date = ? AND mission_time = ? AND user_id = ?");
    $stmt->bind_param("sss", $selectedDate, $time, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row['mission_id']; // 기존 mission_id 반환
    } else {
        // 미션이 없으면 새로 생성
        $stmt = $conn->prepare("INSERT INTO mission (mission_date, mission_time, user_id, enter_date) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param("sss", $selectedDate, $time, $user_id);
        if ($stmt->execute()) {
            return $stmt->insert_id; // 새로 생성된 mission_id 반환
        } else {
            return null;
        }
    }
}

$missionId = getOrCreateMission($conn, $selectedDate, $time, $user_id);

if (!$missionId) {
    echo json_encode(["success" => false, "message" => "미션 생성 실패"]);
    exit();
}

// 사용자가 직접 추가한 경우에만 중복 체크 없이 저장
$stmt = $conn->prepare("INSERT INTO mission_attr (mission_id, attr_id, attr_order, complete_flag, enter_date) VALUES (?, ?, 0, 0, NOW())");
$stmt->bind_param("ii", $missionId, $attr_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "활동 추가 성공"]);
} else {
    echo json_encode(["success" => false, "message" => "활동 추가 실패"]);
}

$conn->close();
?>