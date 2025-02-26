<?php
include 'db.php'; // ✅ DB 연결

// ✅ POST 데이터 디버깅
var_dump($_POST);

if (!isset($_POST['mission_attr_id']) || !isset($_POST['complete_flag'])) {
    echo json_encode(["success" => false, "message" => "필요한 데이터가 없습니다."]);
    exit();
}

$mission_attr_id = intval($_POST['mission_attr_id']); // 정수 변환
$complete_flag = intval($_POST['complete_flag']); // 0 또는 1 변환

// ✅ SQL 실행
$sql = "UPDATE mission_attr SET complete_flag = ? WHERE mission_attr_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $complete_flag, $mission_attr_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "완료 상태 업데이트 성공"]);
} else {
    echo json_encode(["success" => false, "message" => "DB 업데이트 실패"]);
}

$stmt->close();
$conn->close();
?>