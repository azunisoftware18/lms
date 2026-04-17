/*
  Warnings:

  - You are about to drop the column `apiKey` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `assignedRmId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `branchMapping` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `integrationId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `loginId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `partnerId` on the `partner` table. All the data in the column will be lost.
  - You are about to drop the column `productAccess` on the `partner` table. All the data in the column will be lost.
  - Added the required column `alternateEmail` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Partner_partnerId_key` ON `partner`;

-- AlterTable
ALTER TABLE `partner` DROP COLUMN `apiKey`,
    DROP COLUMN `assignedRmId`,
    DROP COLUMN `branchMapping`,
    DROP COLUMN `integrationId`,
    DROP COLUMN `loginId`,
    DROP COLUMN `partnerId`,
    DROP COLUMN `productAccess`,
    ADD COLUMN `alternateEmail` VARCHAR(191) NOT NULL;
