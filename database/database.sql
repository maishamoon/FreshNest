--  HarvestLink BD — Presentation Database
--  Only the tables needed for the presentation:
--    1. users          (Authentication)
--    2. produce        (Feature 1 — Produce Listing)
--    3. transport_requests (Feature 2 — Transport Request)

CREATE DATABASE IF NOT EXISTS freshnest_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE freshnest_db;

─────────────────────────────────────────────────────────
--  TABLE 1: USERS
--  Stores all registered users (farmers, transporters, dealers)
--  password_hash: bcrypt hashed — plain text is NEVER stored
-- ─────────────────────────────────────────────────────────

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

-- ─────────────────────────────────────────────────────────
--  TABLE 2: PRODUCE
--  Farmer's produce listings
--  farmer_id → FK to users.id
--  status: Available = visible to dealers
-- ─────────────────────────────────────────────────────────


