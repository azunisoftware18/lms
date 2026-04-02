/*
  Warnings:

  - You are about to drop the column `loanId` on the `loandisbursement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[loanNumber]` on the table `LoanDisbursement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loanNumber` to the `LoanDisbursement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `loandisbursement` DROP FOREIGN KEY `LoanDisbursement_loanId_fkey`;

-- DropIndex
DROP INDEX `LoanDisbursement_loanId_idx` ON `loandisbursement`;

-- DropIndex
DROP INDEX `LoanDisbursement_loanId_key` ON `loandisbursement`;

-- AlterTable
ALTER TABLE `loanapplication` MODIFY `status` ENUM('draft', 'submitted', 'kyc_pending', 'credit_check', 'under_review', 'TECHNICAL_PENDING', 'TECHNICAL_APPROVED', 'TECHNICAL_REJECTED', 'LEGAL_PENDING', 'LEGAL_APPROVED', 'LEGAL_REJECTED', 'LOANRULES_APPROVED', 'LOANRULES_REJECTED', 'approved', 'rejected', 'disbursed', 'active', 'closed', 'delinquent', 'written_off', 'defaulted', 'application_in_progress') NOT NULL DEFAULT 'application_in_progress';

-- AlterTable
ALTER TABLE `loandisbursement` DROP COLUMN `loanId`,
    ADD COLUMN `loanNumber` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Sanction` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationNumber` VARCHAR(191) NOT NULL,
    `sanctionedAmount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `approvedBy` VARCHAR(191) NULL,
    `approvedAt` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'PARTIAL') NOT NULL DEFAULT 'PENDING',
    `remarks` VARCHAR(191) NULL,
    `documents` JSON NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Sanction_loanApplicationNumber_idx`(`loanApplicationNumber`),
    INDEX `Sanction_branchId_idx`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `LoanDisbursement_loanNumber_key` ON `LoanDisbursement`(`loanNumber`);

-- CreateIndex
CREATE INDEX `LoanDisbursement_loanNumber_idx` ON `LoanDisbursement`(`loanNumber`);

-- AddForeignKey
ALTER TABLE `LoanDisbursement` ADD CONSTRAINT `LoanDisbursement_loanNumber_fkey` FOREIGN KEY (`loanNumber`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sanction` ADD CONSTRAINT `Sanction_loanApplicationNumber_fkey` FOREIGN KEY (`loanApplicationNumber`) REFERENCES `LoanApplication`(`loanNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sanction` ADD CONSTRAINT `Sanction_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
