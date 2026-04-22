-- AlterTable
ALTER TABLE `coapplicant`
    ADD COLUMN `aadhaarProvider` JSON NULL,
    ADD COLUMN `panProvider` JSON NULL;

-- AlterTable
ALTER TABLE `customer`
    ADD COLUMN `aadhaarProvider` JSON NULL,
    ADD COLUMN `panProvider` JSON NULL;

-- AlterTable
ALTER TABLE `guarantor`
    ADD COLUMN `aadhaarProvider` JSON NULL,
    ADD COLUMN `panProvider` JSON NULL;

-- AlterTable
ALTER TABLE `loantype`
    ADD COLUMN `defaultLoginCharges` DOUBLE NULL;