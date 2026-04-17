ALTER TABLE failure_alternative_requests
  MODIFY COLUMN status ENUM('PendingFarmerDecision','AcceptedOldPrice','AcceptedNewPrice','Returned','Expired')
  NOT NULL DEFAULT 'PendingFarmerDecision';
