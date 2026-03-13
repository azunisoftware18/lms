-- CreateTable
CREATE TABLE `RolePermission` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'PARTNER') NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,
    `allowed` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `RolePermission_role_permissionId_key`(`role`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
