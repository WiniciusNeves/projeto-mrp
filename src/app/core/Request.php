<?php

namespace App\Core;

class Request {
    /**
     * Retorna o método da requisição HTTP (GET, POST, PUT, DELETE).
     *
     * @return string
     */
    public static function method() {
        return $_SERVER['REQUEST_METHOD'];
    }

    /**
     * Retorna a URI da requisição.
     *
     * @return string
     */
    public static function uri() {
        return parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    }

    /**
     * Retorna os dados JSON do corpo da requisição (útil para POST/PUT de APIs).
     *
     * @return object|null Retorna um objeto JSON decodificado ou null se não houver dados.
     */
    public static function getJsonBody() {
        $input = file_get_contents("php://input");
        return json_decode($input);
    }

    /**
     * Retorna todos os dados da requisição (GET, POST, etc.).
     * Prefira getJsonBody() para requisições JSON.
     *
     * @return array
     */
    public static function all() {
        return $_REQUEST; // Combina GET, POST, e COOKIE
    }
}