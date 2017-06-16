<?php
include_once('config.php');
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$input = [];
parse_str(file_get_contents('php://input'), $input);
$collection = array_shift($request);

$resource;
switch($collection) {
	case 'shoppinglist':
		include('shoppinglist.php');
		$resource = new ShoppingList($conn, $request, $input);
		break;
	case 'activities':
		include('activities.php');
		$resource = new Activities($conn, $request, $input);
		break;
}

echo json_encode(Array('data' => $resource->$method(), 'debug' => $request));
