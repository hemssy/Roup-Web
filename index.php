<?php
// ✅ 오늘 날짜 가져오기
$todayDate = date("Y-m-d");

// ✅ URL에서 `date` 파라미터 확인
if (!isset($_GET['date']) || !preg_match("/^\d{4}-\d{2}-\d{2}$/", $_GET['date'])) {
    // `date` 값이 없거나 잘못된 형식이면 오늘 날짜로 자동 이동
    header("Location: index.php?date=$todayDate");
    exit();
}

// ✅ 선택된 날짜 가져오기 (올바른 형식의 date 값)
$selectedDate = $_GET['date'];
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>메인 페이지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="mainPageStyle.css">
        <!-- ✅ Noto Sans KR 웹폰트 추가 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">

    </head>
    <body>
        <div id="header">
            <img src="headerImg.png" width="150" alt="헤더 로고">
        </div>

        <nav id="navBar">
            <div id="year_month">
                <?php
                    $currentYear = date("Y");
                    $currentMonth = date("n");
                ?>
                <span id="year"><?php echo $currentYear; ?></span>년 
                <span id="month"><?php echo $currentMonth; ?></span>월
            </div>
            <div id="menuIcon">
                <button id="calendarButton">
                    <img src="calendarIcon.png" width="50" alt="캘린더 아이콘">
                </button>
                <button id="settingsButton" data-url="myPage.php">
                    <img src="settingsIcon.png" width="60" alt="설정 아이콘">
                </button>
            </div>
        </nav>

        <div id="weekly-calendar"></div>

        <div id="backToTodayContainer">
            <button id="backToTodayButton">&lt; 오늘로 돌아가기</button>
        </div>

        <div id="mission">
            <?php
            include 'db.php'; // DB 연결

            $selectedDate = isset($_GET['date']) ? $_GET['date'] : date("Y-m-d"); // URL에서 날짜를 가져오고 없으면 오늘 날짜 사용
            $user_id = 1; // 현재 로그인 기능이 없으므로 user_id=1로 고정

            // ✅특정 날짜의 미션 조회 또는 생성 함수
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

            // ✅ 특정 날짜의 아침/저녁 `mission_id` 가져오기
            $morningMissionId = getOrCreateMission($conn, $selectedDate, '아침', $user_id);
            $eveningMissionId = getOrCreateMission($conn, $selectedDate, '저녁', $user_id);

            // ✅ 미션 활동을 조회하는 함수
            function getMissionActivities($conn, $missionId) {
                if (!$missionId) return null;

                $stmt = $conn->prepare("SELECT ma.mission_attr_id, a.attr_name, ma.complete_flag 
                                        FROM mission_attr ma
                                        JOIN attr a ON ma.attr_id = a.attr_id
                                        WHERE ma.mission_id = ?");
                $stmt->bind_param("i", $missionId);
                $stmt->execute();
                return $stmt->get_result();
            }

            $morningResult = getMissionActivities($conn, $morningMissionId);
            $eveningResult = getMissionActivities($conn, $eveningMissionId);
            ?>

            <!-- 아침 체크리스트 -->
            <div class="morning_mission">
                <div id="morning_mission_text">
                    <h2>아침 <span id="morningMissionFlag" class="hidden">미션성공</span></h2>
                </div>
                <div id="morning_checklist">
                    <ul id="morningDropdown" class="hidden"></ul>
                    <!-- ✅ 아침 체크리스트 -->
                    <div id="morningSelectedList">
                        <?php
                        if ($morningResult && $morningResult->num_rows > 0) {
                            while ($row = $morningResult->fetch_assoc()) {
                                $checkedClass = ($row['complete_flag'] == 1) ? 'checked' : ''; // 체크 상태 반영
                                echo "<div class='selected-item'>"; 
                                echo "<div class='circular-checkbox $checkedClass' data-mission-attr-id='{$row['mission_attr_id']}'></div>";
                                echo "<span class='morning-text'>{$row['attr_name']}</span>";
                                echo "<img src='deleteIcon.png' alt='삭제' class='delete-icon' style='display: none;'>"; // ✅ 삭제 버튼 추가
                                echo "</div>";
                            }
                        } else {
                            echo "<p>등록된 아침 미션이 없습니다.</p>";
                        }
                        ?>
                    </div>
                    <button id="morningPlusButton">
                        <img src="plusIcon.png" width="40" alt="+ 아이콘">
                    </button>
                </div>
            </div>

            <!-- 저녁 체크리스트 -->
            <div class="evening_mission">
                <div id="evening_mission_text">
                    <h2>저녁 <span id="eveningMissionFlag" class="hidden">미션성공</span></h2>
                </div>
                <div id="evening_checklist">
                    <ul id="eveningDropdown" class="hidden"></ul>
                    <!-- ✅ 저녁 체크리스트 -->
                    <div id="eveningSelectedList">
                        <?php
                        if ($eveningResult && $eveningResult->num_rows > 0) {
                            while ($row = $eveningResult->fetch_assoc()) {
                                $checkedClass = ($row['complete_flag'] == 1) ? 'checked' : ''; // 체크 상태 반영
                                echo "<div class='selected-item'>";
                                echo "<div class='circular-checkbox $checkedClass' data-mission-attr-id='{$row['mission_attr_id']}'></div>";
                                echo "<span class='evening-text'>{$row['attr_name']}</span>";
                                echo "<img src='deleteIcon.png' alt='삭제' class='delete-icon' style='display: none;'>"; // ✅ 삭제 버튼 추가
                                echo "</div>";
                            }
                        } else {
                            echo "<p>등록된 저녁 미션이 없습니다.</p>";
                        }
                        ?>
                    </div>
                    <button id="eveningPlusButton">
                        <img src="plusIcon.png" width="40" alt="+ 아이콘">
                    </button>
                </div>
            </div>
        </div>

        <?php $conn->close(); ?>

        <div id="calendarModal">
            <div class="modal-content">
                <button class="close-button" id="closeModal">&times;</button>
                <div class="modal-header">
                    <button class="nav-button" id="prevMonth">&lt;</button>
                    <h2 id="modalTitle"></h2>
                    <button class="nav-button" id="nextMonth">&gt;</button>
                </div>
                <div class="calendar-grid" id="calendarGrid"></div>
                <button class="move-button" id="moveButton">이동하기</button>
            </div>
        </div>

        <script src="mainTitle.js"></script>
        <script src="monthlyCalendar.js"></script>
        <script src="weeklyCalendar.js"></script>
        <script src="checklist.js"></script>
        <script>
            document.getElementById("settingsButton").addEventListener("click", () => {
                window.location.href = "myPage.php";
            });

            document.getElementById("calendarButton").addEventListener("click", () => {
                document.getElementById("calendarModal").style.display = "flex";
            });

            document.getElementById("backToTodayButton").addEventListener("click", () => {
                const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식

                // 📌 URL 변경 및 체크리스트 즉시 갱신
                reloadMissions(today);

                // 📌 주간 캘린더와 year_month 업데이트
                generateWeeklyCalendar(today);
                updateYearMonth(today);

                console.log("[backToTodayButton] 오늘 날짜로 이동 완료:", today);
            });


            function reloadMissions(selectedDate) {
                console.log("[reloadMissions] 실행됨 - 선택 날짜:", selectedDate);

                if (!selectedDate || selectedDate.length !== 10) {
                    console.error("[reloadMissions] 유효하지 않은 날짜:", selectedDate);
                    return;
                }

                // URL 변경 (뒤로 가기 기능도 정상 작동하게 설정)
                const newUrl = `index.php?date=${selectedDate}`;
                window.history.pushState({ path: newUrl }, "", newUrl);

                console.log("[reloadMissions] URL 변경 완료:", newUrl);

                // AJAX로 체크리스트 다시 불러오기
                fetchMissionData(selectedDate);
            }
        </script>
    </body>
</html>