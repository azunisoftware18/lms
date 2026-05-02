-- CreateTable
CREATE TABLE `LoginFeeRecord` (
    `id` VARCHAR(191) NOT NULL,
    `applicationNumber` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `leadNumber` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(191) NOT NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `feeAmount` DOUBLE NOT NULL DEFAULT 0,
    `gstAmount` DOUBLE NOT NULL DEFAULT 0,
    `totalAmount` DOUBLE NOT NULL DEFAULT 0,
    `loanAmount` DOUBLE NOT NULL DEFAULT 0,
    `paymentMode` VARCHAR(191) NOT NULL DEFAULT 'UPI',
    `status` ENUM('PENDING', 'PAID', 'WAIVED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `transactionId` VARCHAR(191) NULL,
    `institutionType` VARCHAR(191) NOT NULL DEFAULT 'NBFC',
    `institutionName` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `branchName` VARCHAR(191) NULL,
    `ifscCode` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,
    `chargedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chargedBy` VARCHAR(191) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `paidBy` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `branchId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LoginFeeRecord_applicationNumber_key`(`applicationNumber`),
    UNIQUE INDEX `LoginFeeRecord_transactionId_key`(`transactionId`),
    INDEX `LoginFeeRecord_leadId_idx`(`leadId`),
    INDEX `LoginFeeRecord_applicationNumber_idx`(`applicationNumber`),
    INDEX `LoginFeeRecord_transactionId_idx`(`transactionId`),
    INDEX `LoginFeeRecord_status_idx`(`status`),
    INDEX `LoginFeeRecord_branchId_idx`(`branchId`),
    INDEX `LoginFeeRecord_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoginFeeRecord` ADD CONSTRAINT `LoginFeeRecord_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
