document.addEventListener("DOMContentLoaded", function () {
    // 아침 토글 이벤트
    const morningToggle = document.getElementById("morning_toggle");
    const morningMission = document.getElementById("morning_mission");

    morningToggle.addEventListener("click", function () {
        morningMission.classList.toggle("hidden");
    });

    // 저녁 토글 이벤트
    const eveningToggle = document.getElementById("evening_toggle");
    const eveningMission = document.getElementById("evening_mission");

    eveningToggle.addEventListener("click", function () {
        eveningMission.classList.toggle("hidden");
    });
});