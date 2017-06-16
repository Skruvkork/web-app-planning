<?php
class ShoppingList {
	function __construct($conn, $request, $input) {
		$this->conn = $conn;
		$this->request = $request;
		$this->input = $input;
	}

	function GET() {
		$query = "SELECT * FROM shopping_list";
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
		$query = "INSERT INTO shopping_list (title, date_added) VALUES ('{$_POST['title']}', CURDATE())";
		if (mysqli_query($this->conn, $query)) {
			http_response_code(201);
		}
		else {
			http_response_code(400);
			return mysqli_error($this->conn);
		}
	}

	function DELETE() {
		$query = "DELETE FROM shopping_list WHERE id = '{$this->request[0]}'";
		if (mysqli_query($this->conn, $query)) {
			http_response_code(200);
		}
		else {
			http_response_code(400);
			return mysqli_error($this->conn);
		}
	}
}