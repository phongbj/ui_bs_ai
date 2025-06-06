-- CreateTable
CREATE TABLE `ServiceUser` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `deleteFlag` BOOLEAN NOT NULL DEFAULT false,
    `deleteDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceUser_userId_key`(`userId`),
    INDEX `ServiceUser_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Credit` (
    `id` VARCHAR(191) NOT NULL,
    `serviceUserId` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Credit_serviceUserId_idx`(`serviceUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `serviceUserId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Project_serviceUserId_idx`(`serviceUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `id` VARCHAR(191) NOT NULL,
    `serviceUserId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Resource_serviceUserId_idx`(`serviceUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceUserLog` (
    `id` VARCHAR(191) NOT NULL,
    `serviceUserId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `details` TEXT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ServiceUserLog_serviceUserId_idx`(`serviceUserId`),
    INDEX `ServiceUserLog_action_idx`(`action`),
    INDEX `ServiceUserLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceUser` ADD CONSTRAINT `ServiceUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Credit` ADD CONSTRAINT `Credit_serviceUserId_fkey` FOREIGN KEY (`serviceUserId`) REFERENCES `ServiceUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_serviceUserId_fkey` FOREIGN KEY (`serviceUserId`) REFERENCES `ServiceUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_serviceUserId_fkey` FOREIGN KEY (`serviceUserId`) REFERENCES `ServiceUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceUserLog` ADD CONSTRAINT `ServiceUserLog_serviceUserId_fkey` FOREIGN KEY (`serviceUserId`) REFERENCES `ServiceUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
