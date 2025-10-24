/*
  Warnings:

  - You are about to alter the column `weightMoreThanFiftyKilograms` on the `PreScreening` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `wasTatooedInANonVerifiedPlace` on the `PreScreening` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `PreScreening` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `weightMoreThanFiftyKilograms` BOOLEAN NOT NULL,
    MODIFY `wasTatooedInANonVerifiedPlace` BOOLEAN NOT NULL;
