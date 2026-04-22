-- AlterTable
ALTER TABLE `employee` ADD COLUMN `accountHolder` VARCHAR(191) NULL,
    ADD COLUMN `bankAccountNo` VARCHAR(191) NULL,
    ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `basicSalary` DOUBLE NULL,
    ADD COLUMN `conveyance` DOUBLE NULL,
    ADD COLUMN `ifsc` VARCHAR(191) NULL,
    ADD COLUMN `medicalAllowance` DOUBLE NULL,
    ADD COLUMN `otherAllowances` DOUBLE NULL,
    ADD COLUMN `pfDeduction` DOUBLE NULL,
    ADD COLUMN `taxDeduction` DOUBLE NULL,
    ADD COLUMN `upiId` VARCHAR(191) NULL;
