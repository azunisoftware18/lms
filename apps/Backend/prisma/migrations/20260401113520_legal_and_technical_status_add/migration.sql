-- AlterTable
ALTER TABLE `legalreport` ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectedBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `loanapplication` MODIFY `status` ENUM('draft', 'submitted', 'kyc_pending', 'credit_check', 'under_review', 'TECHNICAL_PENDING', 'TECHNICAL_APPROVED', 'TECHNICAL_REJECTED', 'LEGAL_PENDING', 'LEGAL_APPROVED', 'LEGAL_REJECTED', 'approved', 'rejected', 'disbursed', 'active', 'closed', 'delinquent', 'written_off', 'defaulted', 'application_in_progress') NOT NULL DEFAULT 'application_in_progress';
