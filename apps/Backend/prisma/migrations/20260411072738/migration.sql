/*
  Warnings:

  - You are about to drop the column `salary` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `employeerole` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleName]` on the table `EmployeeRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleName` to the `EmployeeRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleTitle` to the `EmployeeRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `EmployeeRole_name_key` ON `employeerole`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `salary`,
    ADD COLUMN `Email` VARCHAR(191) NOT NULL,
    ADD COLUMN `contactNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL,
    ADD COLUMN `reportingManagerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employeerole` DROP COLUMN `name`,
    ADD COLUMN `documentsOptions` VARCHAR(191) NULL,
    ADD COLUMN `documentsRequired` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `roleName` VARCHAR(191) NOT NULL,
    ADD COLUMN `roleTitle` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_Email_key` ON `Employee`(`Email`);

-- CreateIndex
CREATE UNIQUE INDEX `EmployeeRole_roleName_key` ON `EmployeeRole`(`roleName`);
