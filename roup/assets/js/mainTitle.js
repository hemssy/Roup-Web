// 전달받은 날짜(dateString)를 기반으로 연도와 월을 추출하여 HTML에 업데이트한다.
function updateYearMonth(dateString) {
    // dateString이 존재하면 new Date(dateString)을 사용하여 그 날짜를 Date 객체로 변환한다.
    // 만약 dateString이 없다면 현재 날짜(new Date())를 사용한다.
    const date = dateString ? new Date(dateString) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript에서 getMonth()는 0부터 시작하므로 +1 추가

    // 기존 요소가 있는지 확인 후 값만 변경 (덮어쓰기 X)
    const yearElement = document.getElementById("year");
    const monthElement = document.getElementById("month");

    if (yearElement && monthElement) {
        yearElement.textContent = `${year}`;
        monthElement.textContent = `${month}`;
        console.log(`updateYearMonth 실행됨 - 연도: ${year}, 월: ${month}`);
    } else {
        console.error("`year` 또는 `month` 요소를 찾을 수 없음. index.php에서 확인하세요.");
    }
}

// HTML 문서가 완전히 로드된 후 실행될 코드를 정의
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

    updateYearMonth(formattedToday); // 현재 날짜로 연도 및 월 업데이트
    generateWeeklyCalendar(formattedToday); // 주간 달력 생성
});