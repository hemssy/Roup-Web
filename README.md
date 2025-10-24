# ROUP
<p align="center">
<img alt="roupLogo" src="https://github.com/user-attachments/assets/bd134022-c3e0-4fb6-b197-d7658ffbf28c">
</p>

# ROUP Web Page v1.0
루틴관리 웹 애플리케이션
> 개발기간:2025.01 ~ 2025.02

## 프로젝트 소개
ROUP는 Routine Opens Up Possibilities의 약자로, 사용자가 아침과 저녁 루틴을 효율적으로 관리할 수 있도록 도와주는 웹 애플리케이션입니다. 마이페이지에서 개인 맞춤 루틴을 설정하고, 메인페이지로 넘어와 날짜별 루틴을 손쉽게 관리할 수 있습니다. 주간 및 월간 캘린더를 통해 매일의 기록 또한 파악 가능하고, 간결한 인터페이스를 제공하여 누구나 편리하게 사용할 수 있습니다. 루프는 AWS EC2 기반으로 운영되며, PHP와 RDS를 통해 데이터를 저장하고 관리합니다. 

## 실행 가이드 🚀
### Requirements
- **PHP 8.0 이상**
- **Git**
  
### Installation
```
$ git clone https://github.com/hemssy/roup.git
$ cd roup

# PHP 내장 서버 실행
$ php -S localhost:8000
```

---
## Stacks 🐈
### Environment
<img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">

### Development
<img src="https://img.shields.io/badge/php-777BB4?style=for-the-badge&logo=php&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/amazonrds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=black"> 

### OS
<img src="https://img.shields.io/badge/linux-FCC624?style=for-the-badge&logo=linux&logoColor=black"> <img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=black">

---
## 화면 구성

|메인 페이지|마이 페이지|
|---|---|
|<img src="https://github.com/user-attachments/assets/92905d21-0017-4bf1-8835-bdaf902ded5a">|<img src="https://github.com/user-attachments/assets/93acfaea-00b5-4558-ac99-039c9a48bdeb">|
|<img src="https://github.com/user-attachments/assets/558817a7-8932-4e9c-970b-0585a2b24ed3">||


---
## 주요 기능 

### ☑️ 날짜별 루틴 체크리스트 작성 가능
- MYSQL DB를 활용하여 날짜별 루틴 정보를 저장하고, 완료 상태를 기록 가능
- JavaScript와 AJAX를 사용하여 루틴 추가 및 완료 상태 변경 시 실시간으로 업데이트
  
### ☑️ 월간 달력 모달/주간 달력을 통한 날짜 이동
- JavaScript를 이용해 월간 달력과 주간 캘린더 동적으로 생성하고 날짜 이동 지원
- AJAX를 활용하여 날짜 이동 시 서버에서 해당 날짜의 루틴 정보를 가져와 갱신함

### ☑️ 마이페이지의 미션 설정 기능
- MYSQL DB를 활용하여 사용자별 맞춤 루틴 저장하고 관리 가능
- JavaScript를 사용해서 선택한 루틴을 동적으로 추가하고, 드롭다운을 통해 사용자가 설정한 루틴을 불러옴 

---
## 디렉토리 구조
```
project_ROUP/
├── README.md
│
├── assets/                # CSS, JS, 이미지 
│   ├── css/
│   │   ├── mainPageStyle.css
│   │   ├── myPageStyle.css
│   │   ├── myMissionSettingsStyle.css
│   │   ├── emsOK.css
│   │   ├── mmsOK.css
│   │   ├── myEMS.css
│   │   └── myMMS.css
│   │
│   ├── js/
│   │   ├── checklist.js
│   │   ├── mainTitle.js
│   │   ├── monthlyCalendar.js
│   │   ├── weeklyCalendar.js
│   │   └── myMS.js
│   │
│   └── img/
│       ├── calendarIcon.png
│       ├── closeIcon.png
│       ├── deleteIcon.png
│       ├── headerImg.png
│       ├── plusIcon.png
│       └── settingsIcon.png
│
├── includes/              # DB 연결
│   └── db.php  
│
├── api/                   # AJAX나 비동기 요청용 PHP 파일들
│   ├── fetchDropdownData.php
│   ├── fetchMissionData.php
│   ├── saveMissionAttr.php
│   ├── updateCompleteFlag.php
│   └── deleteMissionAttr.php
│
├── pages/              # 주요 페이지 (화면 단위)
│   ├── index.php
│   ├── myPage.php
│   ├── myMissionSettings.php
│   ├── myMMS.php
│   ├── myEMS.php
│   ├── mmsOK.php
│   └── emsOK.php
│
└── .gitignore             

```
