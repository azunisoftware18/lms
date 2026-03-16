-- Make document uniqueness owner-specific while keeping loan-level lookup fast.
ALTER TABLE `Document`
  DROP INDEX `Document_loanApplicationId_documentType_key`,
  ADD UNIQUE INDEX `Document_coApplicantId_documentType_key` (`coApplicantId`, `documentType`),
  ADD INDEX `Document_loanApplicationId_documentType_idx` (`loanApplicationId`, `documentType`),
  ADD INDEX `Document_loanApplicationId_idx` (`loanApplicationId`);
