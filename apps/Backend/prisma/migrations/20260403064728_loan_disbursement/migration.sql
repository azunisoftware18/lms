/*
  Warnings:

  - A unique constraint covering the columns `[transactionReference]` on the table `LoanDisbursement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `loandisbursement` ADD COLUMN `accountHolderName` VARCHAR(191) NULL,
    ADD COLUMN `approvedBy` VARCHAR(191) NULL,
    ADD COLUMN `bankAccountNumber` VARCHAR(191) NULL,
    ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `chargesAmount` DOUBLE NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    ADD COLUMN `disbursementStatus` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REVERSED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `externalTxnId` VARCHAR(191) NULL,
    ADD COLUMN `ifscCode` VARCHAR(191) NULL,
    ADD COLUMN `interestAmount` DOUBLE NULL,
    ADD COLUMN `isReversed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `metadata` JSON NULL,
    ADD COLUMN `principalAmount` DOUBLE NULL,
    ADD COLUMN `rejectedBy` VARCHAR(191) NULL,
    ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    ADD COLUMN `reversalReason` VARCHAR(191) NULL,
    ADD COLUMN `reversedAt` DATETIME(3) NULL,
    ADD COLUMN `utrNumber` VARCHAR(191) NULL,
    ADD COLUMN `valueDate` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LoanDisbursement_transactionReference_key` ON `LoanDisbursement`(`transactionReference`);

-- CreateIndex
CREATE INDEX `LoanDisbursement_transactionReference_idx` ON `LoanDisbursement`(`transactionReference`);

-- CreateIndex
CREATE INDEX `LoanDisbursement_disbursementStatus_idx` ON `LoanDisbursement`(`disbursementStatus`);
