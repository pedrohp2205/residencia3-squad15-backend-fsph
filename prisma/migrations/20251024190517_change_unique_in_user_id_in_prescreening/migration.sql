-- DropForeignKey
ALTER TABLE `PreScreening` DROP FOREIGN KEY `PreScreening_userId_fkey`;

-- DropIndex
DROP INDEX `PreScreening_userId_key` ON `PreScreening`;


