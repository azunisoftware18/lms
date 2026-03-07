/*
  Warnings:

  - You are about to drop the column `accountType` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `bankAccountNumber` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `ifscCode` on the `customer` table. All the data in the column will be lost.
  - Added the required column `relationshipWithCoApplicant` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Made the column `aadhaarNumber` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `panNumber` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `accountType`,
    DROP COLUMN `bankAccountNumber`,
    DROP COLUMN `bankName`,
    DROP COLUMN `ifscCode`,
    ADD COLUMN `relationWithCoApplicantOther` VARCHAR(191) NULL,
    ADD COLUMN `relationshipWithCoApplicant` ENUM('SPOUSE', 'PARTNER', 'BUSINESS_PARTNER', 'FATHER', 'MOTHER', 'SIBLING', 'FRIEND', 'OTHER') NOT NULL,
    ADD COLUMN `woname` VARCHAR(191) NULL,
    MODIFY `aadhaarNumber` VARCHAR(191) NOT NULL,
    MODIFY `panNumber` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `LoanParty` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `role` ENUM('APPLICANT', 'CO_APPLICANT', 'GUARANTOR') NOT NULL,
    `sequence` INTEGER NOT NULL DEFAULT 1,
    `customerId` VARCHAR(191) NULL,
    `coApplicantId` VARCHAR(191) NULL,
    `photoPath` VARCHAR(191) NULL,
    `signaturePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LoanParty_loanApplicationId_idx`(`loanApplicationId`),
    INDEX `LoanParty_customerId_idx`(`customerId`),
    INDEX `LoanParty_coApplicantId_idx`(`coApplicantId`),
    UNIQUE INDEX `LoanParty_loanApplicationId_role_sequence_key`(`loanApplicationId`, `role`, `sequence`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanPartyPersonalDetails` (
    `id` VARCHAR(191) NOT NULL,
    `loanPartyId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `middleName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NULL,
    `motherName` VARCHAR(191) NULL,
    `spouseOrGuardianName` VARCHAR(191) NULL,
    `contactNumber` VARCHAR(191) NULL,
    `alternateNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phoneWithStdCode` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `category` ENUM('GENERAL', 'SC', 'ST', 'NT', 'OBC', 'OTHER') NULL,
    `categoryOther` VARCHAR(191) NULL,
    `maritalStatus` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER') NULL,
    `maritalStatusOther` VARCHAR(191) NULL,
    `noOfFamilyDependents` INTEGER NULL,
    `noOfChildren` INTEGER NULL,
    `noOfOtherDependents` INTEGER NULL,
    `qualification` VARCHAR(191) NULL,
    `passportNumber` VARCHAR(191) NULL,
    `panNumber` VARCHAR(191) NULL,
    `drivingLicenseNo` VARCHAR(191) NULL,
    `voterIdAadhaarNo` VARCHAR(191) NULL,
    `relationshipWithApplicant` VARCHAR(191) NULL,
    `correspondenceAddressType` ENUM('RESIDENCE', 'OFFICE') NULL,
    `presentAccommodation` ENUM('OWN', 'FAMILY', 'RENTED', 'EMPLOYER') NULL,
    `periodOfStay` VARCHAR(191) NULL,
    `rentedRentPerMonth` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LoanPartyPersonalDetails_loanPartyId_key`(`loanPartyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanPartyAddress` (
    `id` VARCHAR(191) NOT NULL,
    `loanPartyId` VARCHAR(191) NOT NULL,
    `addressType` ENUM('CURRENT_RESIDENTIAL', 'PERMANENT', 'CORRESPONDENCE', 'OFFICE') NOT NULL,
    `addressLine1` VARCHAR(191) NULL,
    `addressLine2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `pinCode` VARCHAR(191) NULL,
    `landmark` VARCHAR(191) NULL,
    `phoneNumberWithStdCode` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LoanPartyAddress_loanPartyId_addressType_idx`(`loanPartyId`, `addressType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanPartyOccupationalDetails` (
    `id` VARCHAR(191) NOT NULL,
    `loanPartyId` VARCHAR(191) NOT NULL,
    `occupationalCategory` ENUM('SALARIED', 'BUSINESS', 'PROFESSIONAL', 'OTHER') NULL,
    `occupationalCategoryOther` VARCHAR(191) NULL,
    `companyBusinessName` VARCHAR(191) NULL,
    `addressLine1` VARCHAR(191) NULL,
    `addressLine2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `pinCode` VARCHAR(191) NULL,
    `landmark` VARCHAR(191) NULL,
    `phoneNumberWithStdCode` VARCHAR(191) NULL,
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

    UNIQUE INDEX `LoanPartyOccupationalDetails_loanPartyId_key`(`loanPartyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanPartySalariedDetails` (
    `id` VARCHAR(191) NOT NULL,
    `loanPartyId` VARCHAR(191) NOT NULL,
    `employerType` ENUM('PUBLIC_LTD', 'MNC', 'EDUCATIONAL_INST', 'CENTRAL_STATE_GOVT', 'PUBLIC_SECTOR_UNIT', 'PROPRIETOR_PARTNERSHIP', 'PRIVATE_LTD', 'OTHER') NULL,
    `employerTypeOther` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `dateOfJoining` DATETIME(3) NULL,
    `dateOfRetirement` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LoanPartySalariedDetails_loanPartyId_key`(`loanPartyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanPartyFinancialDetails` (
    `id` VARCHAR(191) NOT NULL,
    `loanPartyId` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `LoanPartyFinancialDetails_loanPartyId_key`(`loanPartyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanRequirementDetails` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `restFrequency` ENUM('ANNUAL', 'MONTHLY', 'FIXED', 'VARIABLE') NULL,
    `interestOption` ENUM('HOME_LOAN', 'LAND_PURCHASE_LOAN', 'HOME_IMPROVEMENT', 'HOME_EXTENSION_LOAN', 'NRPL', 'OTHER') NULL,
    `tenureMonths` INTEGER NULL,
    `purposeOfLoan` VARCHAR(191) NULL,
    `repaymentMethod` ENUM('SALARY_DEDUCTION', 'POST_DATED_CHEQUE', 'STANDING_INSTRUCTION_TO_BANKER', 'OTHER') NULL,
    `paymentMethodOther` VARCHAR(191) NULL,
    `standingInstructionToBank` BOOLEAN NULL DEFAULT false,
    `landCost` DOUBLE NULL,
    `agreementValue` DOUBLE NULL,
    `stampDutyRegCharges` DOUBLE NULL,
    `costOfConstructionExclImp` DOUBLE NULL,
    `incidentals` DOUBLE NULL,
    `totalRequirementOfFundsA` DOUBLE NULL,
    `amountSpent` DOUBLE NULL,
    `balanceFundSaving` DOUBLE NULL,
    `disposalOfAsset` DOUBLE NULL,
    `family` DOUBLE NULL,
    `others` DOUBLE NULL,
    `totalBalanceFund` DOUBLE NULL,
    `loanRequired` DOUBLE NULL,
    `totalSourceOfFundsB` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LoanRequirementDetails_loanApplicationId_key`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanGeneralQuestionAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `question` ENUM('LEGAL_TITLE_CLEAR', 'MPPL_ELIGIBLE_FOR_MORTGAGE', 'APPLICANT_RESIDENT_OF_INDIA', 'APPLICANT_APPLIED_TO_MPPL_EARLIER', 'APPLICANTS_HAVE_ANY_GUARANTEE', 'HAS_LOAN_WITH_MPPL', 'READY_TO_PROVIDE_DWELLING_UNIT_ON_RENT', 'ABOUT_MPPL_SOURCE_PAPER_INSERT', 'ABOUT_MPPL_SOURCE_TV_ADVT', 'ABOUT_MPPL_SOURCE_PERSONAL_VISIT', 'ABOUT_MPPL_SOURCE_EXISTING_CUSTOMER', 'ABOUT_MPPL_SOURCE_CARDS', 'ABOUT_MPPL_SOURCE_PAPER_ADVT', 'ABOUT_MPPL_SOURCE_OTHERS', 'PREFERRED_LOAN_SANCTION_PLACE_OWN', 'PREFERRED_LOAN_SANCTION_PLACE_CAR', 'PREFERRED_LOAN_SANCTION_PLACE_TWO_WHEELER', 'PREFERRED_LOAN_SANCTION_PLACE_COMPUTER', 'PREFERRED_LOAN_SANCTION_PLACE_AIR_CONDITIONER', 'PREFERRED_LOAN_SANCTION_PLACE_REFRIGERATOR', 'PREFERRED_LOAN_SANCTION_PLACE_MICROWAVE', 'COMMUNICATION_RECEIVE_HINDI', 'COMMUNICATION_RECEIVE_ENGLISH', 'INSURANCE_INTEREST_YES', 'INSURANCE_INTEREST_NO') NOT NULL,
    `answer` BOOLEAN NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LoanGeneralQuestionAnswer_loanApplicationId_idx`(`loanApplicationId`),
    UNIQUE INDEX `LoanGeneralQuestionAnswer_loanApplicationId_question_key`(`loanApplicationId`, `question`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanReference` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `referenceOrder` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `pinCode` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LoanReference_loanApplicationId_idx`(`loanApplicationId`),
    UNIQUE INDEX `LoanReference_loanApplicationId_referenceOrder_key`(`loanApplicationId`, `referenceOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExistingLoanDetail` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `institutionName` VARCHAR(191) NULL,
    `purpose` VARCHAR(191) NULL,
    `disbursedLoanAmount` DOUBLE NULL,
    `emi` DOUBLE NULL,
    `balanceTerm` VARCHAR(191) NULL,
    `balanceOutstanding` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExistingLoanDetail_loanApplicationId_idx`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditCardDetail` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `holderName` VARCHAR(191) NULL,
    `creditCardNo` VARCHAR(191) NULL,
    `cardHolderSince` DATETIME(3) NULL,
    `issuingBank` VARCHAR(191) NULL,
    `creditLimit` DOUBLE NULL,
    `outstandingAmount` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CreditCardDetail_loanApplicationId_idx`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankAccountDetail` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `holderName` VARCHAR(191) NULL,
    `bankNameBranch` VARCHAR(191) NULL,
    `accountType` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,
    `accountOpeningDate` DATETIME(3) NULL,
    `balanceAmount` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BankAccountDetail_loanApplicationId_idx`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InsurancePolicyDetail` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `policyOrder` INTEGER NULL,
    `issuedBy` VARCHAR(191) NULL,
    `branchName` VARCHAR(191) NULL,
    `holderName` VARCHAR(191) NULL,
    `policyNo` VARCHAR(191) NULL,
    `maturityDate` DATETIME(3) NULL,
    `policyValue` DOUBLE NULL,
    `policyType` VARCHAR(191) NULL,
    `premiumYearly` DOUBLE NULL,
    `paidUpValue` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InsurancePolicyDetail_loanApplicationId_idx`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MortgagePropertyDetail` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `isPropertySelected` BOOLEAN NOT NULL DEFAULT false,
    `propertyAddress` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `pinCode` VARCHAR(191) NULL,
    `landmark` VARCHAR(191) NULL,
    `landAreaSqMtr` DOUBLE NULL,
    `builtUpAreaSqMtr` DOUBLE NULL,
    `ownershipType` ENUM('SOLE', 'JOINT') NULL,
    `landType` ENUM('FREEHOLD', 'LEASEHOLD') NULL,
    `purchasedForm` ENUM('BUILDER', 'SOCIETY', 'DEVELOPMENT_AUTHORITY_HOUSING_BOARD', 'RESALE', 'SELF_CONSTRUCTION', 'OTHER') NULL,
    `purchasedFormOther` VARCHAR(191) NULL,
    `constructionStage` ENUM('READY', 'UNDER_CONSTRUCTION') NULL,
    `stageOfConstructionPct` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MortgagePropertyDetail_loanApplicationId_idx`(`loanApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoanParty` ADD CONSTRAINT `LoanParty_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanParty` ADD CONSTRAINT `LoanParty_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanParty` ADD CONSTRAINT `LoanParty_coApplicantId_fkey` FOREIGN KEY (`coApplicantId`) REFERENCES `CoApplicant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanPartyPersonalDetails` ADD CONSTRAINT `LoanPartyPersonalDetails_loanPartyId_fkey` FOREIGN KEY (`loanPartyId`) REFERENCES `LoanParty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanPartyAddress` ADD CONSTRAINT `LoanPartyAddress_loanPartyId_fkey` FOREIGN KEY (`loanPartyId`) REFERENCES `LoanParty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanPartyOccupationalDetails` ADD CONSTRAINT `LoanPartyOccupationalDetails_loanPartyId_fkey` FOREIGN KEY (`loanPartyId`) REFERENCES `LoanParty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanPartySalariedDetails` ADD CONSTRAINT `LoanPartySalariedDetails_loanPartyId_fkey` FOREIGN KEY (`loanPartyId`) REFERENCES `LoanParty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanPartyFinancialDetails` ADD CONSTRAINT `LoanPartyFinancialDetails_loanPartyId_fkey` FOREIGN KEY (`loanPartyId`) REFERENCES `LoanParty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanRequirementDetails` ADD CONSTRAINT `LoanRequirementDetails_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanGeneralQuestionAnswer` ADD CONSTRAINT `LoanGeneralQuestionAnswer_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanReference` ADD CONSTRAINT `LoanReference_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExistingLoanDetail` ADD CONSTRAINT `ExistingLoanDetail_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditCardDetail` ADD CONSTRAINT `CreditCardDetail_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccountDetail` ADD CONSTRAINT `BankAccountDetail_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InsurancePolicyDetail` ADD CONSTRAINT `InsurancePolicyDetail_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MortgagePropertyDetail` ADD CONSTRAINT `MortgagePropertyDetail_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
