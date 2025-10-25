-- AlterTable
ALTER TABLE `User` MODIFY `passwordHash` VARCHAR(191) NULL,
    MODIFY `cpf` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `PreScreening` ADD CONSTRAINT `PreScreening_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
