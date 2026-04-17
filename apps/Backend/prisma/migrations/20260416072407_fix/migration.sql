/*
  Warnings:

  - You are about to drop the column `accessType` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `accountHolderName` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `addressProofDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `agreementValidityDate` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `alternateContact` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `authorizationLetterDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `bankProofDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `boardResolutionDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledChequeDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `gstCertificateDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `gstinNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `ifscCode` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `incorporationDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `isOfficeSameAsRegistered` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `kycDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `ndaDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `officeStrength` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `panDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `partnerAgreementDocId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `partnerCode` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `registrationCertificate` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `upiId` on the `partner` table. All the data in the column will be lost.
  - Added the required column `commissionType` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentCycle` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Made the column `branchId` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aadhaarNumber` on table `partner` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `partner` DROP FOREIGN KEY `Partner_branchId_fkey`;

-- DropIndex
DROP INDEX `Partner_branchId_fkey` ON `partner`;

-- DropIndex
DROP INDEX `Partner_partnerCode_key` ON `partner`;

-- AlterTable
ALTER TABLE `partner` DROP COLUMN `accessType`,
    DROP COLUMN `accountHolderName`,
    DROP COLUMN `accountNumber`,
    DROP COLUMN `addressProofDocId`,
    DROP COLUMN `agreementValidityDate`,
    DROP COLUMN `alternateContact`,
    DROP COLUMN `authorizationLetterDocId`,
    DROP COLUMN `bankName`,
    DROP COLUMN `bankProofDocId`,
    DROP COLUMN `boardResolutionDocId`,
    DROP COLUMN `cancelledChequeDocId`,
    DROP COLUMN `gstCertificateDocId`,
    DROP COLUMN `gstinNumber`,
    DROP COLUMN `ifscCode`,
    DROP COLUMN `incorporationDocId`,
    DROP COLUMN `isOfficeSameAsRegistered`,
    DROP COLUMN `kycDocumentId`,
    DROP COLUMN `ndaDocId`,
    DROP COLUMN `officeStrength`,
    DROP COLUMN `panDocId`,
    DROP COLUMN `partnerAgreementDocId`,
    DROP COLUMN `partnerCode`,
    DROP COLUMN `registrationCertificate`,
    DROP COLUMN `upiId`,
    ADD COLUMN `activeReferrals` INTEGER NULL DEFAULT 0,
    ADD COLUMN `alternateContactNumber` VARCHAR(191) NULL,
    ADD COLUMN `annualTurnover` DOUBLE NULL,
    ADD COLUMN `businessRegistrationNumber` VARCHAR(191) NULL,
    ADD COLUMN `cancelledChequeDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `cibilCheckDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `commercialCibilDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `commissionEarned` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `commissionType` ENUM('FIXED', 'PERCENTAGE') NOT NULL,
    ADD COLUMN `commissionValue` DOUBLE NULL,
    ADD COLUMN `establishedYear` INTEGER NULL,
    ADD COLUMN `gstDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `gstNumber` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `minimumPayout` DOUBLE NULL,
    ADD COLUMN `panDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `paymentCycle` ENUM('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'PER_TRANSACTION') NOT NULL,
    ADD COLUMN `payoutAccountHolderName` VARCHAR(191) NULL,
    ADD COLUMN `payoutAccountNumber` VARCHAR(191) NULL,
    ADD COLUMN `payoutBankName` VARCHAR(191) NULL,
    ADD COLUMN `payoutIfscCode` VARCHAR(191) NULL,
    ADD COLUMN `payoutUpiId` VARCHAR(191) NULL,
    ADD COLUMN `specialization` VARCHAR(191) NULL,
    ADD COLUMN `targetArea` VARCHAR(191) NULL,
    ADD COLUMN `taxDeduction` DOUBLE NULL,
    ADD COLUMN `totalEmployees` INTEGER NULL,
    ADD COLUMN `totalReferrals` INTEGER NULL DEFAULT 0,
    MODIFY `branchId` VARCHAR(191) NOT NULL,
    MODIFY `bankVerificationStatus` ENUM('pending', 'verified', 'rejected') NULL DEFAULT 'pending',
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `fraudCasesCount` INTEGER NULL DEFAULT 0,
    MODIFY `gstVerificationStatus` ENUM('pending', 'verified', 'rejected') NULL DEFAULT 'pending',
    MODIFY `panVerificationStatus` ENUM('pending', 'verified', 'rejected') NULL DEFAULT 'pending',
    MODIFY `partnerRating` DOUBLE NULL DEFAULT 0,
    MODIFY `totalLeadsSubmitted` INTEGER NULL DEFAULT 0,
    MODIFY `aadhaarNumber` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
