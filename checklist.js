// 📌 전역 변수 선언
let morningMissionFlag;
let eveningMissionFlag;
let activeDropdown = null; // 현재 열려 있는 드롭다운을 추적
let dropdownInterval = null; // 드롭다운 위치 업데이트 간격 추적
let isDropdownLoading = false; // 🔹 드롭다운 데이터 로딩 중인지 추적

// ✅ 선택된 날짜 가져오기
function getSelectedDate() {
    const selectedDateElement = document.querySelector(".day.today .date");
    const yearElement = document.getElementById("year");
    const monthElement = document.getElementById("month");

    if (!selectedDateElement || !yearElement || !monthElement) {
        console.error("날짜 정보를 찾을 수 없습니다. 기본값 반환.");
        return "2025-01-01"; // 기본값 설정
    }

    const year = yearElement.textContent.replace(/[^0-9]/g, "");
    const month = monthElement.textContent.padStart(2, '0');
    const day = selectedDateElement.textContent.padStart(2, '0');

    return `${year}-${month}-${day}`;
}


// ✅ DOM 로드 후 요소 할당 및 미션 데이터 로드
document.addEventListener("DOMContentLoaded", () => {
    morningMissionFlag = document.getElementById("morningMissionFlag");
    eveningMissionFlag = document.getElementById("eveningMissionFlag");

    console.log("✅ DOM 로드 완료, missionFlag 요소 할당됨.");

    const selectedDate = getSelectedDate();
    fetchMissionData(selectedDate);

    // ✅ 플러스 버튼 이벤트 리스너 등록
    const morningPlusButton = document.getElementById("morningPlusButton");
    const morningDropdown = document.getElementById("morningDropdown");

    const eveningPlusButton = document.getElementById("eveningPlusButton");
    const eveningDropdown = document.getElementById("eveningDropdown");

    if (morningPlusButton) {
        morningPlusButton.addEventListener("click", async () => {
            console.log("🔹 아침 플러스 버튼 클릭됨");
            const activities = await fetchDropdownData("아침");
            console.log("📩 아침 드롭다운 데이터:", activities); // 데이터 디버깅

            if (activities.length === 0) {
                console.warn("🚨 아침 드롭다운 데이터가 없습니다.");
                return;
            }

            renderDropdown(morningDropdown, activities, document.getElementById("morningSelectedList"), "morning-text", morningMissionFlag, morningPlusButton);
        });
    } else {
        console.error("🚨 morningPlusButton 요소를 찾을 수 없습니다.");
    }

    if (eveningPlusButton) {
        eveningPlusButton.addEventListener("click", async () => {
            console.log("🔹 저녁 플러스 버튼 클릭됨");
            const activities = await fetchDropdownData("저녁");
            console.log("📩 저녁 드롭다운 데이터:", activities); // 데이터 디버깅

            if (activities.length === 0) {
                console.warn("🚨 저녁 드롭다운 데이터가 없습니다.");
                return;
            }

            renderDropdown(eveningDropdown, activities, document.getElementById("eveningSelectedList"), "evening-text", eveningMissionFlag, eveningPlusButton);
        });
    } else {
        console.error("🚨 eveningPlusButton 요소를 찾을 수 없습니다.");
    }
});


document.addEventListener("click", function (event) {
    const checkbox = event.target.closest(".circular-checkbox");
    if (!checkbox) return;

    checkbox.classList.toggle("checked");

    const missionAttrId = checkbox.dataset.missionAttrId;
    const completeFlag = checkbox.classList.contains("checked") ? 1 : 0;

    console.log(`[DEBUG] missionAttrId: ${missionAttrId}, completeFlag: ${completeFlag}`);

    if (!missionAttrId || missionAttrId.startsWith("temp_")) {
        console.error("🚨 유효하지 않은 missionAttrId:", missionAttrId);
        return;
    }

    // ✅ 현재 선택된 날짜 가져오기
    const selectedDate = getSelectedDate();

    // ✅ 미션성공 플래그를 즉시 업데이트
    updateMissionFlag(document.getElementById("morningSelectedList"), morningMissionFlag);
    updateMissionFlag(document.getElementById("eveningSelectedList"), eveningMissionFlag);

    // ✅ 서버로 요청 보내기
    fetch("updateCompleteFlag.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `mission_attr_id=${missionAttrId}&complete_flag=${completeFlag}`
    })
    .then(response => response.json())
    .then(data => {
        console.log("[DEBUG] 서버 응답:", data);
        if (!data.success) {
            alert("업데이트 실패: " + data.message);
            checkbox.classList.toggle("checked"); // 실패 시 원래 상태로 복구
        } else {
            console.log("✅ complete_flag 업데이트 성공");

            // ✅ 서버에서 다시 최신 데이터 불러오기
            fetchMissionData(selectedDate);
        }
    })
    .catch(error => console.error("🚨 [updateCompleteFlag] 서버 오류:", error));
});


// ✅ 드롭다운 위치 업데이트 (버튼 아래 고정)
function updateDropdownPosition(button, dropdown) {
    if (!button || !dropdown) return;

    const buttonRect = button.getBoundingClientRect();
    const dropdownTop = buttonRect.bottom + window.scrollY;
    const dropdownLeft = buttonRect.left + window.scrollX;

    console.log(`[DEBUG] 드롭다운 위치 - top: ${dropdownTop}, left: ${dropdownLeft}`);

    dropdown.style.position = "absolute";
    dropdown.style.top = `${dropdownTop}px`;
    dropdown.style.left = `${dropdownLeft}px`;
    dropdown.style.zIndex = "1000";
}


// ✅ 드롭다운 데이터 가져오기
async function fetchDropdownData(attrTime) {
    try {
        const response = await fetch(`fetchDropdownData.php?time=${attrTime}`);
        if (!response.ok) throw new Error("서버 요청 실패");
        return await response.json();
    } catch (error) {
        console.error("🚨 [fetchDropdownData] 데이터 불러오기 오류:", error);
        return [];
    }
}

function showDropdown(button, dropdown) {
    if (!dropdown) return;

    // ✅ 현재 열려 있는 드롭다운이 있으면 닫기
    if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.classList.add("hidden");
        activeDropdown = null;
    }

    // ✅ 드롭다운 열기 (이미 열려 있는 경우 무시)
    if (!dropdown.classList.contains("hidden")) {
        updateDropdownPosition(button, dropdown);
        activeDropdown = dropdown; // ✅ 현재 열린 드롭다운 추적
    }

    // ✅ 기존 `setInterval()` 제거 후 새로 설정
    if (dropdownInterval) clearInterval(dropdownInterval);
    dropdownInterval = setInterval(() => {
        if (dropdown.classList.contains("hidden")) {
            clearInterval(dropdownInterval);
            activeDropdown = null; // ✅ 드롭다운이 닫히면 상태 초기화
        } else {
            updateDropdownPosition(button, dropdown);
        }
    }, 100);
}

function renderDropdown(dropdown, activities, selectedList, textClassName, missionFlag, button) {
    dropdown.innerHTML = "";
    activities.forEach(activity => {
        const listItem = document.createElement("li");
        listItem.textContent = `${activity.attr_name} (${activity.attr_period}분)`;
        listItem.addEventListener("click", () => {
            addSelectedActivity(activity, selectedList, textClassName, missionFlag);
            dropdown.classList.add("hidden"); // ✅ 항목을 선택하면 닫기
            activeDropdown = null; // ✅ 드롭다운 상태 초기화
        });
        dropdown.appendChild(listItem);
    });

    // ✅ 드롭다운이 닫혀 있을 때만 열기
    if (dropdown.classList.contains("hidden")) {
        dropdown.classList.remove("hidden"); // ✅ 드롭다운을 보이게 설정
        showDropdown(button, dropdown); // ✅ 위치 업데이트
        activeDropdown = dropdown; // ✅ 현재 열린 드롭다운 추적
    }
}


function addSelectedActivity(activity, selectedList, textClassName, missionFlag, completeFlag = 0, manualAdd = true) {
    if (!selectedList || !activity || !activity.attr_name || activity.attr_period === undefined) {
        console.error("🚨 [addSelectedActivity] activity 데이터 오류:", activity);
        return;
    }

    const selectedItem = document.createElement("div");
    selectedItem.className = "selected-item";
    selectedItem.style.display = "flex";
    selectedItem.style.alignItems = "center";
    selectedItem.style.gap = "10px";

    // ✅ 체크박스 생성
    const circularCheckbox = document.createElement("div");
    circularCheckbox.className = "circular-checkbox";
    circularCheckbox.setAttribute("data-mission-attr-id", activity.mission_attr_id || "temp_" + Date.now());

    if (completeFlag === 1) {
        circularCheckbox.classList.add("checked");
    }

    // ✅ 활동 이름
    const activityLabel = document.createElement("span");
    activityLabel.textContent = `${activity.attr_name} (${activity.attr_period}분)`;
    activityLabel.className = textClassName;

    // ✅ 삭제 버튼 추가
    const deleteButton = document.createElement("img");
    deleteButton.src = "deleteIcon.png";  // 삭제 아이콘 이미지
    deleteButton.alt = "삭제";
    deleteButton.className = "delete-icon";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.width = "30px";
    deleteButton.style.height = "20px";

    // 삭제 버튼 클릭 시 이벤트 리스너 추가
    deleteButton.addEventListener("click", () => {
        const missionAttrId = circularCheckbox.getAttribute("data-mission-attr-id");

        if (!missionAttrId || missionAttrId.startsWith("temp_")) {
            console.warn("🚨 서버에 저장되지 않은 임시 항목이므로 삭제할 필요 없음.");
            selectedItem.remove();
            return;
        }

        console.log(`🗑️ 삭제 요청 - mission_attr_id: ${missionAttrId}`);

        deleteMissionAttr(missionAttrId)
            .then(success => {
                if (success) {
                    console.log("✅ 삭제 성공, UI에서 제거");
                    selectedItem.remove();
                    updateMissionFlag(selectedList, missionFlag);
                } else {
                    console.error("❌ 삭제 실패");
                }
            });
    });

    // ✅ 요소 추가
    selectedItem.appendChild(circularCheckbox);
    selectedItem.appendChild(activityLabel);
    selectedItem.appendChild(deleteButton); // 삭제 버튼 추가
    selectedList.appendChild(selectedItem);

    // ✅ 미션 성공 여부 업데이트
    updateMissionFlag(selectedList, missionFlag);

    // ✅ 사용자가 직접 추가한 경우 서버에 저장
    if (manualAdd) {
        const selectedDate = getSelectedDate();
        const time = missionFlag === morningMissionFlag ? "아침" : "저녁";
        saveMissionAttr(selectedDate, time, activity.attr_id);
    }
}

async function deleteMissionAttr(missionAttrId) {
    try {
        const response = await fetch("deleteMissionAttr.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `mission_attr_id=${missionAttrId}`
        });

        const data = await response.json();
        if (data.success) {
            console.log(`✅ [deleteMissionAttr] 삭제 성공 - mission_attr_id: ${missionAttrId}`);
            return true;
        } else {
            console.error(`❌ [deleteMissionAttr] 삭제 실패: ${data.message}`);
            return false;
        }
    } catch (error) {
        console.error("🚨 [deleteMissionAttr] 서버 통신 오류:", error);
        return false;
    }
}


// ✅ 서버에서 미션 데이터를 가져와 체크리스트 생성
async function fetchMissionData(selectedDate) {
    console.log("🔄 [fetchMissionData] 미션 데이터 불러오기 시작:", selectedDate);

    try {
        const response = await fetch(`fetchMissionData.php?date=${selectedDate}`);
        const data = await response.json();

        console.log("📩 [fetchMissionData] 서버 응답 데이터:", data);

        if (!data.success) {
            console.error("❌ [fetchMissionData] 미션 데이터 불러오기 실패:", data.message);
            return;
        }

        console.log("✅ [fetchMissionData] 미션 데이터 로드 성공:", data);

        const morningSelectedList = document.getElementById("morningSelectedList");
        const eveningSelectedList = document.getElementById("eveningSelectedList");

        morningSelectedList.innerHTML = "";
        eveningSelectedList.innerHTML = "";

        data.morning.forEach(activity => {
            addSelectedActivity(activity, morningSelectedList, "morning-text", morningMissionFlag, activity.complete_flag, false);
        });

        data.evening.forEach(activity => {
            addSelectedActivity(activity, eveningSelectedList, "evening-text", eveningMissionFlag, activity.complete_flag, false);
        });

        // ✅ 미션성공 플래그를 업데이트 (이 부분 추가!)
        updateMissionFlag(morningSelectedList, morningMissionFlag);
        updateMissionFlag(eveningSelectedList, eveningMissionFlag);

    } catch (error) {
        console.error("🚨 [fetchMissionData] 서버 통신 오류:", error);
    }
}

document.addEventListener("click", function (event) {
    const selectedItem = event.target.closest(".selected-item"); // 클릭한 요소가 selected-item인지 확인
    if (!selectedItem) return;

    console.log("🟢 selectedItem 클릭됨:", selectedItem);

    // 현재 클릭된 selectedItem 내부의 deleteIcon을 가져오기
    const deleteIcon = selectedItem.querySelector(".delete-icon");

    if (deleteIcon) {
        // 클릭된 selectedItem의 deleteIcon을 토글 (보이게 or 숨기게)
        deleteIcon.classList.toggle("visible");
    }

    // 다른 selectedItem의 deleteIcon은 숨기기
    document.querySelectorAll(".selected-item .delete-icon").forEach(icon => {
        if (icon !== deleteIcon) {
            icon.classList.remove("visible");
        }
    });
});


function updateMissionFlag(selectedList, missionFlag) {
    if (!selectedList || !missionFlag) return;

    // ✅ 현재 선택된 날짜 가져오기
    const selectedDate = getSelectedDate();

    const allChecked = Array.from(selectedList.children).every(item =>
        item.querySelector(".circular-checkbox")?.classList.contains("checked")
    );

    // ✅ 모든 항목이 체크되었으면 "미션성공" 표시
    missionFlag.classList.toggle("hidden", !(allChecked && selectedList.children.length > 0));
}

// ✅ 선택한 활동을 RDS 데이터베이스에 저장하는 함수
function saveMissionAttr(date, time, attrId) {
    fetch("saveMissionAttr.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `user_id=1&date=${date}&time=${time}&attr_id=${attrId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("🎉 활동 저장 성공:", data.message);
        } else {
            console.error("❌ 활동 저장 실패:", data.message);
        }
    })
    .catch(error => console.error("🚨 [saveMissionAttr] 서버 오류:", error));
}


// ✅ 드롭다운 토글 기능 (플러스 버튼 클릭 시 닫힘)
function toggleDropdown(event, button, dropdown) {
    event.stopPropagation(); // 🚨 이벤트 버블링 방지

    // ✅ 이미 열린 상태라면 즉시 닫기
    if (activeDropdown === dropdown && !dropdown.classList.contains("hidden")) {
        dropdown.classList.add("hidden");
        activeDropdown = null;
        console.log("드롭다운 닫음 (플러스 버튼 클릭)");
        return;
    }

    // ✅ 다른 드롭다운이 열려 있다면 닫기
    if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.classList.add("hidden");
        activeDropdown = null;
    }

    // ✅ 드롭다운 데이터 로드 후 열기
    const attrTime = dropdown === morningDropdown ? "아침" : "저녁";

    fetchDropdownData(attrTime).then(activities => {
        if (activities.length === 0) {
            console.warn(`🚨 ${attrTime} 활동 데이터 없음.`);
            return;
        }

        renderDropdown(
            dropdown,
            activities,
            dropdown === morningDropdown ? document.getElementById("morningSelectedList") : document.getElementById("eveningSelectedList"),
            dropdown === morningDropdown ? "morning-text" : "evening-text",
            dropdown === morningDropdown ? morningMissionFlag : eveningMissionFlag,
            button
        );

        dropdown.classList.remove("hidden"); // ✅ 드롭다운 열기
        updateDropdownPosition(button, dropdown); // ✅ 위치 업데이트
        activeDropdown = dropdown;
        console.log(`드롭다운 열림 (${attrTime} 플러스 버튼 클릭)`);
    }).catch(error => {
        console.error("🚨 [toggleDropdown] 데이터 로딩 오류:", error);
    });
}

// ✅ 플러스 버튼 클릭 이벤트 리스너 등록
const morningPlusButton = document.getElementById("morningPlusButton");
const morningDropdown = document.getElementById("morningDropdown");

const eveningPlusButton = document.getElementById("eveningPlusButton");
const eveningDropdown = document.getElementById("eveningDropdown");

morningPlusButton.addEventListener("click", function(event) {
    toggleDropdown(event, morningPlusButton, morningDropdown);
});
eveningPlusButton.addEventListener("click", function(event) {
    toggleDropdown(event, eveningPlusButton, eveningDropdown);
});

// ✅ 드롭다운 내부 클릭 시 닫히지 않도록 설정
morningDropdown.addEventListener("click", event => event.stopPropagation());
eveningDropdown.addEventListener("click", event => event.stopPropagation());

// ✅ 페이지 클릭 시 드롭다운 닫기 (플러스 버튼 클릭 시는 제외)
document.addEventListener("click", function (event) {
    if (event.target === morningPlusButton || event.target === eveningPlusButton) {
        return;
    }

    if (activeDropdown) {
        activeDropdown.classList.add("hidden");
        activeDropdown = null;
        console.log("🛑 드롭다운 닫힘 (외부 클릭)");
    }
});

// ✅ 스크롤 및 창 크기 변경 시 드롭다운 위치 업데이트
window.addEventListener("scroll", () => {
    if (activeDropdown) {
        const button = activeDropdown === morningDropdown ? morningPlusButton : eveningPlusButton;
        updateDropdownPosition(button, activeDropdown);
    }
});

window.addEventListener("resize", () => {
    if (activeDropdown) {
        const button = activeDropdown === morningDropdown ? morningPlusButton : eveningPlusButton;
        updateDropdownPosition(button, activeDropdown);
    }
});