<?php
// 데이터베이스 연결 정보
$host = "roup-database.cv0w2oagcvxj.ap-northeast-2.rds.amazonaws.com";
$username = "seoyeon";
$password = "Kimsoel02!";
$dbname = "roup";

// MySQL 연결
$conn = new mysqli($host, $username, $password, $dbname);

// 연결 확인
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

?>