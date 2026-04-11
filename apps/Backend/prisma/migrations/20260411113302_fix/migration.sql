/*
  Warnings:

  - Added the required column `roleFor` to the `EmployeeRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employeerole` ADD COLUMN `roleFor` ENUM('Employee', 'Partner') NOT NULL;

-- AlterTable
ALTER TABLE `loanapplication` MODIFY `status` ENUM('draft', 'submitted', 'kyc_pending', 'credit_check', 'under_review', 'TECHNICAL_PENDING', 'TECHNICAL_APPROVED', 'TECHNICAL_REJECTED', 'LEGAL_PENDING', 'LEGAL_APPROVED', 'LEGAL_REJECTED', 'LOANRULES_APPROVED', 'LOANRULES_REJECTED', 'approved', 'SANCTIONED', 'Ready_for_disbursement', 'rejected', 'disbursed', 'active', 'closed', 'delinquent', 'written_off', 'defaulted', 'application_in_progress', 'Foreclosure_PENDING', 'Foreclosure_APPROVED', 'Foreclosure_REJECTED', 'Foreclosure_CLOSED') NOT NULL DEFAULT 'application_in_progress';

-- AlterTable
ALTER TABLE `partner` ADD COLUMN `aadhaarNumber` VARCHAR(191) NULL,
    ADD COLUMN `accessType` ENUM('LEAD_UPLOAD', 'FULL_LOS', 'VIEW_ONLY') NULL,
    ADD COLUMN `accountHolder` VARCHAR(191) NULL,
    ADD COLUMN `accountNo` VARCHAR(191) NULL,
    ADD COLUMN `assignedRelationshipManager` VARCHAR(191) NULL,
    ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `branchMapping` VARCHAR(191) NULL,
    ADD COLUMN `constitutionType` ENUM('INDIVIDUAL', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'OTHER') NULL,
    ADD COLUMN `disbursementVolume` DOUBLE NULL,
    ADD COLUMN `documents` JSON NULL,
    ADD COLUMN `fraudCasesCount` INTEGER NULL,
    ADD COLUMN `gstApplicable` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `ifsc` VARCHAR(191) NULL,
    ADD COLUMN `loginId` VARCHAR(191) NULL,
    ADD COLUMN `loginToSanctionRatio` DOUBLE NULL,
    ADD COLUMN `maxPayoutCap` DOUBLE NULL,
    ADD COLUMN `onboardingDate` DATETIME(3) NULL,
    ADD COLUMN `partnerCode` VARCHAR(191) NULL,
    ADD COLUMN `partnerRating` DOUBLE NULL,
    ADD COLUMN `payoutFrequency` ENUM('MONTHLY', 'CASE_WISE') NULL,
    ADD COLUMN `payoutType` ENUM('FLAT', 'PERCENTAGE', 'SLAB') NULL,
    ADD COLUMN `portalAccess` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `qualityScore` DOUBLE NULL,
    ADD COLUMN `registrationNo` VARCHAR(191) NULL,
    ADD COLUMN `rejectionRate` DOUBLE NULL,
    ADD COLUMN `sanctionToDisbursementRatio` DOUBLE NULL,
    ADD COLUMN `tdsApplicable` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `totalLeadsSubmitted` INTEGER NULL DEFAULT 0,
    ADD COLUMN `upiId` VARCHAR(191) NULL;
