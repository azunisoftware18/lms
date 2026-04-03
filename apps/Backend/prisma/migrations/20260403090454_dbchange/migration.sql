/*
  Warnings:

  - Made the column `accountHolderName` on table `loandisbursement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankAccountNumber` on table `loandisbursement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankName` on table `loandisbursement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ifscCode` on table `loandisbursement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `loandisbursement` MODIFY `accountHolderName` VARCHAR(191) NOT NULL,
    MODIFY `bankAccountNumber` VARCHAR(191) NOT NULL,
    MODIFY `bankName` VARCHAR(191) NOT NULL,
    MODIFY `ifscCode` VARCHAR(191) NOT NULL;
