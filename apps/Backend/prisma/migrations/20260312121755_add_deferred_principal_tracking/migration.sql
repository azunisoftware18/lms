-- AlterTable
ALTER TABLE `loanemischedule` ADD COLUMN `deferredPrincipal` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `loantype` ADD COLUMN `deletedAt` DATETIME(3) NULL;
