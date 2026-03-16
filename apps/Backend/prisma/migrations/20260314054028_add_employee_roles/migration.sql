-- AlterTable
ALTER TABLE `employee` ADD COLUMN `employeeRoleId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `EmployeeRole` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmployeeRole_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Employee_employeeRoleId_idx` ON `Employee`(`employeeRoleId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_employeeRoleId_fkey` FOREIGN KEY (`employeeRoleId`) REFERENCES `EmployeeRole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
