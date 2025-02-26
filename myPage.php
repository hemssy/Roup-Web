<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>마이 페이지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="myPageStyle.css">
        <!-- ✅ Noto Sans KR 웹폰트 추가 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    </head>
    
    <body>
        <div id="header">
            <img src="headerImg.png" width="150" alt="헤더 로고">
        </div>

        <div id="myPageUpper">
            <div id="myPageTitle_text">
                <?php
                // PHP로 닉네임을 동적으로 가져옵니다.
                $nickname = "오리"; // 예시로 닉네임을 하드코딩. 실제로는 DB나 세션에서 가져와야 합니다.
                echo "<h2><span class='nickname'>" . $nickname . "</span>님, 안녕하세요</h2>";
                ?>
            </div>
            <div id="closeIcon">
                <button class="closeButton" data-url="index.php">
                    <img src="closeIcon.png" width="25" alt="닫기 아이콘">
                </button>
            </div>
        </div>

        <div id="nicknameChange_text">
            <h3>닉네임 변경</h3>
        </div>
        <div id="missionSettings_text">
            <button class="msButton" data-url="myMissionSettings.php">
                <h3>미션 설정</h3>
            </button>
        </div>
    </body>

    <script>
        // 자바스크립트로 URL 이동 로직 유지
        document.querySelectorAll(".msButton").forEach(button => {
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
</html>