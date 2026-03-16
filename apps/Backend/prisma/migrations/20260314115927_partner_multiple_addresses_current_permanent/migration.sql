/*
  Warnings:

  - You are about to drop the column `addressId` on the `partner` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `partner` DROP FOREIGN KEY `Partner_addressId_fkey`;

-- DropIndex
DROP INDEX `Partner_addressId_key` ON `partner`;

-- AlterTable
ALTER TABLE `address` ADD COLUMN `partnerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `partner` DROP COLUMN `addressId`;

-- CreateIndex
CREATE INDEX `Address_partnerId_idx` ON `Address`(`partnerId`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
