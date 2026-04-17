-- AlterTable
ALTER TABLE `document` ADD COLUMN `employeeId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Document_employeeId_documentType_idx` ON `Document`(`employeeId`, `documentType`);

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
