/*
  Warnings:

  - Made the column `interestAmount` on table `loandisbursement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `principalAmount` on table `loandisbursement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `utrNumber` on table `loandisbursement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `loanapplication` MODIFY `status` ENUM('draft', 'submitted', 'kyc_pending', 'credit_check', 'under_review', 'TECHNICAL_PENDING', 'TECHNICAL_APPROVED', 'TECHNICAL_REJECTED', 'LEGAL_PENDING', 'LEGAL_APPROVED', 'LEGAL_REJECTED', 'LOANRULES_APPROVED', 'LOANRULES_REJECTED', 'approved', 'SANCTIONED', 'Ready_for_disbursement', 'rejected', 'disbursed', 'active', 'closed', 'delinquent', 'written_off', 'defaulted', 'application_in_progress') NOT NULL DEFAULT 'application_in_progress';

-- AlterTable
ALTER TABLE `loandisbursement` MODIFY `interestAmount` DOUBLE NOT NULL,
    MODIFY `principalAmount` DOUBLE NOT NULL,
    MODIFY `utrNumber` VARCHAR(191) NOT NULL;
