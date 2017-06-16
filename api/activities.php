<?php
class Activities {
	function __construct($conn, $request, $input) {
		$this->conn = $conn;
		$this->request = $request;
		$this->input = $input;
	}

	function GET() {
		$date_string = implode('-', $this->request);
		if (count($this->request) === 2) {
			$query = "SELECT * FROM events WHERE `date` LIKE '$date_string%'";
		}
		if (count($this->request) === 3) {
			$query = "SELECT * FROM events WHERE `date` = '$date_string'";
		}
		$result = mysqli_query($this->conn, $query);
		while($row = mysqli_fetch_assoc($result)) {
			$result_array[] = $row;
		}
		if (isset($result_array)) {
			return($result_array);
		}
		else {
			return Array();
		}
	}

	function POST() {
		$query = "INSERT INTO events (title, `time`, `date`, description)
				VALUES ('{$_POST['title']}', '{$_POST['time']}', '{$_POST['date']}', '{$_POST['description']}')";
		if (mysqli_query($this->conn, $query)) {
			http_response_code(201);
		}
		else {
			http_response_code(400);
			return mysqli_error($this->conn);
		}
	}

	function DELETE() {
		$query = "DELETE FROM events WHERE id = '{$this->request[0]}'";
		if (mysqli_query($this->conn, $query)) {
			http_response_code(200);
		}
		else {
			http_response_code(400);
			return mysqli_error($this->conn);
		}
	}
}