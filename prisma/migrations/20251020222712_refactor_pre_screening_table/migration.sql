/*
  Warnings:

  - Made the column `weightMoreThanFiftyKilograms` on table `PreScreening` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wasTatooedInANonVerifiedPlace` on table `PreScreening` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `PreScreening` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `PreScreening` MODIFY `weightMoreThanFiftyKilograms` VARCHAR(191) NOT NULL,
    MODIFY `wasTatooedInANonVerifiedPlace` VARCHAR(191) NOT NULL,
    MODIFY `gender` ENUM('M', 'F', 'O') NOT NULL;
