<?php
// db.php 포함
include 'db.php';

// POST 요청 처리
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // 입력값 가져오기
    $attrName = $_POST['missionName'] ?? ''; // 미션 이름
    $selectedTime = $_POST['selectedTime'] ?? ''; // 소요시간
    $userId = 1; // 사용자 ID (테스트용)

    // attr_time은 아침 미션 설정이므로 '아침'으로 고정
    $attrTime = '아침';

    // 소요시간 변환 (문자열 -> 숫자)
    $timeMapping = [
        "5분" => 5,
        "10분" => 10,
        "15분" => 15,
        "30분" => 30,
        "1시간" => 60,
        "1.5시간" => 90
    ];

    $attrPeriod = $timeMapping[$selectedTime] ?? 0;

    // 입력값 검증
    if (empty($attrName) || empty($attrPeriod)) {
        echo "<script>alert('소요시간을 선택해주세요.'); window.history.back();</script>";
        exit;
    }

    // SQL 쿼리 작성
    $query = "INSERT INTO attr (attr_name, attr_period, attr_time, user_id, enter_date) VALUES (?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($query);

    // SQL 쿼리 실행
    $stmt->bind_param("sisi", $attrName, $attrPeriod, $attrTime, $userId);

    if ($stmt->execute()) {
        // 데이터 저장 성공 시 mmsOK.php로 리다이렉트
        header("Location: mmsOK.php");
        exit;
    } else {
        echo "<script>alert('데이터베이스 오류: " . $conn->error . "'); window.history.back();</script>";
    }

    // 연결 종료
    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>마이페이지-미션 설정-아침 미션 설정</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="myMMS.css">
        <!-- ✅ Noto Sans KR 웹폰트 추가 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <div id="header">
            <img src="headerImg.png" width="150" alt="헤더 로고">
        </div>

        <div id="mymmsUpper">
            <div class="mymmsUpper_left">
                <div id="mymmsBackICon">
                    <button class="mmsBackButton" data-url="myMissionSettings.php">
                        <h2><</h2>
                    </button>
                </div>
                <div id="mymmsTitle_text">
                    <h2>아침 미션 설정</h2>
                </div>
            </div>
            <div id="closeIcon">
                <button class="closeButton" data-url="index.php">
                    <img src="closeIcon.png" width="25" alt="닫기 아이콘">
                </button>
            </div>
        </div>
        
        <form action="myMMS.php" method="POST">
            <div id="nameInput">
                <h3>이름</h3>
                <input type="text" id="missionName" name="missionName" required>
            </div>
            <div id="periodInput">
                <h3>소요시간</h3>
                <div class="time-selector">
                    <?php
                    // 소요시간 옵션 생성
                    $timeOptions = ["5분", "10분", "15분", "30분", "1시간", "1.5시간"];
                    foreach ($timeOptions as $time) {
                        echo "<button type='button' class='time-option' data-value='$time'>$time</button>";
                    }
                    ?>
                    <input type="hidden" id="selectedTime" name="selectedTime" required>
                </div>
            </div>

            <div id="addButton">
                <button type="submit" class="addButton">추가</button>
            </div>
        </form>

        <script>
            // 모든 버튼 요소 가져오기
            const timeButtons = document.querySelectorAll('.time-option');
            const selectedTimeInput = document.getElementById('selectedTime');

            timeButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    // 모든 버튼에서 active 클래스 제거
                    timeButtons.forEach((btn) => btn.classList.remove('active'));

                    // 클릭된 버튼에 active 클래스 추가
                    button.classList.add('active');

                    // 버튼의 텍스트 내용을 hidden input에 저장
                    selectedTimeInput.value = button.textContent.trim();
                });
            });

            // 뒤로가기 및 닫기 버튼 처리
            document.querySelectorAll(".mmsBackButton").forEach(button => {
                button.addEventListener("click", () => {
                    const targetUrl = button.getAttribute("data-url");
                    window.location.href = targetUrl;
                });
            });

            document.querySelectorAll(".closeButton").forEach(button => {
                button.addEventListener("click", () => {
                    const targetUrl = button.getAttribute("data-url");
                    window.location.href = targetUrl;
                });
            });
        </script>
    </body>
</html>