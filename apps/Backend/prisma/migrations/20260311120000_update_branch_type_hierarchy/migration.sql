/*
  Warnings:

  - The values [SUPER,MAIN,SUB] on the enum `Branch_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Branch` MODIFY `type` ENUM('HEAD_OFFICE', 'ZONAL', 'REGIONAL', 'BRANCH') NOT NULL;
