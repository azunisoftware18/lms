/*
  Warnings:

  - Added the required column `city` to the `TechnicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `TechnicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyAddress` to the `TechnicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `TechnicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `technicalreport` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `pincode` VARCHAR(191) NOT NULL,
    ADD COLUMN `propertyAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL;
