SET @has_old_unique := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Document'
    AND INDEX_NAME = 'Document_loanApplicationId_documentType_key'
);
SET @drop_old_unique_sql := IF(
  @has_old_unique > 0,
  'ALTER TABLE `Document` DROP INDEX `Document_loanApplicationId_documentType_key`',
  'SELECT 1'
);
PREPARE stmt_drop_old_unique FROM @drop_old_unique_sql;
EXECUTE stmt_drop_old_unique;
DEALLOCATE PREPARE stmt_drop_old_unique;

SET @has_co_unique := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Document'
    AND INDEX_NAME = 'Document_coApplicantId_documentType_key'
);
SET @add_co_unique_sql := IF(
  @has_co_unique = 0,
  'ALTER TABLE `Document` ADD UNIQUE INDEX `Document_coApplicantId_documentType_key` (`coApplicantId`, `documentType`)',
  'SELECT 1'
);
PREPARE stmt_add_co_unique FROM @add_co_unique_sql;
EXECUTE stmt_add_co_unique;
DEALLOCATE PREPARE stmt_add_co_unique;

SET @has_loan_pair_idx := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Document'
    AND INDEX_NAME = 'Document_loanApplicationId_documentType_idx'
);
SET @add_loan_pair_idx_sql := IF(
  @has_loan_pair_idx = 0,
  'ALTER TABLE `Document` ADD INDEX `Document_loanApplicationId_documentType_idx` (`loanApplicationId`, `documentType`)',
  'SELECT 1'
);
PREPARE stmt_add_loan_pair_idx FROM @add_loan_pair_idx_sql;
EXECUTE stmt_add_loan_pair_idx;
DEALLOCATE PREPARE stmt_add_loan_pair_idx;

SET @has_loan_idx := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Document'
    AND INDEX_NAME = 'Document_loanApplicationId_idx'
);
SET @add_loan_idx_sql := IF(
  @has_loan_idx = 0,
  'ALTER TABLE `Document` ADD INDEX `Document_loanApplicationId_idx` (`loanApplicationId`)',
  'SELECT 1'
);
PREPARE stmt_add_loan_idx FROM @add_loan_idx_sql;
EXECUTE stmt_add_loan_idx;
DEALLOCATE PREPARE stmt_add_loan_idx;
