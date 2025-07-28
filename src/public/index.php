<?php

require_once dirname(__DIR__) . '/app/Config/config.php';
require_once dirname(__DIR__) . '/vendor/autoload.php';

use App\Core\Router;
use App\Core\Request;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if (Request::method() === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$router = new Router();

$router->get('/api/estoque', 'ComponentController@index');
$router->get('/api/estoque/{id}', 'ComponentController@show');
$router->post('/api/estoque', 'ComponentController@create');
$router->put('/api/estoque/{id}', 'ComponentController@update');
$router->delete('/api/estoque/{id}', 'ComponentController@delete');

$router->post('/api/mrp', 'MrpController@calculate');

$router->dispatch(Request::method(), Request::uri());

