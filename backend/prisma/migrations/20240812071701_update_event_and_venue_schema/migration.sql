-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_postedById_fkey`;

-- AlterTable
ALTER TABLE `events` MODIFY `postedById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`auth0_id`) ON DELETE SET NULL ON UPDATE CASCADE;
