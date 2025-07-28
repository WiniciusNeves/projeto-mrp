-- database/schema.sql
CREATE TABLE components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0
);

-- Dados iniciais (opcional, para testes)
INSERT INTO components (name, stock_quantity) VALUES
('Rodas', 10),
('Quadros', 5),
('Guidões', 10),
('Gabinetes', 2),
('Placas-mãe', 5),
('Memórias RAM', 6);