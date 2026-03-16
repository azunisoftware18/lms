-- CreateTable
CREATE TABLE `RequiredKycDocument` (
    `id` VARCHAR(191) NOT NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RequiredKycDocument_documentType_key`(`documentType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
