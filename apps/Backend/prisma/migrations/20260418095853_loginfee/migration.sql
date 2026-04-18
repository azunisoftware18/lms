/*
  Warnings:

  - You are about to drop the column `AadhaarNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledChequeDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `cibilCheckDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `commercialCibilDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `gstDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `natureOfBusiness` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `panDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `partnerId` on the `partner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partnerCode]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aadhaarNumber` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partnerCode` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Made the column `bankVerificationStatus` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gstVerificationStatus` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `panVerificationStatus` on table `partner` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Partner_partnerId_key` ON `partner`;

-- AlterTable
ALTER TABLE `coapplicant` ADD COLUMN `aadhaarProvider` JSON NULL,
    ADD COLUMN `panProvider` JSON NULL;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `aadhaarProvider` JSON NULL,
    ADD COLUMN `panProvider` JSON NULL;

-- AlterTable
ALTER TABLE `guarantor` ADD COLUMN `aadhaarProvider` JSON NULL,
    ADD COLUMN `panProvider` JSON NULL;

-- AlterTable
ALTER TABLE `loantype` ADD COLUMN `defaultLoginCharges` DOUBLE NULL;

-- AlterTable
ALTER TABLE `partner` DROP COLUMN `AadhaarNumber`,
    DROP COLUMN `cancelledChequeDocumentId`,
    DROP COLUMN `cibilCheckDocumentId`,
    DROP COLUMN `commercialCibilDocumentId`,
    DROP COLUMN `gstDocumentId`,
    DROP COLUMN `natureOfBusiness`,
    DROP COLUMN `panDocumentId`,
    DROP COLUMN `partnerId`,
    ADD COLUMN `aadhaarNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `agreementRemarks` VARCHAR(191) NULL,
    ADD COLUMN `agreementValidityDate` DATETIME(3) NULL,
    ADD COLUMN `cancelledChequeUploadPath` VARCHAR(191) NULL,
    ADD COLUMN `ndaUploaded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ndaValidityDate` DATETIME(3) NULL,
    ADD COLUMN `partnerAgreementUploaded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `partnerCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `registrationCertificate` VARCHAR(191) NULL,
    MODIFY `bankVerificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    MODIFY `gstVerificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    MODIFY `panVerificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    MODIFY `companyName` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Partner_partnerCode_key` ON `Partner`(`partnerCode`);

-- CreateIndex
CREATE INDEX `Partner_Status_idx` ON `Partner`(`Status`);

-- RedefineIndex
CREATE INDEX `Partner_branchId_idx` ON `Partner`(`branchId`);
DROP INDEX `Partner_branchId_fkey` ON `partner`;
