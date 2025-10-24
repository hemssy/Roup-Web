// 요일 배열
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

// 특정 날짜를 입력받아 주간 달력을 생성하는 함수
// 입력받은 날짜(inputDate)를 기준으로 해당 주의 날짜를 계산하고, 화면에 표시합니다.
function generateWeeklyCalendar(inputDate) {
    // new Date(inputDate)로 문자열을 Date 객체로 변환한다.
    const selectedDate = new Date(inputDate); // 예: '2025-01-16'
    //	유효하지 않은 날짜 형식이면 에러 메시지를 출력하고 실행을 중단합니다.
    if (isNaN(selectedDate.getTime())) {
        console.error("유효하지 않은 날짜 형식입니다. 올바른 형식: 'YYYY-MM-DD'");
        return;
    }

    //selectedDate.getDay()로 입력된 날짜의 요일(0: 일요일 ~ 6: 토요일)을 가져온다.
    const dayOfWeek = selectedDate.getDay(); 

    // firstDayOfWeek는 주의 첫날을 계산: 입력 날짜에서 요일 값을 빼서 해당 주의 일요일로 설정한다.
    const firstDayOfWeek = new Date(selectedDate);
    firstDayOfWeek.setDate(selectedDate.getDate() - dayOfWeek);

    // 주간 캘린더를 렌더링할 HTML 요소(id="weekly-calendar")를 가져온다.
    const calendarContainer = document.getElementById("weekly-calendar");

    // 기존 내용을 제거한다.
    calendarContainer.innerHTML = "";

    // 이번 주의 날짜 추가
    // 일요일부터 토요일까지 반복한다.
    for (let i = 0; i < 7; i++) {
        //currentDate는 firstDayofWeek를 복사해, 하루씩 더하면서 요일별 날짜를 생성한다.
        const currentDate = new Date(firstDayOfWeek);
        currentDate.setDate(firstDayOfWeek.getDate() + i);

        const day = currentDate.getDate(); // 일(day)만 추출

        //div 요소인 dayElement를 생성하고 클래스 day를 추가한다.
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");

        // 선택된 날짜와 같은 날을 강조
        if (
            currentDate.getDate() === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear()
        ) {
            dayElement.classList.add("today");
        }

        const dayName = document.createElement("span");
        dayName.textContent = daysOfWeek[i]; // 요일 이름

        const date = document.createElement("span");
        date.textContent = day; // 일만 표시
        date.classList.add("date");

        dayElement.appendChild(dayName);
        dayElement.appendChild(date);
        calendarContainer.appendChild(dayElement);
    }

    // "오늘로 돌아가기" 버튼 표시 여부 업데이트
    toggleBackToTodayButton(inputDate);
}

// 페이지 로드 시 실행 (오늘 날짜 기준으로 주간 캘린더 생성)
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    generateWeeklyCalendar(formattedToday);
    updateYearMonth(formattedToday); // 오늘 날짜로 year_month 업데이트
});

// "오늘로 돌아가기" 버튼 클릭 이벤트
document.getElementById("backToTodayButton").addEventListener("click", () => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식

    // 주간 캘린더와 year_month를 오늘 날짜로 업데이트
    generateWeeklyCalendar(formattedToday);
    updateYearMonth(formattedToday);
});

// "오늘로 돌아가기" 버튼의 표시 상태를 관리하는 함수
function toggleBackToTodayButton(selectedDate) {
    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)
    const button = document.getElementById("backToTodayButton");

    if (selectedDate === today) {
        button.style.display = "none"; // 오늘이면 버튼 숨기기
    } else {
        button.style.display = "inline-block"; // 오늘이 아니면 버튼 표시
    }
}

// year_month를 업데이트하는 함수 (mainTitle.js에서 정의)
function updateYearMonth(inputDate) {
    const selectedDate = new Date(inputDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // 0부터 시작하므로 +1

    document.getElementById("year_month").innerHTML = `
        <span id="year" style="color: #FF9A95;">${year}년</span> 
        <span id="month" style="color: #000000;">${month}</span>월
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("weekly-calendar").addEventListener("click", (event) => {
        const clickedDay = event.target.closest(".day"); // 클릭한 요소가 `.day` 클래스인지 확인
        if (!clickedDay) return;

        // 기존 선택된 날짜에서 `today` 클래스 제거
        document.querySelectorAll(".day").forEach(day => day.classList.remove("today"));

        // 새로 선택한 날짜에 `today` 클래스 추가
        clickedDay.classList.add("today");

        // 선택한 날짜 가져오기
        const selectedDate = getSelectedDate();
        console.log("[주간 캘린더] 선택된 날짜:", selectedDate);

        // ✅ 체크리스트 및 주간 캘린더 업데이트
        reloadMissions(selectedDate);
        generateWeeklyCalendar(selectedDate);
        updateYearMonth(selectedDate);

        // ✅ URL 변경 (뒤로 가기 지원)
        const newUrl = `index.php?date=${selectedDate}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        console.log("[주간 캘린더] URL 변경:", newUrl);
    });
});