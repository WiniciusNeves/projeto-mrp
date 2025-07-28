<?php

namespace App\Core;

use App\Core\Database; // Certifique-se de que a classe Database esteja acessível

class Router {
    private $routes = [];

    /**
     * Adiciona uma rota GET.
     *
     * @param string $path O caminho da URL (ex: '/api/estoque').
     * @param string $controllerAction String no formato 'Controller@method'.
     */
    public function get($path, $controllerAction) {
        $this->routes['GET'][$path] = $controllerAction;
    }

    /**
     * Adiciona uma rota POST.
     *
     * @param string $path O caminho da URL (ex: '/api/estoque').
     * @param string $controllerAction String no formato 'Controller@method'.
     */
    public function post($path, $controllerAction) {
        $this->routes['POST'][$path] = $controllerAction;
    }

    /**
     * Adiciona uma rota PUT.
     *
     * @param string $path O caminho da URL (ex: '/api/estoque/{id}').
     * @param string $controllerAction String no formato 'Controller@method'.
     */
    public function put($path, $controllerAction) {
        $this->routes['PUT'][$path] = $controllerAction;
    }

    /**
     * Adiciona uma rota DELETE.
     *
     * @param string $path O caminho da URL (ex: '/api/estoque/{id}').
     * @param string $controllerAction String no formato 'Controller@method'.
     */
    public function delete($path, $controllerAction) {
        $this->routes['DELETE'][$path] = $controllerAction;
    }

    /**
     * Despacha a requisição para o controller e método corretos.
     *
     * @param string $method O método HTTP da requisição.
     * @param string $uri A URI da requisição.
     */
    public function dispatch($method, $uri) {
        // Remove a barra final se houver, para padronizar
        $uri = rtrim($uri, '/');
        // Adiciona uma barra inicial se não houver (para padronizar)
        if (substr($uri, 0, 1) !== '/') {
            $uri = '/' . $uri;
        }

        // Tenta encontrar uma rota exata
        if (isset($this->routes[$method][$uri])) {
            list($controllerName, $actionName) = explode('@', $this->routes[$method][$uri]);
            $this->callController($controllerName, $actionName, []);
            return;
        }

        // Se não encontrou uma rota exata, tenta com parâmetros (ex: /estoque/{id})
        foreach ($this->routes[$method] as $routePath => $controllerAction) {
            // Converte a rota do roteador para uma regex
            $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '([a-zA-Z0-9_]+)', $routePath);
            $pattern = str_replace('/', '\/', $pattern);
            
            // Se a URI atual corresponde ao padrão da rota
            if (preg_match("/^$pattern$/", $uri, $matches)) {
                array_shift($matches); // Remove o primeiro elemento (a string completa da URI)
                list($controllerName, $actionName) = explode('@', $controllerAction);
                $this->callController($controllerName, $actionName, $matches);
                return;
            }
        }

        // Se nenhuma rota for encontrada
        header("HTTP/1.0 404 Not Found");
        echo json_encode(['error' => '404 Not Found', 'message' => 'Endpoint não encontrado.']);
        exit();
    }

    /**
     * Instancia o controller e chama o método.
     *
     * @param string $controllerName Nome do controlador (ex: 'ComponentController').
     * @param string $actionName Nome do método a ser chamado.
     * @param array $params Parâmetros para o método (vindos da URL).
     */
    private function callController($controllerName, $actionName, $params = []) {
        $controllerClass = "App\\Controllers\\" . $controllerName;

        if (class_exists($controllerClass)) {
            // Conecta ao DB e passa a conexão para o controller
            $database = new Database();
            $db = $database->connect();

            $controller = new $controllerClass($db); // Passa a conexão PDO para o controller

            if (method_exists($controller, $actionName)) {
                // Chama o método do controlador com os parâmetros da URL
                call_user_func_array([$controller, $actionName], $params);
            } else {
                header("HTTP/1.0 405 Method Not Allowed");
                echo json_encode(['error' => '405 Method Not Allowed', 'message' => 'Método do controlador não encontrado.']);
            }
        } else {
            header("HTTP/1.0 500 Internal Server Error"); // Ou 404 se preferir esconder
            echo json_encode(['error' => '500 Internal Server Error', 'message' => 'Classe do controlador não encontrada.']);
        }
    }
}