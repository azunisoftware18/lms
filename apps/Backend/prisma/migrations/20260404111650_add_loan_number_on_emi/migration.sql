/*
  Warnings:

  - Added the required column `loanNumber` to the `LoanEmiSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loanemischedule` ADD COLUMN `loanNumber` VARCHAR(191) NOT NULL;
