-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_postedById_fkey`;

-- DropForeignKey
ALTER TABLE `user_events` DROP FOREIGN KEY `user_events_user_id_fkey`;

-- AlterTable
ALTER TABLE `events` MODIFY `postedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user_events` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`auth0_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_events` ADD CONSTRAINT `user_events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`auth0_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
