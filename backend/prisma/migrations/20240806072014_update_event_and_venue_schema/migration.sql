-- AlterTable
ALTER TABLE `events` ADD COLUMN `localTime` VARCHAR(191) NULL,
    MODIFY `localDate` VARCHAR(191) NOT NULL;
