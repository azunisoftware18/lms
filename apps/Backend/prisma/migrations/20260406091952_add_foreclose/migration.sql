-- CreateTable
CREATE TABLE `foreClosure` (
    `id` VARCHAR(191) NOT NULL,
    `loanApplicationId` VARCHAR(191) NOT NULL,
    `appliedBy` VARCHAR(191) NULL,
    `appliedAt` DATETIME(3) NULL,
    `applicationNote` VARCHAR(191) NULL,
    `principalOutstanding` DOUBLE NULL,
    `interestAccrued` DOUBLE NULL,
    `unpaidEmiCharges` DOUBLE NULL,
    `penalty` DOUBLE NULL,
    `totalPayable` DOUBLE NULL,
    `approvalStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `foreclosureAmount` DOUBLE NULL,
    `foreclosureApprovedBy` VARCHAR(191) NULL,
    `foreclosureApprovedAt` DATETIME(3) NULL,
    `settledAmount` DOUBLE NULL,
    `settledAt` DATETIME(3) NULL,
    `settlementReference` VARCHAR(191) NULL,
    `paymentMode` ENUM('CASH', 'UPI', 'BANK', 'CHEQUE') NULL,
    `settlementReceiptUrl` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `foreClosure_loanApplicationId_idx`(`loanApplicationId`),
    INDEX `foreClosure_approvalStatus_idx`(`approvalStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `foreClosure` ADD CONSTRAINT `foreClosure_loanApplicationId_fkey` FOREIGN KEY (`loanApplicationId`) REFERENCES `LoanApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
