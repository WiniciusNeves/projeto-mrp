<?php

namespace App\Controllers;

use App\Models\Component;
use App\Core\Request;

class ComponentController {
    private $componentModel;

    /**
     * Construtor que recebe a conexão com o banco de dados.
     *
     * @param \PDO $db Conexão PDO.
     */
    public function __construct(\PDO $db) {
        $this->componentModel = new Component($db);
        // Define que todas as respostas serão JSON
        header('Content-Type: application/json');
    }

    /**
     * Lista todos os componentes do estoque.
     * GET /api/estoque
     */
    public function index() {
        $components = $this->componentModel->getAll();
        echo json_encode(['success' => true, 'data' => $components]);
    }

    /**
     * Cria um novo componente.
     * POST /api/estoque
     */
    public function create() {
        $data = Request::getJsonBody();

        if (!isset($data->name) || !isset($data->stock_quantity)) {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'message' => 'Dados incompletos para criar componente.']);
            return;
        }

        $this->componentModel->name = $data->name;
        $this->componentModel->stock_quantity = $data->stock_quantity;

        if ($this->componentModel->create()) {
            http_response_code(201); // Created
            echo json_encode(['success' => true, 'message' => 'Componente criado com sucesso.']);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(['success' => false, 'message' => 'Não foi possível criar o componente.']);
        }
    }

    /**
     * Atualiza um componente existente (especificamente a quantidade em estoque).
     * PUT /api/estoque/{id} ou PUT /api/estoque (se enviar o ID no corpo)
     */
    public function update($id = null) {
        $data = Request::getJsonBody();

        // Tenta obter o ID da URL se não estiver no corpo, ou do corpo se não estiver na URL
        $componentId = $id ?? ($data->id ?? null);

        if (!$componentId || !isset($data->stock_quantity)) {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'message' => 'ID do componente ou nova quantidade não fornecidos.']);
            return;
        }

        $this->componentModel->id = $componentId;
        $this->componentModel->stock_quantity = $data->stock_quantity;

        if ($this->componentModel->updateStockQuantity()) {
            http_response_code(200); // OK
            echo json_encode(['success' => true, 'message' => 'Estoque do componente atualizado com sucesso.']);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(['success' => false, 'message' => 'Não foi possível atualizar o estoque do componente.']);
        }
    }
    
    // Opcional: obter um componente específico por ID
    public function show($id) {
        $component = $this->componentModel->getById($id);
        if ($component) {
            echo json_encode(['success' => true, 'data' => $component]);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['success' => false, 'message' => 'Componente não encontrado.']);
        }
    }

    // Opcional: deletar um componente
    public function delete($id) {
        $this->componentModel->id = $id;
        if ($this->componentModel->delete()) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Componente excluído com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Não foi possível excluir o componente.']);
        }
    }
}