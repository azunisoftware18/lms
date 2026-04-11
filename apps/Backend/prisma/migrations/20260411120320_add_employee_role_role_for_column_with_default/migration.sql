-- AlterTable
ALTER TABLE `employeerole` ADD COLUMN `roleFor` ENUM('Employee', 'Partner') NOT NULL DEFAULT 'Employee';
