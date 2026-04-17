/*
  Warnings:

  - The values [FORECLOSURE_PENDING] on the enum `LoanApplication_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `AadhaarNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `activeReferrals` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `alternateContactNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `annualTurnover` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `businessCategory` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `businessNature` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `businessRegistrationNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledChequeDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `cibilCheckDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `commercialCibilDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `commissionEarned` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `commissionType` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `commissionValue` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `establishedYear` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `gstDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `gstNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `minimumPayout` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `panDocumentId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `paymentCycle` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `payoutAccountHolderName` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `payoutAccountNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `payoutBankName` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `payoutIfscCode` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `payoutUpiId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `targetArea` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `taxDeduction` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `totalEmployees` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `totalReferrals` on the `partner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partnerCode]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `partnerCode` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Made the column `bankVerificationStatus` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fraudCasesCount` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gstVerificationStatus` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `panVerificationStatus` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalLeadsSubmitted` on table `partner` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `partner` DROP FOREIGN KEY `Partner_branchId_fkey`;

-- DropIndex
DROP INDEX `Partner_branchId_fkey` ON `partner`;

-- AlterTable
ALTER TABLE `loanapplication` MODIFY `status` ENUM('draft', 'submitted', 'kyc_pending', 'credit_check', 'under_review', 'TECHNICAL_PENDING', 'TECHNICAL_APPROVED', 'TECHNICAL_REJECTED', 'LEGAL_PENDING', 'LEGAL_APPROVED', 'LEGAL_REJECTED', 'LOANRULES_APPROVED', 'LOANRULES_REJECTED', 'approved', 'SANCTIONED', 'Ready_for_disbursement', 'rejected', 'disbursed', 'active', 'closed', 'delinquent', 'written_off', 'defaulted', 'application_in_progress') NOT NULL DEFAULT 'application_in_progress';

-- AlterTable
ALTER TABLE `partner` DROP COLUMN `AadhaarNumber`,
    DROP COLUMN `Status`,
    DROP COLUMN `activeReferrals`,
    DROP COLUMN `alternateContactNumber`,
    DROP COLUMN `annualTurnover`,
    DROP COLUMN `businessCategory`,
    DROP COLUMN `businessNature`,
    DROP COLUMN `businessRegistrationNumber`,
    DROP COLUMN `cancelledChequeDocumentId`,
    DROP COLUMN `cibilCheckDocumentId`,
    DROP COLUMN `commercialCibilDocumentId`,
    DROP COLUMN `commissionEarned`,
    DROP COLUMN `commissionType`,
    DROP COLUMN `commissionValue`,
    DROP COLUMN `companyName`,
    DROP COLUMN `designation`,
    DROP COLUMN `establishedYear`,
    DROP COLUMN `gstDocumentId`,
    DROP COLUMN `gstNumber`,
    DROP COLUMN `isActive`,
    DROP COLUMN `minimumPayout`,
    DROP COLUMN `panDocumentId`,
    DROP COLUMN `paymentCycle`,
    DROP COLUMN `payoutAccountHolderName`,
    DROP COLUMN `payoutAccountNumber`,
    DROP COLUMN `payoutBankName`,
    DROP COLUMN `payoutIfscCode`,
    DROP COLUMN `payoutUpiId`,
    DROP COLUMN `specialization`,
    DROP COLUMN `targetArea`,
    DROP COLUMN `taxDeduction`,
    DROP COLUMN `totalEmployees`,
    DROP COLUMN `totalReferrals`,
    ADD COLUMN `aadhaarNumber` VARCHAR(191) NULL,
    ADD COLUMN `accessType` ENUM('LEAD_UPLOAD', 'FULL_ACCESS', 'VIEW_ONLY') NULL,
    ADD COLUMN `accountHolderName` VARCHAR(191) NULL,
    ADD COLUMN `accountNumber` VARCHAR(191) NULL,
    ADD COLUMN `addressProofDocId` VARCHAR(191) NULL,
    ADD COLUMN `agreementValidityDate` DATETIME(3) NULL,
    ADD COLUMN `alternateContact` VARCHAR(191) NULL,
    ADD COLUMN `authorizationLetterDocId` VARCHAR(191) NULL,
    ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `bankProofDocId` VARCHAR(191) NULL,
    ADD COLUMN `boardResolutionDocId` VARCHAR(191) NULL,
    ADD COLUMN `cancelledChequeDocId` VARCHAR(191) NULL,
    ADD COLUMN `gstCertificateDocId` VARCHAR(191) NULL,
    ADD COLUMN `ifscCode` VARCHAR(191) NULL,
    ADD COLUMN `incorporationDocId` VARCHAR(191) NULL,
    ADD COLUMN `isOfficeSameAsRegistered` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `kycDocumentId` VARCHAR(191) NULL,
    ADD COLUMN `ndaDocId` VARCHAR(191) NULL,
    ADD COLUMN `panDocId` VARCHAR(191) NULL,
    ADD COLUMN `partnerAgreementDocId` VARCHAR(191) NULL,
    ADD COLUMN `partnerCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `registrationCertificate` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED') NOT NULL,
    ADD COLUMN `upiId` VARCHAR(191) NULL,
    MODIFY `branchId` VARCHAR(191) NULL,
    MODIFY `bankVerificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `fraudCasesCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `gstVerificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    MODIFY `panVerificationStatus` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    ALTER COLUMN `partnerRating` DROP DEFAULT,
    MODIFY `totalLeadsSubmitted` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `Partner_partnerCode_key` ON `Partner`(`partnerCode`);

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
