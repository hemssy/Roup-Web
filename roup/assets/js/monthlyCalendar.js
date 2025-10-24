// 현재 날짜 정보
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let selectedDate = null;

// DOM 요소 가져오기
const calendarButton = document.getElementById("calendarButton");
const calendarModal = document.getElementById("calendarModal");
const closeModal = document.getElementById("closeModal");
const moveButton = document.getElementById("moveButton");

// 모달 열기
calendarButton.addEventListener("click", () => {
    calendarModal.style.display = "flex";
    generateCalendar(currentYear, currentMonth);
});

// 모달 닫기
closeModal.addEventListener("click", () => {
    calendarModal.style.display = "none";
});

// "이동하기" 버튼 클릭 이벤트 수정
moveButton.addEventListener("click", () => {
    if (selectedDate) {
        console.log("[moveButton] 이동 버튼 클릭됨");
        console.log("[moveButton] 선택한 날짜:", selectedDate);

        calendarModal.style.display = "none";

        // 선택된 날짜로 주간 캘린더 생성
        generateWeeklyCalendar(selectedDate);

        // 선택된 날짜의 연도와 월로 year_month 업데이트
        updateYearMonth(selectedDate);

        // reloadMissions() 추가하여 체크리스트 업데이트
        reloadMissions(selectedDate);
    } else {
        alert("날짜를 선택해주세요");
    }
});

// 이전/다음 달 버튼
document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
});

// "오늘로 돌아가기" 버튼 클릭 이벤트
document.getElementById("backToTodayButton").addEventListener("click", () => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식

    // 주간 캘린더와 year_month를 오늘 날짜로 업데이트
    generateWeeklyCalendar(formattedToday);
    updateYearMonth(formattedToday);

    // "오늘로 돌아가기" 버튼 숨기기
    toggleBackToTodayButton(formattedToday);

    // 달력 모달 초기화 (오늘 날짜 기준)
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    generateCalendar(currentYear, currentMonth); // 오늘 날짜 기준으로 달력 재생성
});

// 달력 생성 함수
function generateCalendar(year, month) {
    const modalTitle = document.getElementById("modalTitle");
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = "";

    modalTitle.textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }
    // 날짜 추가
    for (let date = 1; date <= lastDate; date++) {
        const cell = document.createElement("div");
        cell.textContent = date;
        cell.classList.add("calendar-cell");
        
        // 오늘 날짜 표시
        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            date === today.getDate()
        ) {
            cell.classList.add("today");
        }

        // 날짜 선택
        cell.addEventListener("click", () => {
            const previousSelected = document.querySelector(".calendar-cell.selected");
            if (previousSelected) {
                previousSelected.classList.remove("selected");
            }
            cell.classList.add("selected");
            selectedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
        
            console.log("[calendar] 날짜 선택됨:", selectedDate);
        });

        calendarGrid.appendChild(cell);
    }
}