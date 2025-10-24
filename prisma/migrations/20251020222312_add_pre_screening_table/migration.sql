/*
  Warnings:

  - Made the column `passwordHash` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `passwordHash` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `PreScreening` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `firstTimeDonating` BOOLEAN NOT NULL,
    `weightMoreThanFiftyKilograms` VARCHAR(191) NULL,
    `wasTatooedInANonVerifiedPlace` VARCHAR(191) NULL,
    `gender` ENUM('M', 'F', 'O') NULL,

    UNIQUE INDEX `PreScreening_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PreScreening` ADD CONSTRAINT `PreScreening_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
