-- DropForeignKey
ALTER TABLE `user_events` DROP FOREIGN KEY `user_events_user_id_fkey`;

-- AlterTable
ALTER TABLE `user_events` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `user_events` ADD CONSTRAINT `user_events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`auth0_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
