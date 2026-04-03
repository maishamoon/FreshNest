-- ============================================================
--  FreshNest — MySQL Database Schema
--  Post-Harvest Storage & Logistics Management System
--  Run: mysql -u root -p < database.sql
-- ============================================================

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
  role          ENUM('farmer','transport','dealer','admin') NOT NULL DEFAULT 'farmer',
  location      VARCHAR(150)  DEFAULT '',
  vehicle_type  VARCHAR(150)  DEFAULT '',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

-- TABLE 2: PRODUCE
CREATE TABLE IF NOT EXISTS produce (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id          INT          NOT NULL,
  farmer_name        VARCHAR(150) NOT NULL,
  name               VARCHAR(100) NOT NULL,
  category           ENUM('Fruit','Vegetable','Other') NOT NULL DEFAULT 'Other',
  emoji              VARCHAR(10)  DEFAULT '🌿',
  quantity           DECIMAL(10,2) NOT NULL,
  unit               ENUM('kg','ton','pieces','crate') NOT NULL DEFAULT 'kg',
  harvest_date       DATE         NOT NULL,
  location           VARCHAR(150) NOT NULL,
  storage_temp       VARCHAR(30)  DEFAULT '',
  storage_humidity   VARCHAR(30)  DEFAULT '',
  fresh_days         INT          DEFAULT 7,
  storage_tips       TEXT,
  status             ENUM('Available','Reserved','Sold','Expired') NOT NULL DEFAULT 'Available',
  listed_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmer   (farmer_id),
  INDEX idx_status   (status),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- TABLE 3: TRANSPORT REQUESTS
CREATE TABLE IF NOT EXISTS transport_requests (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  farmer_id        INT          NOT NULL,
  farmer_name      VARCHAR(150) NOT NULL,
  product_id       INT          DEFAULT NULL,
  produce_name     VARCHAR(100) NOT NULL,
  pickup_location  VARCHAR(200) NOT NULL,
  destination      VARCHAR(200) NOT NULL,
  pickup_date      DATE,
  quantity         VARCHAR(100) DEFAULT '',
  notes            TEXT,
  status           ENUM('Open','Accepted','Completed','Cancelled','Failed') NOT NULL DEFAULT 'Open',
  assigned_to      INT          DEFAULT NULL,
  transporter_name VARCHAR(150) DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (product_id)  REFERENCES produce(id) ON DELETE SET NULL,
  INDEX idx_farmer   (farmer_id),
  INDEX idx_assigned (assigned_to),
  INDEX idx_status   (status)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
--  DEALS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deals (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  dealer_id             INT          NOT NULL,
  dealer_name           VARCHAR(150) NOT NULL,
  farmer_id             INT          NOT NULL,
  farmer_name           VARCHAR(150) NOT NULL,
  product_id            INT          DEFAULT NULL,
  produce_name          VARCHAR(100) NOT NULL,
  quantity_requested    VARCHAR(100) DEFAULT '',
  offered_price_per_kg  DECIMAL(10,2) NOT NULL,
  message               TEXT,
  status                ENUM('Pending','Accepted','Declined','Cancelled') NOT NULL DEFAULT 'Pending',
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at          DATETIME     DEFAULT NULL,
  FOREIGN KEY (dealer_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (farmer_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES produce(id) ON DELETE SET NULL,
  INDEX idx_dealer (dealer_id),
  INDEX idx_farmer (farmer_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
--  DELIVERY FAILURES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_failures (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  transporter_id        INT          NOT NULL,
  transporter_name      VARCHAR(150) NOT NULL,
  transport_request_id  INT          NOT NULL,
  produce_name          VARCHAR(100) DEFAULT '',
  route                 VARCHAR(300) DEFAULT '',
  reason                VARCHAR(200) NOT NULL,
  notes                 TEXT,
  alternatives          JSON,
  reported_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transporter_id)       REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (transport_request_id) REFERENCES transport_requests(id) ON DELETE CASCADE,
  INDEX idx_transporter (transporter_id)
) ENGINE=InnoDB;

-- ============================================================
--  SEED DATA
-- ============================================================

-- ── Produce Conditions Reference ──────────────────────────
INSERT INTO produce_conditions (produce_name, category, emoji, storage_temp, storage_humidity, fresh_days, harvest_months, storage_tips) VALUES
-- Fruits
('Mango',        'Fruit', '🥭', '13–15°C', '85–90%', 14, 'May–July',       'Store away from ethylene-sensitive produce. Ripen at room temperature.'),
('Banana',       'Fruit', '🍌', '13–15°C', '85–95%', 7,  'Year-round',     'Never refrigerate unripe bananas. Keep dry and ventilated.'),
('Litchi',       'Fruit', '🍒', '2–5°C',   '90–95%', 5,  'May–June',       'Refrigerate immediately after harvest to retain red color.'),
('Pineapple',    'Fruit', '🍍', '7–10°C',  '85–90%', 10, 'Apr–Aug',        'Store upright. Do not stack. Avoid ethylene exposure.'),
('Guava',        'Fruit', '🍈', '8–10°C',  '85–90%', 7,  'Year-round',     'Wrap individually in tissue paper for longer shelf life.'),
('Papaya',       'Fruit', '🍈', '10–13°C', '85–90%', 7,  'Year-round',     'Harvest at 25% yellow for long-distance transport.'),
('Jackfruit',    'Fruit', '🟡', '11–14°C', '85–90%', 5,  'Jun–Aug',        'Cut jackfruit must be refrigerated and consumed within 3 days.'),
('Watermelon',   'Fruit', '🍉', '10–15°C', '85–90%', 14, 'Apr–Sep',        'Store away from other fruits. Do not refrigerate uncut.'),
('Coconut',      'Fruit', '🥥', '0–2°C',   '80–85%', 30, 'Year-round',     'Remove husks for longer cold storage. Avoid moisture.'),
('Orange',       'Fruit', '🍊', '3–9°C',   '85–90%', 21, 'Nov–Feb',        'Check regularly for mold. Do not wash before storage.'),
('Strawberry',   'Fruit', '🍓', '0–2°C',   '90–95%', 5,  'Dec–Feb',        'Handle with extreme care. Never wash before storage.'),
('Grape',        'Fruit', '🍇', '0–2°C',   '90–95%', 21, 'Dec–Mar',        'Store in original clusters. Avoid temperature fluctuation.'),



-- SAMPLE DATA (password: demo1234)
INSERT INTO users (name, email, password_hash, role, location) VALUES
('Rahim Uddin', 'rahim@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK0i', 'farmer', 'Rajshahi'),
('Karim Transport', 'karim@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK0i', 'transport', 'Dhaka');