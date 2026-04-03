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

-- Vegetables
('Tomato',       'Vegetable', '🍅', '10–13°C', '85–90%', 10, 'Oct–Mar',    'Store stem-up. Never refrigerate fully ripe tomatoes.'),
('Potato',       'Vegetable', '🥔', '4–7°C',   '85–90%', 60, 'Jan–Mar',    'Store in dark, dry, cool place. Avoid light to prevent greening.'),
('Onion',        'Vegetable', '🧅', '0–4°C',   '65–70%', 90, 'Jan–Apr',    'Store dry with good airflow. Low humidity is critical.'),
('Eggplant',     'Vegetable', '🍆', '10–12°C', '90–95%', 7,  'Year-round', 'Very chilling-sensitive. Keep away from ethylene.'),
('Cucumber',     'Vegetable', '🥒', '10–13°C', '90–95%', 7,  'Year-round', 'Wrap individually. Ethylene sensitive; isolate from ripening fruits.'),
('Cauliflower',  'Vegetable', '🥦', '0–1°C',   '90–95%', 14, 'Nov–Feb',    'Store wrapped to prevent discoloration. Keep very cold.'),
('Cabbage',      'Vegetable', '🥬', '0–1°C',   '90–95%', 21, 'Nov–Feb',    'Remove outer damaged leaves before storage.'),
('Carrot',       'Vegetable', '🥕', '0–1°C',   '90–95%', 28, 'Nov–Feb',    'Remove tops before storage to retain moisture.'),
('Spinach',      'Vegetable', '🥗', '0–2°C',   '95–100%',5,  'Nov–Feb',    'Store in perforated plastic bags. Very perishable.'),
('Green Bean',   'Vegetable', '🫘', '4–8°C',   '90–95%', 7,  'Year-round', 'Blanch before freezing for longer storage.'),
('Bitter Gourd', 'Vegetable', '🫑', '10–12°C', '85–90%', 7,  'Year-round', 'Store in cool and shaded area. Avoid direct sunlight.'),
('Pumpkin',      'Vegetable', '🎃', '10–13°C', '60–70%', 60, 'Year-round', 'Keep stem intact. Store in dry area with good ventilation.');

-- ── Demo Users (bcrypt hash for "pass123") ────────────────
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i
INSERT INTO users (name, email, password_hash, role, location, vehicle_type) VALUES
('Admin User',      'admin@harvest.bd',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'admin',     '',          ''),
('Rahim Uddin',     'rahim@farm.bd',     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'farmer',    'Rajshahi',  ''),
('Sufia Begum',     'sufia@farm.bd',     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'farmer',    'Mymensingh',''),
('Karim Transport', 'karim@trans.bd',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'transport', '',          'Refrigerated Truck'),
('Dhaka Fresh Ltd', 'dhaka@fresh.bd',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'dealer',    'Dhaka',     ''),
('Chittagong Grocers', 'chittagong@fresh.bd', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'dealer', 'Chittagong', '');




-- SAMPLE DATA (password: demo1234)
INSERT INTO users (name, email, password_hash, role, location) VALUES
('Rahim Uddin', 'rahim@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK0i', 'farmer', 'Rajshahi'),
('Karim Transport', 'karim@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK0i', 'transport', 'Dhaka');

-- ── Sample Produce Listings ────────────────────────────────
INSERT INTO produce (farmer_id, farmer_name, name, category, emoji, quantity, unit, harvest_date, location, storage_temp, storage_humidity, fresh_days, storage_tips, status) VALUES
(2, 'Rahim Uddin', 'Mango',   'Fruit',     '🥭', 500,  'kg',    '2026-01-20', 'Rajshahi',   '13–15°C',  '85–90%',  14, 'Store away from ethylene-sensitive produce. Ripen at room temperature.', 'Available'),
(3, 'Sufia Begum', 'Tomato',  'Vegetable', '🍅', 300,  'kg',    '2026-01-22', 'Mymensingh', '10–13°C',  '85–90%',  10, 'Store stem-up. Never refrigerate fully ripe tomatoes.',                'Available'),
(2, 'Rahim Uddin', 'Potato',  'Vegetable', '🥔', 1000, 'kg',    '2026-01-15', 'Rajshahi',   '4–7°C',    '85–90%',  60, 'Store in dark, dry, cool place. Avoid light to prevent greening.',     'Available'),
(3, 'Sufia Begum', 'Cauliflower','Vegetable','🥦',150, 'kg',    '2026-01-25', 'Mymensingh', '0–1°C',    '90–95%',  14, 'Store wrapped to prevent discoloration. Keep very cold.',               'Available');

-- ── Sample Transport Request ──────────────────────────────
INSERT INTO transport_requests (farmer_id, farmer_name, product_id, produce_name, pickup_location, destination, pickup_date, quantity, notes, status) VALUES
(2, 'Rahim Uddin', 1, 'Mango', 'Rajshahi', 'Dhaka Kawran Bazar', '2026-02-01', '500 kg', 'Refrigerated vehicle required. Handle with care.', 'Open');

-- ── Sample Deal ───────────────────────────────────────────
INSERT INTO deals (dealer_id, dealer_name, farmer_id, farmer_name, product_id, produce_name, quantity_requested, offered_price_per_kg, message, status) VALUES
(5, 'Dhaka Fresh Ltd', 2, 'Rahim Uddin', 1, 'Mango', '200 kg', 80.00, 'We are interested in a weekly supply arrangement for the season.', 'Pending');
