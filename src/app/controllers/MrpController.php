<?php

namespace App\Controllers;

use App\Models\Component;
use App\Core\Request;

class MrpController {
    private $componentModel;

    /**
     * Constructor that initializes the ComponentModel with a database connection.
     *
     * @param \PDO $db PDO database connection.
     */
    public function __construct(\PDO $db) {
        // Initialize the component model with the provided database connection
        $this->componentModel = new Component($db);

        // Set the response content type to JSON
        header('Content-Type: application/json');
    }

    /**
     * Calculate the MRP (Material Requirements Planning) given the quantity of products to be produced.
     *
     * @return void
     */
    public function calculate() {
        $data = Request::getJsonBody();

        if (!isset($data->bikes) || !isset($data->computers)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Quantidade de bicicletas ou computadores não fornecida.']);
            return;
        }

        $bikeQuantity = (int) $data->bikes;
        $computerQuantity = (int) $data->computers;

        if ($bikeQuantity < 0 || $computerQuantity < 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'As quantidades de produção não podem ser negativas.']);
            return;
        }

        /**
         * Bill of Materials (BOM) for the products.
         *
         * @var array $bom
         */
        $bom = [
            'Bicicleta' => [
                'Rodas' => 2,
                'Quadros' => 1,
                'Guidões' => 1,
            ],
            'Computador' => [
                'Gabinetes' => 1,
                'Placas-mãe' => 1,
                'Memórias RAM' => 2,
            ],
        ];

        /**
         * Current stock data retrieved from the database.
         *
         * @var array $currentStockData
         */
        $currentStockData = $this->componentModel->getAll();

        /**
         * Current stock data indexed by component name.
         *
         * @var array $currentStock
         */
        $currentStock = [];
        foreach ($currentStockData as $comp) {
            $currentStock[$comp['name']] = $comp['stock_quantity'];
        }

        /**
         * MRP results, indexed by component name.
         *
         * @var array $mrpResults
         */
        $mrpResults = [];
        $componentsInBom = [];

        foreach ($bom as $productName => $productComponents) {
            $productionQuantity = 0;
            if ($productName === 'Bicicleta') {
                $productionQuantity = $bikeQuantity;
            } elseif ($productName === 'Computador') {
                $productionQuantity = $computerQuantity;
            }

            foreach ($productComponents as $componentName => $requiredPerUnit) {
                if (!isset($mrpResults[$componentName])) {
                    $mrpResults[$componentName] = [
                        'Componente' => $componentName,
                        'Necessario' => 0,
                        'Em Estoque' => $currentStock[$componentName] ?? 0,
                        'A Comprar' => 0,
                    ];
                }

                $neededForProduct = $productionQuantity * $requiredPerUnit;
                $mrpResults[$componentName]['Necessario'] += $neededForProduct;
            }
        }

        foreach ($mrpResults as $componentName => &$data) {
            $toBePurchased = max(0, $data['Necessario'] - $data['Em Estoque']);
            $data['A Comprar'] = $toBePurchased;
        }
        unset($data);

        $output = array_values($mrpResults);

        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $output]);
    }
}


