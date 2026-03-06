CREATE DATABASE IF NOT EXISTS freshnest_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE freshnest_db;

-- TABLE 1: USERS
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(200)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('farmer','transport','dealer') NOT NULL DEFAULT 'farmer',
  location      VARCHAR(150)  DEFAULT '',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: PRODUCE
CREATE TABLE IF NOT EXISTS produce (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id      INT           NOT NULL,
  farmer_name    VARCHAR(150)  NOT NULL,
  name           VARCHAR(100)  NOT NULL,
  category       ENUM('Fruit','Vegetable','Other') NOT NULL DEFAULT 'Other',
  quantity       DECIMAL(10,2) NOT NULL,
  unit           ENUM('kg','ton','pieces','crate') NOT NULL DEFAULT 'kg',
  harvest_date   DATE          NOT NULL,
  location       VARCHAR(150)  NOT NULL,
  storage_temp   VARCHAR(50)   DEFAULT '',
  fresh_days     INT           DEFAULT 0,
  storage_tips   TEXT,
  status         ENUM('Available','Reserved','Sold') NOT NULL DEFAULT 'Available',
  listed_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE 3: TRANSPORT REQUESTS
CREATE TABLE IF NOT EXISTS transport_requests (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id        INT           NOT NULL,
  farmer_name      VARCHAR(150)  NOT NULL,
  produce_name     VARCHAR(100)  NOT NULL,
  pickup_location  VARCHAR(200)  DEFAULT '',
  destination      VARCHAR(200)  NOT NULL,
  quantity         VARCHAR(100)  DEFAULT '',
  pickup_date      DATE,
  notes            TEXT,
  status           ENUM('Open','Accepted','Completed','Cancelled') NOT NULL DEFAULT 'Open',
  assigned_to      INT           DEFAULT NULL,
  transporter_name VARCHAR(150)  DEFAULT NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- SAMPLE DATA (password: demo1234)
INSERT INTO users (name, email, password_hash, role, location) VALUES
('Rahim Uddin', 'rahim@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK0i', 'farmer', 'Rajshahi'),
('Karim Transport', 'karim@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK0i', 'transport', 'Dhaka');