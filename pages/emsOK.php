<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>마이페이지-미션 설정-저녁 미션 설정-추가성공</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="emsOK.css">
        <!-- ✅ Noto Sans KR 웹폰트 추가 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <div id="header">
            <img src="headerImg.png" width="150" alt="헤더 로고">
        </div>

        <div id="myemsUpper">
            <div class="myemsUpper_left">
                <div id="myemsBackICon">
                    <button class="emsBackButton" data-url="myMissionSettings.php">
                        <h2><</h2>
                    </button>
                </div>
                <div id="myemsTitle_text">
                    <h2>저녁 미션 설정</h2>
                </div>
            </div>
            <div id="closeIcon">
                <button class="closeButton" data-url="index.php">
                    <img src="closeIcon.png" width="25" alt="닫기 아이콘">
                </button>
            </div>
        </div>
        
        <div class="centerContainer">
            <div id="emsOK_text">
                <h3>입력한 내용이 저장되었습니다!</h3>
            </div>
    
            <div id="backButton">
                <button class="emsOKBackButton" data-url="myMissionSettings.php">
                    돌아가기
                </button>
            </div>
        </div>
        
    </body>
    <script>
        document.querySelectorAll(".emsBackButton").forEach(button => {
            button.addEventListener("click", () => {
                const targetUrl = button.getAttribute("data-url");
                window.location.href = targetUrl;
            });
        });
        
        document.querySelectorAll(".emsOKBackButton").forEach(button => {
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