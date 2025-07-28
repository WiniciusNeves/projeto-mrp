<?php

namespace App\Models;

use PDO;

class Component
{
    private $conn;
    private $table_name = "components";

    public $id;
    public $name;
    public $stock_quantity;
    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Get all components from the database.
     *
     * @return array An associative array of all components, with keys 'id', 'name', and 'stock_quantity'.
     */
    public function getAll()
    {
        // Prepare a query to select all components from the database
        $query = "SELECT id, name, stock_quantity FROM " . $this->table_name . " ORDER BY name ASC";
        // Execute the query
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        // Fetch all the results as an associative array
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Gets a component by its ID.
     *
     * @param int $id The ID of the component to retrieve.
     *
     * @return array|false An associative array of the component's data, with keys 'id', 'name', and 'stock_quantity', or false if no component is found.
     */
    public function getById($id)
    {
        // Prepare a query to select a component from the database by its ID
        $query = "SELECT id, name, stock_quantity FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        // Execute the query
        $stmt = $this->conn->prepare($query);
        // Bind the parameter to the query
        $stmt->bindParam(1, $id);
        // Execute the query
        $stmt->execute();
        // Fetch the result as an associative array
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // Return the result, or false if no component is found
        return $row ?: false;
    }

    /**
     * Creates a new component in the database.
     *
     * @return bool Whether the new component was successfully created.
     */
    public function create()
    {
        // Prepare a query to insert a new component into the database
        $query = "INSERT INTO " . $this->table_name . " SET name = :name, stock_quantity = :stock_quantity";
        // Execute the query
        $stmt = $this->conn->prepare($query);

        // Sanitize the input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->stock_quantity = htmlspecialchars(strip_tags($this->stock_quantity, FILTER_SANITIZE_NUMBER_INT));

        // Bind the parameters to the query
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);

        // Execute the query
        if ($stmt->execute()) {
            // Return true if successful
            return true;
        } else {
            // Return false if not
            return false;
        }
    }

    /**
     * Updates the stock quantity of a component in the database.
     *
     * @return bool Whether the update was successful.
     */
    public function updateStockQuantity()
    {
        // Prepare a query to update the stock quantity of a component in the database
        $query = "UPDATE " . $this->table_name . " SET stock_quantity = :stock_quantity WHERE id = :id";
        // Execute the query
        $stmt = $this->conn->prepare($query);

        // Sanitize the input
        $this->stock_quantity = htmlspecialchars(strip_tags($this->stock_quantity, FILTER_SANITIZE_NUMBER_INT));
        $this->id = htmlspecialchars(strip_tags($this->id, FILTER_SANITIZE_NUMBER_INT));

        // Bind the parameters to the query
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);
        $stmt->bindParam(":id", $this->id);

        // Execute the query
        if ($stmt->execute()) {
            // Return true if successful
            return true;
        } else {
            // Return false if not
            return false;
        }
    }

    /**
     * Deletes a component from the database.
     *
     * @return bool Whether the deletion was successful.
     */
    public function delete()
    {
        // Prepare a query to delete a component from the database
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        // Prepare the query
        $stmt = $this->conn->prepare($query);

        // Sanitize the input
        $this->id = htmlspecialchars(strip_tags($this->id, FILTER_SANITIZE_NUMBER_INT));

        // Bind the parameter to the query
        $stmt->bindParam(":id", $this->id);

        // Execute the query
        if ($stmt->execute()) {
            // Return true if successful
            return true;
        } else {
            // Return false if not
            return false;
        }
    }
}
