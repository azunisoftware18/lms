-- AlterTable
ALTER TABLE `loantype` DROP COLUMN `documentsOptions`,
    DROP COLUMN `documentsRequired`,
    ADD COLUMN `applicantDocumentsOptional` VARCHAR(191) NULL,
    ADD COLUMN `applicantDocumentsRequired` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `coApplicantDocumentsOptional` VARCHAR(191) NULL,
    ADD COLUMN `coApplicantDocumentsRequired` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `guarantorDocumentsOptional` VARCHAR(191) NULL,
    ADD COLUMN `guarantorDocumentsRequired` VARCHAR(191) NOT NULL DEFAULT '';
