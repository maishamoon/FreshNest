ALTER TABLE failure_alternative_requests 
  ADD COLUMN converted_dealer_id INT DEFAULT NULL,
  ADD COLUMN converted_dealer_name VARCHAR(150) DEFAULT NULL;
