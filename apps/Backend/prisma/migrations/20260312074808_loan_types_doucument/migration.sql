/*
  Warnings:

  - Made the column `documentsRequired` on table `loantype` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `loantype` ADD COLUMN `documentsOptions` VARCHAR(191) NULL,
    MODIFY `documentsRequired` VARCHAR(191) NOT NULL;
