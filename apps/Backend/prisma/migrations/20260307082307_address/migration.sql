/*
  Warnings:

  - You are about to drop the column `monthlyIncome` on the `coapplicant` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `annualIncome` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyIncome` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `otherIncome` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `spouseName` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `fullAddress` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `technicalreport` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `technicalreport` table. All the data in the column will be lost.
  - You are about to drop the column `propertyAddress` on the `technicalreport` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `technicalreport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Leads` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `TechnicalReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fatherName` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherName` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maritalStatus` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationality` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `coapplicant` DROP COLUMN `monthlyIncome`,
    ADD COLUMN `relationOther` VARCHAR(191) NULL,
    MODIFY `employmentType` ENUM('salaried', 'self_employed', 'business', 'professional') NOT NULL;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `address`,
    DROP COLUMN `annualIncome`,
    DROP COLUMN `city`,
    DROP COLUMN `monthlyIncome`,
    DROP COLUMN `otherIncome`,
    DROP COLUMN `pinCode`,
    DROP COLUMN `spouseName`,
    DROP COLUMN `state`,
    ADD COLUMN `categoryOther` VARCHAR(191) NULL,
    ADD COLUMN `correspondenceAddressType` ENUM('RESIDENCE', 'OFFICE') NULL,
    ADD COLUMN `drivingLicenceNo` VARCHAR(191) NULL,
    ADD COLUMN `fatherName` VARCHAR(191) NOT NULL,
    ADD COLUMN `genderOther` VARCHAR(191) NULL,
    ADD COLUMN `maritalStatusOther` VARCHAR(191) NULL,
    ADD COLUMN `motherName` VARCHAR(191) NOT NULL,
    ADD COLUMN `noOfChildren` INTEGER NULL,
    ADD COLUMN `noOfFamilyDependents` INTEGER NULL,
    ADD COLUMN `periodOfStay` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `presentAccommodation` ENUM('OWN', 'FAMILY', 'RENTED', 'EMPLOYER') NULL,
    ADD COLUMN `qualification` VARCHAR(191) NULL,
    ADD COLUMN `rentPerMonth` DOUBLE NULL,
    MODIFY `employmentType` ENUM('salaried', 'self_employed', 'business', 'professional') NOT NULL,
    MODIFY `category` ENUM('GENERAL', 'SC', 'ST', 'NT', 'OBC', 'OTHER') NOT NULL,
    MODIFY `maritalStatus` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER') NOT NULL,
    MODIFY `nationality` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `pinCode`,
    DROP COLUMN `state`,
    ADD COLUMN `addressId` VARCHAR(191) NULL,
    ADD COLUMN `emergencyRelationshipOther` VARCHAR(191) NULL,
    ADD COLUMN `genderOther` VARCHAR(191) NULL,
    ADD COLUMN `maritalStatusOther` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `leads` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `pinCode`,
    DROP COLUMN `state`,
    ADD COLUMN `addressId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `loanapplication` ADD COLUMN `EmployeeCode` VARCHAR(191) NULL,
    ADD COLUMN `executiveName` VARCHAR(191) NULL,
    ADD COLUMN `processingFees` DOUBLE NULL,
    ADD COLUMN `referrerFileNo` VARCHAR(191) NULL,
    ADD COLUMN `schemeGroup` VARCHAR(191) NULL,
    ADD COLUMN `serviceCentre` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `loantype` MODIFY `employmentType` ENUM('salaried', 'self_employed', 'business', 'professional') NULL;

-- AlterTable
ALTER TABLE `partner` DROP COLUMN `city`,
    DROP COLUMN `fullAddress`,
    DROP COLUMN `pinCode`,
    DROP COLUMN `state`,
    ADD COLUMN `addressId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `technicalreport` DROP COLUMN `city`,
    DROP COLUMN `pincode`,
    DROP COLUMN `propertyAddress`,
    DROP COLUMN `state`,
    ADD COLUMN `addressId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `addressType` ENUM('CURRENT_RESIDENTIAL', 'PERMANENT', 'CORRESPONDENCE', 'OFFICE') NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `addressLine2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pinCode` VARCHAR(191) NOT NULL,
    `landmark` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `stdCode` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NULL,
    `coApplicantId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Address_customerId_idx`(`customerId`),
    INDEX `Address_coApplicantId_idx`(`coApplicantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanApplicationDraft` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `draftData` JSON NOT NULL,
    `step` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('DRAFT', 'SUBMITTED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OccupationalDetails` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `coApplicantId` VARCHAR(191) NULL,
    `occupationalCategory` ENUM('SALARIED', 'BUSINESS', 'PROFESSIONAL', 'OTHER') NOT NULL,
    `occupationalCategoryOther` VARCHAR(191) NULL,
    `companyBusinessName` VARCHAR(191) NULL,
    `addressId` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `extensionNumber` VARCHAR(191) NULL,
    `totalWorkExperience` INTEGER NULL,
    `noOfEmployees` INTEGER NULL,
    `commencementDate` DATETIME(3) NULL,
    `professionalType` ENUM('DOCTOR', 'CA_ICWA_CS', 'ARCHITECT', 'OTHER') NULL,
    `professionalSpecify` VARCHAR(191) NULL,
    `businessType` ENUM('TRADER', 'MANUFACTURER', 'WHOLESELLER', 'OTHER') NULL,
    `businessSpecify` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OccupationalDetails_customerId_idx`(`customerId`),
    INDEX `OccupationalDetails_coApplicantId_idx`(`coApplicantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmploymentDetails` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `coApplicantId` VARCHAR(191) NULL,
    `employerType` ENUM('PUBLIC_LTD', 'MNC', 'EDUCATIONAL_INST', 'CENTRAL_STATE_GOVT', 'PUBLIC_SECTOR_UNIT', 'PROPRIETOR_PARTNERSHIP', 'PRIVATE_LTD', 'OTHER') NOT NULL,
    `employerTypeOther` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `dateOfJoining` DATETIME(3) NULL,
    `dateOfRetirement` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EmploymentDetails_customerId_idx`(`customerId`),
    INDEX `EmploymentDetails_coApplicantId_idx`(`coApplicantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialDetails` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `grossMonthlyIncome` DOUBLE NOT NULL,
    `netMonthlyIncome` DOUBLE NOT NULL,
    `averageMonthlyExpenses` DOUBLE NOT NULL,
    `savingBankBalance` DOUBLE NULL,
    `valueOfImmovableProperty` DOUBLE NULL,
    `currentBalanceInPF` DOUBLE NULL,
    `valueOfSharesSecurities` DOUBLE NULL,
    `fixedDeposits` DOUBLE NULL,
    `otherAssets` DOUBLE NULL,
    `totalAssets` DOUBLE NULL,
    `creditSocietyLoan` DOUBLE NULL,
    `employerLoan` DOUBLE NULL,
    `homeLoan` DOUBLE NULL,
    `pfLoan` DOUBLE NULL,
    `vehicleLoan` DOUBLE NULL,
    `personalLoan` DOUBLE NULL,
    `otherLoan` DOUBLE NULL,
    `totalLiabilities` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FinancialDetails_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_addressId_key` ON `Employee`(`addressId`);

-- CreateIndex
CREATE UNIQUE INDEX `Leads_addressId_key` ON `Leads`(`addressId`);

-- CreateIndex
CREATE UNIQUE INDEX `Partner_addressId_key` ON `Partner`(`addressId`);

-- CreateIndex
CREATE UNIQUE INDEX `TechnicalReport_addressId_key` ON `TechnicalReport`(`addressId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_coApplicantId_fkey` FOREIGN KEY (`coApplicantId`) REFERENCES `CoApplicant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leads` ADD CONSTRAINT `Leads_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanApplicationDraft` ADD CONSTRAINT `LoanApplicationDraft_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanApplicationDraft` ADD CONSTRAINT `LoanApplicationDraft_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OccupationalDetails` ADD CONSTRAINT `OccupationalDetails_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OccupationalDetails` ADD CONSTRAINT `OccupationalDetails_coApplicantId_fkey` FOREIGN KEY (`coApplicantId`) REFERENCES `CoApplicant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OccupationalDetails` ADD CONSTRAINT `OccupationalDetails_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploymentDetails` ADD CONSTRAINT `EmploymentDetails_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploymentDetails` ADD CONSTRAINT `EmploymentDetails_coApplicantId_fkey` FOREIGN KEY (`coApplicantId`) REFERENCES `CoApplicant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinancialDetails` ADD CONSTRAINT `FinancialDetails_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnicalReport` ADD CONSTRAINT `TechnicalReport_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
