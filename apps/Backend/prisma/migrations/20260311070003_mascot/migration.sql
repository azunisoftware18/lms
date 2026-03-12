/*
  Warnings:

  - You are about to drop the column `stdCode` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `coapplicant` table. All the data in the column will be lost.
  - The values [WHOLESELLER] on the enum `OccupationalDetails_businessType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `bankaccountdetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `creditcarddetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `existingloandetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `insurancepolicydetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loangeneralquestionanswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanparty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanpartyaddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanpartyfinancialdetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanpartyoccupationaldetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanpartypersonaldetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanpartysalarieddetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loanrequirementdetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mortgagepropertydetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lastName` to the `CoApplicant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bankaccountdetail` DROP FOREIGN KEY `BankAccountDetail_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `creditcarddetail` DROP FOREIGN KEY `CreditCardDetail_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `existingloandetail` DROP FOREIGN KEY `ExistingLoanDetail_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `insurancepolicydetail` DROP FOREIGN KEY `InsurancePolicyDetail_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `loangeneralquestionanswer` DROP FOREIGN KEY `LoanGeneralQuestionAnswer_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `loanparty` DROP FOREIGN KEY `LoanParty_coApplicantId_fkey`;

-- DropForeignKey
ALTER TABLE `loanparty` DROP FOREIGN KEY `LoanParty_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `loanparty` DROP FOREIGN KEY `LoanParty_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `loanpartyaddress` DROP FOREIGN KEY `LoanPartyAddress_loanPartyId_fkey`;

-- DropForeignKey
ALTER TABLE `loanpartyfinancialdetails` DROP FOREIGN KEY `LoanPartyFinancialDetails_loanPartyId_fkey`;

-- DropForeignKey
ALTER TABLE `loanpartyoccupationaldetails` DROP FOREIGN KEY `LoanPartyOccupationalDetails_loanPartyId_fkey`;

-- DropForeignKey
ALTER TABLE `loanpartypersonaldetails` DROP FOREIGN KEY `LoanPartyPersonalDetails_loanPartyId_fkey`;

-- DropForeignKey
ALTER TABLE `loanpartysalarieddetails` DROP FOREIGN KEY `LoanPartySalariedDetails_loanPartyId_fkey`;

-- DropForeignKey
ALTER TABLE `loanreference` DROP FOREIGN KEY `LoanReference_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `loanrequirementdetails` DROP FOREIGN KEY `LoanRequirementDetails_loanApplicationId_fkey`;

-- DropForeignKey
ALTER TABLE `mortgagepropertydetail` DROP FOREIGN KEY `MortgagePropertyDetail_loanApplicationId_fkey`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `stdCode`,
    ADD COLUMN `guarantorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `coapplicant` DROP COLUMN `LastName`,
    ADD COLUMN `category` ENUM('GENERAL', 'SC', 'ST', 'NT', 'OBC', 'OTHER') NULL,
    ADD COLUMN `correspondenceAddressType` ENUM('RESIDENCE', 'OFFICE') NULL,
    ADD COLUMN `drivingLicenceNo` VARCHAR(191) NULL,
    ADD COLUMN `fatherName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `maritalStatus` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER') NULL,
    ADD COLUMN `motherName` VARCHAR(191) NULL,
    ADD COLUMN `noOfChildren` INTEGER NULL,
    ADD COLUMN `noOfDependents` INTEGER NULL,
    ADD COLUMN `passportNumber` VARCHAR(191) NULL,
    ADD COLUMN `periodOfStay` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `presentAccommodation` ENUM('OWN', 'FAMILY', 'RENTED', 'EMPLOYER') NULL,
    ADD COLUMN `qualification` VARCHAR(191) NULL,
    ADD COLUMN `rentPerMonth` DOUBLE NULL,
    ADD COLUMN `voterId` VARCHAR(191) NULL,
    ADD COLUMN `woname` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employmentdetails` ADD COLUMN `guarantorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `occupationaldetails` ADD COLUMN `guarantorId` VARCHAR(191) NULL,
    MODIFY `businessType` ENUM('TRADER', 'MANUFACTURER', 'WHOLESALER', 'OTHER') NULL;

-- DropTable
DROP TABLE `bankaccountdetail`;

-- DropTable
DROP TABLE `creditcarddetail`;

-- DropTable
DROP TABLE `existingloandetail`;

-- DropTable
DROP TABLE `insurancepolicydetail`;

-- DropTable
DROP TABLE `loangeneralquestionanswer`;

-- DropTable
DROP TABLE `loanparty`;

-- DropTable
DROP TABLE `loanpartyaddress`;

-- DropTable
DROP TABLE `loanpartyfinancialdetails`;

-- DropTable
DROP TABLE `loanpartyoccupationaldetails`;

-- DropTable
DROP TABLE `loanpartypersonaldetails`;

-- DropTable
DROP TABLE `loanpartysalarieddetails`;

-- DropTable
DROP TABLE `loanreference`;

-- DropTable
DROP TABLE `loanrequirementdetails`;

-- DropTable
DROP TABLE `mortgagepropertydetail`;

-- CreateTable
CREATE TABLE `CoApplicantFinancialDetails` (
    `id` VARCHAR(191) NOT NULL,
    `coApplicantId` VARCHAR(191) NOT NULL,
    `grossMonthlyIncome` DOUBLE NULL,
    `netMonthlyIncome` DOUBLE NULL,
    `averageMonthlyExpenses` DOUBLE NULL,
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

    UNIQUE INDEX `CoApplicantFinancialDetails_coApplicantId_key`(`coApplicantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guarantor` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `motherName` VARCHAR(191) NULL,
    `woname` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `contactNumber` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `panNumber` VARCHAR(191) NULL,
    `aadhaarNumber` VARCHAR(191) NULL,
    `voterId` VARCHAR(191) NULL,
    `drivingLicence` VARCHAR(191) NULL,
    `passportNumber` VARCHAR(191) NULL,
    `category` ENUM('GENERAL', 'SC', 'ST', 'NT', 'OBC', 'OTHER') NULL,
    `maritalStatus` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER') NULL,
    `noOfDependents` INTEGER NULL,
    `noOfChildren` INTEGER NULL,
    `qualification` VARCHAR(191) NULL,
    `correspondenceAddressType` ENUM('RESIDENCE', 'OFFICE') NULL,
    `relationshipWithApplicant` ENUM('SPOUSE', 'PARTNER', 'BUSINESS_PARTNER', 'FATHER', 'MOTHER', 'SIBLING', 'FRIEND', 'OTHER') NULL,
    `relationshipOther` VARCHAR(191) NULL,
    `accommodationType` ENUM('OWN', 'FAMILY', 'RENTED', 'EMPLOYER') NULL,
    `periodOfStay` VARCHAR(191) NULL,
    `rentPerMonth` DOUBLE NULL,
    `employmentType` ENUM('salaried', 'self_employed', 'business', 'professional') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuarantorFinancialDetails` (
    `id` VARCHAR(191) NOT NULL,
    `guarantorId` VARCHAR(191) NOT NULL,
    `grossMonthlyIncome` DOUBLE NULL,
    `netMonthlyIncome` DOUBLE NULL,
    `averageMonthlyExpenses` DOUBLE NULL,
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

    UNIQUE INDEX `GuarantorFinancialDetails_guarantorId_key`(`guarantorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExistingLoan` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `institutionName` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NULL,
    `disbursedAmount` DOUBLE NULL,
    `emi` DOUBLE NULL,
    `balanceTerm` INTEGER NULL,
    `balanceOutstanding` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditCard` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `holderName` VARCHAR(191) NOT NULL,
    `cardNumber` VARCHAR(191) NOT NULL,
    `issuingBank` VARCHAR(191) NULL,
    `holderSince` DATETIME(3) NULL,
    `creditLimit` DOUBLE NULL,
    `outstandingAmount` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankAccount` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `holderName` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `branchName` VARCHAR(191) NULL,
    `accountType` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `openingDate` DATETIME(3) NULL,
    `balanceAmount` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InsurancePolicy` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `issuedBy` VARCHAR(191) NULL,
    `branchName` VARCHAR(191) NULL,
    `holderName` VARCHAR(191) NULL,
    `policyNumber` VARCHAR(191) NULL,
    `maturityDate` DATETIME(3) NULL,
    `policyValue` DOUBLE NULL,
    `policyType` VARCHAR(191) NULL,
    `yearlyPremium` DOUBLE NULL,
    `paidUpValue` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Property` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `propertySelected` BOOLEAN NOT NULL,
    `addressId` VARCHAR(191) NULL,
    `landArea` DOUBLE NULL,
    `buildUpArea` DOUBLE NULL,
    `ownershipType` ENUM('SOLE', 'JOINT') NOT NULL,
    `landType` ENUM('FREEHOLD', 'LEASEHOLD') NOT NULL,
    `purchaseFrom` ENUM('BUILDER', 'SOCIETY', 'DEVELOPMENT_AUTHORITY', 'RESALE', 'SELF_CONSTRUCTION', 'OTHER') NOT NULL,
    `purchaseOther` VARCHAR(191) NULL,
    `constructionStage` ENUM('READY', 'UNDER_CONSTRUCTION') NOT NULL,
    `constructionPercent` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reference` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `pinCode` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanRequirement` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `loanAmount` DOUBLE NULL,
    `tenure` INTEGER NULL,
    `interestOption` ENUM('FIXED', 'VARIABLE') NOT NULL,
    `loanPurpose` ENUM('HOME', 'HOME_IMPROVEMENT', 'LAND_PURCHASE', 'NRPL', 'POST_DATED_CHEQUE', 'STANDING_INSTRUCTION') NOT NULL,
    `loanPurposeOther` VARCHAR(191) NULL,
    `repaymentMethod` ENUM('SALARY_DEDUCTION', 'ECS', 'CHEQUE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LoanRequirement_loanApplicationId_key`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanQuestionnaire` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `legalPropertyClear` BOOLEAN NULL,
    `mortgagedElsewhere` BOOLEAN NULL,
    `residentOfIndia` BOOLEAN NULL,
    `otherLoans` BOOLEAN NULL,
    `guarantorAnywhere` BOOLEAN NULL,
    `mppLifeInsurance` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LoanQuestionnaire_loanApplicationId_key`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `EmploymentDetails_guarantorId_idx` ON `EmploymentDetails`(`guarantorId`);

-- CreateIndex
CREATE INDEX `OccupationalDetails_guarantorId_idx` ON `OccupationalDetails`(`guarantorId`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_guarantorId_fkey` FOREIGN KEY (`guarantorId`) REFERENCES `Guarantor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoApplicantFinancialDetails` ADD CONSTRAINT `CoApplicantFinancialDetails_coApplicantId_fkey` FOREIGN KEY (`coApplicantId`) REFERENCES `CoApplicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OccupationalDetails` ADD CONSTRAINT `OccupationalDetails_guarantorId_fkey` FOREIGN KEY (`guarantorId`) REFERENCES `Guarantor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploymentDetails` ADD CONSTRAINT `EmploymentDetails_guarantorId_fkey` FOREIGN KEY (`guarantorId`) REFERENCES `Guarantor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guarantor` ADD CONSTRAINT `Guarantor_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuarantorFinancialDetails` ADD CONSTRAINT `GuarantorFinancialDetails_guarantorId_fkey` FOREIGN KEY (`guarantorId`) REFERENCES `Guarantor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExistingLoan` ADD CONSTRAINT `ExistingLoan_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditCard` ADD CONSTRAINT `CreditCard_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InsurancePolicy` ADD CONSTRAINT `InsurancePolicy_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reference` ADD CONSTRAINT `Reference_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanRequirement` ADD CONSTRAINT `LoanRequirement_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanQuestionnaire` ADD CONSTRAINT `LoanQuestionnaire_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
