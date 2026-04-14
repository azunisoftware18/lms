/*
  Warnings:

  - You are about to drop the column `alternateNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `contactPerson` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `gstPercentage` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `natureOfBusinessDetail` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `officeAddressLine1` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `officeAddressLine2` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `officeCity` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `officeCountry` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `officePinCode` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `officeState` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `parentPartnerId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `productWisePayoutRates` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAddressLine1` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `registeredAddressLine2` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `registeredCountry` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `registeredPinCode` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `roiProcessingFeeSharing` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `tdsRate` on the `partner` table. All the data in the column will be lost.
  - The values [INDIVIDUAL,COMPANY,INSTITUTION,CORPORATE,AGENCY] on the enum `Partner_partnerType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `incentiveSchemes` on the `partner` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - A unique constraint covering the columns `[partnerId,documentType]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[officeAddressId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `AadhaarNumber` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constitutionType` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPersonName` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfOnboarding` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legalName` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Made the column `digitalApiIntegration` on table `partner` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `partner` DROP FOREIGN KEY `Partner_parentPartnerId_fkey`;

-- DropIndex
DROP INDEX `Partner_parentPartnerId_fkey` ON `partner`;

-- AlterTable
ALTER TABLE `document` ADD COLUMN `partnerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `partner` DROP COLUMN `alternateNumber`,
    DROP COLUMN `contactPerson`,
    DROP COLUMN `gstPercentage`,
    DROP COLUMN `natureOfBusinessDetail`,
    DROP COLUMN `officeAddressLine1`,
    DROP COLUMN `officeAddressLine2`,
    DROP COLUMN `officeCity`,
    DROP COLUMN `officeCountry`,
    DROP COLUMN `officePinCode`,
    DROP COLUMN `officeState`,
    DROP COLUMN `parentPartnerId`,
    DROP COLUMN `productWisePayoutRates`,
    DROP COLUMN `registeredAddressLine1`,
    DROP COLUMN `registeredAddressLine2`,
    DROP COLUMN `registeredCountry`,
    DROP COLUMN `registeredPinCode`,
    DROP COLUMN `roiProcessingFeeSharing`,
    DROP COLUMN `tdsRate`,
    ADD COLUMN `AadhaarNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `Status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED') NOT NULL,
    ADD COLUMN `alternateContactNumber` VARCHAR(191) NULL,
    ADD COLUMN `alternatePersonName` VARCHAR(191) NULL,
    ADD COLUMN `apiKey` VARCHAR(191) NULL,
    ADD COLUMN `assignedRmId` VARCHAR(191) NULL,
    ADD COLUMN `bankVerificationStatus` ENUM('pending', 'verified', 'rejected') NULL DEFAULT 'pending',
    ADD COLUMN `branchMapping` JSON NULL,
    ADD COLUMN `cancelledChequeDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `cibilCheckDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `cibilCheckUploaded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `cinNumber` VARCHAR(191) NULL,
    ADD COLUMN `commercialCibilDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `commercialCibilUploaded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `constitutionType` ENUM('INDIVIDUAL', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LTD', 'PUBLIC_LTD', 'OTHER') NOT NULL,
    ADD COLUMN `contactNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `contactPersonName` VARCHAR(191) NOT NULL,
    ADD COLUMN `dateOfOnboarding` DATETIME(3) NOT NULL,
    ADD COLUMN `disbursementVolume` DOUBLE NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `fraudCasesCount` INTEGER NULL DEFAULT 0,
    ADD COLUMN `gstApplicable` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `gstDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `gstVerificationStatus` ENUM('pending', 'verified', 'rejected') NULL DEFAULT 'pending',
    ADD COLUMN `gstinNumber` VARCHAR(191) NULL,
    ADD COLUMN `integrationId` VARCHAR(191) NULL,
    ADD COLUMN `kycDocumentsUploaded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `legalName` VARCHAR(191) NOT NULL,
    ADD COLUMN `llpinNumber` VARCHAR(191) NULL,
    ADD COLUMN `loginId` VARCHAR(191) NULL,
    ADD COLUMN `loginToSanctionRatio` DOUBLE NULL,
    ADD COLUMN `maxPayoutCap` DOUBLE NULL,
    ADD COLUMN `natureOfBusiness` VARCHAR(191) NULL,
    ADD COLUMN `officeAddressId` VARCHAR(191) NULL,
    ADD COLUMN `panDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `panVerificationStatus` ENUM('pending', 'verified', 'rejected') NULL DEFAULT 'pending',
    ADD COLUMN `partnerRating` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `payoutAccountHolderName` VARCHAR(191) NULL,
    ADD COLUMN `payoutAccountNumber` VARCHAR(191) NULL,
    ADD COLUMN `payoutBankName` VARCHAR(191) NULL,
    ADD COLUMN `payoutFrequency` ENUM('MONTHLY', 'CASE_WISE', 'ON_DISBURSEMENT') NULL,
    ADD COLUMN `payoutIfscCode` VARCHAR(191) NULL,
    ADD COLUMN `payoutType` ENUM('FLAT', 'PERCENTAGE', 'SLAB') NULL,
    ADD COLUMN `payoutUpiId` VARCHAR(191) NULL,
    ADD COLUMN `productAccess` JSON NULL,
    ADD COLUMN `productPayoutRates` JSON NULL,
    ADD COLUMN `qualityScore` DOUBLE NULL,
    ADD COLUMN `rejectionRate` DOUBLE NULL,
    ADD COLUMN `roiProcessingShare` DOUBLE NULL,
    ADD COLUMN `sanctionToDisbursementRatio` DOUBLE NULL,
    ADD COLUMN `tdsApplicable` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `totalLeadsSubmitted` INTEGER NULL DEFAULT 0,
    MODIFY `partnerType` ENUM('DSA', 'BROKER', 'Connector', 'Fintech', 'Builder', 'Aggregator') NOT NULL,
    MODIFY `digitalApiIntegration` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `incentiveSchemes` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Document_partnerId_documentType_key` ON `Document`(`partnerId`, `documentType`);

-- CreateIndex
CREATE UNIQUE INDEX `Partner_officeAddressId_key` ON `Partner`(`officeAddressId`);

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_officeAddressId_fkey` FOREIGN KEY (`officeAddressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
