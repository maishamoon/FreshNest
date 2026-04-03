const mysql = require('mysql2/promise');

const CREATE_TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
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
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS produce (
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
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS transport_requests (
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
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS deals (
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
  ) ENGINE=InnoDB`,

  `CREATE TABLE IF NOT EXISTS delivery_failures (
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
  ) ENGINE=InnoDB`
];

const SEED_DATA = [
  `INSERT IGNORE INTO users (name, email, password_hash, role, location, vehicle_type) VALUES
  ('Admin User',      'admin@harvest.bd',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'admin',     '',          ''),
  ('Rahim Uddin',     'rahim@farm.bd',     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'farmer',    'Rajshahi',  ''),
  ('Sufia Begum',     'sufia@farm.bd',     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'farmer',    'Mymensingh',''),
  ('Karim Transport', 'karim@trans.bd',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'transport', '',          'Refrigerated Truck'),
  ('Dhaka Fresh Ltd', 'dhaka@fresh.bd',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'dealer',    'Dhaka',     ''),
  ('Chittagong Grocers', 'chittagong@fresh.bd', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRfDpv1rqmEu5C7.cVZ7i', 'dealer', 'Chittagong', '')`,

  `INSERT IGNORE INTO produce (farmer_id, farmer_name, name, category, emoji, quantity, unit, harvest_date, location, storage_temp, storage_humidity, fresh_days, storage_tips, status) VALUES
  (2, 'Rahim Uddin', 'Mango',   'Fruit',     '🥭', 500,  'kg',    '2026-01-20', 'Rajshahi',   '13-15°C',  '85-90%',  14, 'Store away from ethylene-sensitive produce. Ripen at room temperature.', 'Available'),
  (3, 'Sufia Begum', 'Tomato',  'Vegetable', '🍅', 300,  'kg',    '2026-01-22', 'Mymensingh', '10-13°C',  '85-90%',  10, 'Store stem-up. Never refrigerate fully ripe tomatoes.',                'Available'),
  (2, 'Rahim Uddin', 'Potato',  'Vegetable', '🥔', 1000, 'kg',    '2026-01-15', 'Rajshahi',   '4-7°C',    '85-90%',  60, 'Store in dark, dry, cool place. Avoid light to prevent greening.',     'Available'),
  (3, 'Sufia Begum', 'Cauliflower','Vegetable','🥦',150, 'kg',    '2026-01-25', 'Mymensingh', '0-1°C',    '90-95%',  14, 'Store wrapped to prevent discoloration. Keep very cold.',               'Available')`,

  `INSERT IGNORE INTO transport_requests (farmer_id, farmer_name, product_id, produce_name, pickup_location, destination, pickup_date, quantity, notes, status) VALUES
  (2, 'Rahim Uddin', 1, 'Mango', 'Rajshahi', 'Dhaka Kawran Bazar', '2026-02-01', '500 kg', 'Refrigerated vehicle required. Handle with care.', 'Open')`,

  `INSERT IGNORE INTO deals (dealer_id, dealer_name, farmer_id, farmer_name, product_id, produce_name, quantity_requested, offered_price_per_kg, message, status) VALUES
  (5, 'Dhaka Fresh Ltd', 2, 'Rahim Uddin', 1, 'Mango', '200 kg', 80.00, 'We are interested in a weekly supply arrangement for the season.', 'Pending')`
];

async function init() {
  const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'freshnest_db',
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    console.log('Creating tables...');
    for (const sql of CREATE_TABLES) {
      await pool.execute(sql);
    }

    console.log('Seeding data...');
    for (const sql of SEED_DATA) {
      await pool.execute(sql);
    }

    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Database init error:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

module.exports = { init };
