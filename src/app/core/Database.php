<?php

namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private $host = DB_HOST;
    private $name = DB_NAME;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $charset = DB_CHARSET;
    public $conn;

    /**
     * Establishes a connection to the database.
     *
     * @return PDO|null Returns a PDO connection object or null on failure.
     */
    public function connect()
    {
        try {
            // Create a new PDO connection with the specified host, database name and charset
            $this->conn = new PDO("mysql:host=$this->host;dbname=$this->name;charset=$this->charset", $this->user, $this->pass);
            
            // Set PDO error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // Output the error message if connection fails
            echo "Connection failed: " . $e->getMessage();
            
            // Return null in case of failure
            return null;
        }
        
        // Return the established connection
        return $this->conn;
    }
}
