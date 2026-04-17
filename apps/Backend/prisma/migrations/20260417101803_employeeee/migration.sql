/*
  Warnings:

  - You are about to drop the column `aadhaarNumber` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `alternateEmail` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `partner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partnerId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `AadhaarNumber` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partnerId` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `partner` DROP COLUMN `aadhaarNumber`,
    DROP COLUMN `alternateEmail`,
    DROP COLUMN `status`,
    ADD COLUMN `AadhaarNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `Status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLACKLISTED') NOT NULL,
    ADD COLUMN `apiKey` VARCHAR(191) NULL,
    ADD COLUMN `assignedRmId` VARCHAR(191) NULL,
    ADD COLUMN `branchMapping` JSON NULL,
    ADD COLUMN `businessCategory` VARCHAR(191) NULL,
    ADD COLUMN `businessNature` VARCHAR(191) NULL,
    ADD COLUMN `companyName` VARCHAR(191) NOT NULL,
    ADD COLUMN `designation` VARCHAR(191) NULL,
    ADD COLUMN `gstinNumber` VARCHAR(191) NULL,
    ADD COLUMN `integrationId` VARCHAR(191) NULL,
    ADD COLUMN `loginId` VARCHAR(191) NULL,
    ADD COLUMN `officeStrength` INTEGER NULL,
    ADD COLUMN `partnerId` VARCHAR(191) NOT NULL,
    ADD COLUMN `productAccess` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Partner_partnerId_key` ON `Partner`(`partnerId`);
