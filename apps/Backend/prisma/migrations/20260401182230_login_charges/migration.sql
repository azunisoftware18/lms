/*
  Warnings:

  - You are about to drop the column `processingFee` on the `loantype` table. All the data in the column will be lost.
  - You are about to drop the column `processingFeeType` on the `loantype` table. All the data in the column will be lost.
  - Added the required column `maxProcessingFee` to the `LoanType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minProcessingFee` to the `LoanType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loantype` DROP COLUMN `processingFee`,
    DROP COLUMN `processingFeeType`,
    ADD COLUMN `maxLoginCharges` DOUBLE NULL,
    ADD COLUMN `maxProcessingFee` DOUBLE NOT NULL,
    ADD COLUMN `minLoginCharges` DOUBLE NULL,
    ADD COLUMN `minProcessingFee` DOUBLE NOT NULL;
