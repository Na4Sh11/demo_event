-- AlterTable
ALTER TABLE `events` ADD COLUMN `no_of_tickets` INTEGER NULL,
    ADD COLUMN `price` INTEGER NULL,
    MODIFY `locale` VARCHAR(191) NULL,
    MODIFY `timezone` VARCHAR(191) NULL,
    MODIFY `url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user_events` ADD COLUMN `total_price` INTEGER NULL,
    MODIFY `no_of_tickets` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `organization` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `venues` MODIFY `timezone` VARCHAR(191) NULL;
