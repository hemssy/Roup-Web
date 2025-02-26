<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>마이페이지-미션 설정</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="myMissionSettingsStyle.css">
        <!-- ✅ Noto Sans KR 웹폰트 추가 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <div id="header">
            <img src="headerImg.png" width="150" alt="헤더 로고">
        </div>

        <div id="mymsUpper">
            <div class="mymsUpper_left">
                <div id="mymsBackICon">
                    <button class="msBackButton" data-url="myPage.php">
                        <h2><</h2>
                    </button>
                </div>
                <div id="mymsTitle_text">
                    <h2>미션 설정</h2>
                </div>
            </div>
            <div id="closeIcon">
                <button class="closeButton" data-url="index.php">
                    <img src="closeIcon.png" width="25" alt="닫기 아이콘">
                </button>
            </div>
        </div>

        <div id="morning_mission_wrapper">
            <h3 id="morning_toggle">아침</h3>
            <div id="morning_mission" class="hidden">
                <ul id="morning_list">
                    <?php
                    // RDS 데이터베이스 연결
                    include 'db.php';

                    // '아침' 미션 데이터 가져오기
                    $sql = "SELECT attr_name, attr_period FROM attr WHERE attr_time = '아침'";
                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            $period = $row['attr_period'] == 60 ? "1시간" : ($row['attr_period'] == 90 ? "1.5시간" : $row['attr_period'] . "분");
                            echo "<li>" . htmlspecialchars($row['attr_name']) . " (" . $period . ")</li>";
                        }
                    } else {
                        echo "<li>등록된 아침 미션이 없습니다.</li>";
                    }
                    ?>
                </ul>
                <button class="morningPlusButton" data-url="myMMS.php">
                    <img src="plusIcon.png" width="40" alt="+ 아이콘">
                </button>
            </div>
        </div>

        <div id="evening_mission_wrapper">
            <h3 id="evening_toggle">저녁</h3>
            <div id="evening_mission" class="hidden">
                <ul id="evening_list">
                    <?php
                    // '저녁' 미션 데이터 가져오기
                    $sql = "SELECT attr_name, attr_period FROM attr WHERE attr_time = '저녁'";
                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            $period = $row['attr_period'] == 60 ? "1시간" : ($row['attr_period'] == 90 ? "1.5시간" : $row['attr_period'] . "분");
                            echo "<li>" . htmlspecialchars($row['attr_name']) . " (" . $period . ")</li>";
                        }
                    } else {
                        echo "<li>등록된 저녁 미션이 없습니다.</li>";
                    }

                    // 연결 종료
                    $conn->close();
                    ?>
                </ul>
                <button class="eveningPlusButton" data-url="myEMS.php">
                    <img src="plusIcon.png" width="40" alt="+ 아이콘">
                </button>
            </div>
        </div>
    </body>
    <script src="myMS.js"></script>
    <script>
        // 버튼 클릭 시 페이지 이동
        document.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                const targetUrl = button.getAttribute("data-url");
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            });
        });
    </script>
</html>