/*
  Warnings:

  - Added the required column `otherDocumentsRequired` to the `LoanType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loantype` ADD COLUMN `otherDocumentsOptions` VARCHAR(191) NULL,
    ADD COLUMN `otherDocumentsRequired` VARCHAR(191) NOT NULL;
