<?php
header('Content-Type: application/json');
$conn = mysqli_connect('localhost', 'root', '', 'edvin');
mysqli_set_charset($conn, "utf8");