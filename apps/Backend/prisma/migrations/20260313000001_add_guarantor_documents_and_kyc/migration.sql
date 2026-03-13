-- AlterTable: Add guarantorId to Document
ALTER TABLE `Document` ADD COLUMN `guarantorId` VARCHAR(191) NULL;

-- AlterTable: Add kycId to Guarantor
ALTER TABLE `Guarantor` ADD COLUMN `kycId` VARCHAR(191) NULL;

-- CreateIndex: unique kycId on Guarantor
CREATE UNIQUE INDEX `Guarantor_kycId_key` ON `Guarantor`(`kycId`);

-- CreateIndex: unique (guarantorId, documentType) on Document
CREATE UNIQUE INDEX `Document_guarantorId_documentType_key` ON `Document`(`guarantorId`, `documentType`);

-- AddForeignKey: Document.guarantorId -> Guarantor.id
ALTER TABLE `Document` ADD CONSTRAINT `Document_guarantorId_fkey` FOREIGN KEY (`guarantorId`) REFERENCES `Guarantor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: Guarantor.kycId -> Kyc.id
ALTER TABLE `Guarantor` ADD CONSTRAINT `Guarantor_kycId_fkey` FOREIGN KEY (`kycId`) REFERENCES `Kyc`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
